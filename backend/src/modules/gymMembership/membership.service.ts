import {
  ErrorCode,
  type SubscriptionInfo,
  UserRole,
} from '@ahmedrioueche/gympro-client';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model, Types } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { CreateMemberDto } from '../auth/auth.dto';
import { GymModel } from '../gym/gym.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { GymMembershipModel } from './membership.schema';

@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(GymMembershipModel.name)
    private membershipModel: Model<GymMembershipModel>,
    @InjectModel(GymModel.name) private gymModel: Model<GymModel>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createMember(dto: CreateMemberDto, createdBy: string) {
    const { email, phoneNumber, gymId, fullName, gender, age } = dto;

    // Validate that at least one contact method is provided or generate dummy ones
    let finalEmail = email;
    let finalPhone = phoneNumber;
    let isDummyUser = false;

    if (!email && !phoneNumber) {
      isDummyUser = true;
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      finalEmail = `no_contact_${timestamp}_${random}@gympro.local`;
      // Phone remains undefined
    }

    // Check if user already exists
    const existingUserQuery: any = {};
    if (finalEmail) {
      existingUserQuery['profile.email'] = finalEmail;
    }
    if (finalPhone) {
      if (Object.keys(existingUserQuery).length > 0) {
        existingUserQuery.$or = [
          { 'profile.email': finalEmail },
          { 'profile.phoneNumber': finalPhone },
        ];
        delete existingUserQuery['profile.email'];
      } else {
        existingUserQuery['profile.phoneNumber'] = finalPhone;
      }
    }

    let user = await this.userModel.findOne(existingUserQuery);
    let isNewUser = false;
    let setupToken: string | undefined;

    // Prevent creator from creating a member using their own contact info
    try {
      const creator = await this.userModel
        .findById(createdBy)
        .select('profile.email profile.phoneNumber')
        .lean()
        .exec();

      const normalizeEmail = (e?: string) =>
        e ? e.toLowerCase().trim() : undefined;
      const normalizePhone = (p?: string) =>
        p ? p.replace(/\D/g, '') : undefined;

      const creatorEmail = normalizeEmail(creator?.profile?.email);
      const creatorPhone = normalizePhone(creator?.profile?.phoneNumber);

      const incomingEmail = normalizeEmail(email);
      const incomingPhone = normalizePhone(phoneNumber);

      if (
        (incomingEmail && creatorEmail && incomingEmail === creatorEmail) ||
        (incomingPhone && creatorPhone && incomingPhone === creatorPhone)
      ) {
        throw new BadRequestException({
          message:
            'Cannot create a member using the same email or phone as your account',
          errorCode: ErrorCode.INVALID_USER_DATA,
        });
      }
    } catch (err) {
      // If the thrown error is our BadRequestException, rethrow it.
      if (err instanceof BadRequestException) throw err;
      // Otherwise, log and continue — do not block member creation on creator lookup errors
      this.logger.warn(
        `Failed to validate creator contact info for createMember: ${err}`,
      );
    }

    // If user doesn't exist, create new user with pending_setup status
    if (!user) {
      isNewUser = true;
      if (!isDummyUser) {
        setupToken = crypto.randomBytes(32).toString('hex');
      }
      const setupTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Generate a temporary password (user will set their own via setup link)
      const tempPassword = await bcrypt.hash(
        crypto.randomBytes(32).toString('hex'),
        10,
      );

      user = new this.userModel({
        profile: {
          username: finalEmail
            ? finalEmail.split('@')[0]
            : `user_${finalPhone?.slice(-4)}`,
          email: finalEmail || undefined,
          phoneNumber: finalPhone || undefined,
          fullName: fullName || undefined,
          gender: gender || undefined,
          age: age || undefined,
          password: tempPassword,
          isValidated: false,
          phoneNumberVerified: false,
          accountStatus: 'pending_setup',
          isOnBoarded: false,
          isActive: false,
        },
        role: UserRole.Member,
        memberships: [],
        subscriptionHistory: [],
        notifications: [],
        setupToken,
        setupTokenExpiry,
        setupTokenUsed: false,
      });

      await user.save();
      this.logger.log(`Created new user ${user._id} for member creation`);
    } else {
      // Prevent owner/manager from being added as member to their own gym (security/logic check)
      if (
        user.role === UserRole.Owner ||
        user.role === UserRole.Manager ||
        user.role === UserRole.Staff
      ) {
        throw new BadRequestException({
          message: 'Cannot add a specific role user as a member.',
          errorCode: ErrorCode.INVALID_ROLE,
        });
      }

      // User exists - check if they already have membership to this gym
      const existingMembership = await this.membershipModel.findOne({
        gym: new Types.ObjectId(gymId),
        _id: { $in: user.memberships },
      });

      if (existingMembership) {
        throw new BadRequestException({
          message: 'User is already a member of this gym',
          errorCode: ErrorCode.USER_ALREADY_EXISTS,
        });
      }
    }

    // Create subscription info if provided
    let subscriptionInfo: SubscriptionInfo | undefined = undefined;
    if (dto.subscriptionTypeId && dto.subscriptionStartDate) {
      // Calculate end date based on subscription type
      // For now, we'll set it to 1 month from start date as default
      // This should be enhanced to fetch actual subscription type duration
      const startDate = new Date(dto.subscriptionStartDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      subscriptionInfo = {
        typeId: dto.subscriptionTypeId,
        startDate: dto.subscriptionStartDate,
        endDate: endDate.toISOString().split('T')[0],
        status: 'active' as const,
        paymentMethod: dto.paymentMethod as any, // Type is validated in DTO
      };
    }

    // Create gym membership
    const membership = new this.membershipModel({
      user: user._id,
      gym: new Types.ObjectId(gymId),
      roles: [UserRole.Member],
      joinedAt: new Date().toISOString(),
      membershipStatus: 'active',
      subscription: subscriptionInfo,
      createdAt: new Date(),
      createdBy,
    });

    await membership.save();
    this.logger.log(`Saved membership: ${membership._id} to gym_memberships`);

    // Add membership to user
    user.memberships.push(membership._id);
    await user.save();
    this.logger.log(`Added membership ${membership._id} to user ${user._id}`);

    // Send notification to existing users who were added to a new gym
    if (!isNewUser && !isDummyUser) {
      try {
        // Fetch gym details for notification
        const gym = await this.gymModel
          .findById(gymId)
          .select('name')
          .lean()
          .exec();

        if (gym) {
          await this.notificationsService.notifyUser(user, {
            key: 'gym_membership_added',
            vars: {
              name: user.profile?.fullName || 'Member',
              gymName: gym.name,
            },
            type: 'subscription',
            priority: 'medium',
            relatedId: gymId,
            skipExternal: true, // Controller already sends external invitation email/sms
          });
          this.logger.log(
            `Sent gym membership notification to existing user ${user._id}`,
          );
        }
      } catch (notifError) {
        // Don't fail member creation if notification fails
        this.logger.error(
          `Failed to send gym membership notification: ${notifError}`,
        );
      }
    }

    this.logger.log(
      `Created membership ${membership._id} for user ${user._id} in gym ${gymId}`,
    );

    return {
      membership: membership.toObject(),
      user: this.sanitizeUser(user),
      setupToken: isNewUser ? setupToken : undefined,
      isNewUser,
    };
  }

  /**
   * Get a member's details by membership ID
   */
  async getMember(membershipId: string, gymId: string) {
    const membership = await this.membershipModel
      .findOne({
        _id: new Types.ObjectId(membershipId),
        gym: new Types.ObjectId(gymId),
      })
      .populate('gym')
      .exec();

    if (!membership) {
      throw new BadRequestException({
        message: 'Membership not found',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    // Find the user who has this membership
    const user = await this.userModel
      .findOne({ memberships: membership._id })
      .select(
        '-profile.password -setupToken -setupTokenExpiry -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry',
      )
      .exec();

    if (!user) {
      throw new BadRequestException({
        message: 'User not found for this membership',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    return {
      membership: membership.toObject(),
      user: user.toObject(),
    };
  }

  /**
   * Update a member's profile and/or subscription
   */
  async updateMember(
    membershipId: string,
    gymId: string,
    dto: {
      fullName?: string;
      email?: string;
      phoneNumber?: string;
      gender?: string;
      age?: string;
      subscriptionTypeId?: string;
      subscriptionStartDate?: string;
      subscriptionEndDate?: string;
      subscriptionStatus?: string;
      membershipStatus?: string;
    },
  ) {
    const membership = await this.membershipModel
      .findOne({
        _id: new Types.ObjectId(membershipId),
        gym: new Types.ObjectId(gymId),
      })
      .exec();

    if (!membership) {
      throw new BadRequestException({
        message: 'Membership not found',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    // Find and update the user
    const user = await this.userModel
      .findOne({ memberships: membership._id })
      .exec();

    if (!user) {
      throw new BadRequestException({
        message: 'User not found for this membership',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    // Update user profile fields
    if (dto.fullName !== undefined) user.profile.fullName = dto.fullName;
    if (dto.email !== undefined) user.profile.email = dto.email;
    if (dto.phoneNumber !== undefined)
      user.profile.phoneNumber = dto.phoneNumber;
    if (dto.gender !== undefined) user.profile.gender = dto.gender;
    if (dto.age !== undefined) user.profile.age = dto.age;

    await user.save();

    // Update membership fields
    if (dto.membershipStatus !== undefined) {
      membership.membershipStatus = dto.membershipStatus as any;
    }

    // Update subscription if provided
    if (
      dto.subscriptionTypeId ||
      dto.subscriptionStartDate ||
      dto.subscriptionEndDate ||
      dto.subscriptionStatus
    ) {
      if (!membership.subscription) {
        membership.subscription = {} as any;
      }
      if (dto.subscriptionTypeId)
        membership.subscription!.typeId = dto.subscriptionTypeId;
      if (dto.subscriptionStartDate)
        membership.subscription!.startDate = dto.subscriptionStartDate;
      if (dto.subscriptionEndDate)
        membership.subscription!.endDate = dto.subscriptionEndDate;
      if (dto.subscriptionStatus)
        membership.subscription!.status = dto.subscriptionStatus as any;
    }

    await membership.save();

    this.logger.log(
      `Updated member ${user._id} with membership ${membershipId}`,
    );

    return {
      membership: membership.toObject(),
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Delete a member from a gym (removes membership, not the user)
   */
  async deleteMember(membershipId: string, gymId: string) {
    const membership = await this.membershipModel
      .findOne({
        _id: new Types.ObjectId(membershipId),
        gym: new Types.ObjectId(gymId),
      })
      .exec();

    if (!membership) {
      throw new BadRequestException({
        message: 'Membership not found',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    // Find the user and remove this membership from their array
    const user = await this.userModel
      .findOne({ memberships: membership._id })
      .exec();

    if (user) {
      user.memberships = user.memberships.filter(
        (m: any) => m.toString() !== membershipId,
      );
      await user.save();
    }

    // Delete the membership document
    await this.membershipModel.deleteOne({ _id: membership._id });

    this.logger.log(`Deleted membership ${membershipId} from gym ${gymId}`);

    return { deleted: true, membershipId };
  }

  private sanitizeUser(user: any) {
    const userObj = user.toObject ? user.toObject() : user;

    if (userObj.profile?.password) {
      delete userObj.profile.password;
    }

    delete userObj.verificationToken;
    delete userObj.verificationTokenExpiry;
    delete userObj.resetPasswordToken;
    delete userObj.resetPasswordTokenExpiry;
    delete userObj.setupToken;
    delete userObj.setupTokenExpiry;

    return userObj;
  }

  /**
   * Get all memberships for the current user with populated gym details
   */
  async getMyMemberships(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const memberships = await this.membershipModel
      .find({ user: userObjectId })
      .populate('gym', 'name location slogan')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    this.logger.log(
      `Fetched ${memberships.length} memberships for user ${userId}`,
    );

    return memberships;
  }

  /**
   * Get membership for the current user in a specific gym with populated history
   */
  async getMyMembershipInGym(userId: string, gymId: string) {
    this.logger.log(`getMyMembershipInGym: userId=${userId}, gymId=${gymId}`);

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(gymId)) {
      this.logger.warn(`Invalid ID format: userId=${userId}, gymId=${gymId}`);
      throw new BadRequestException({
        message: 'Invalid ID format',
        errorCode: ErrorCode.INVALID_USER_DATA,
      });
    }

    // 1. Fetch current active/pending/expired membership
    const membership = await this.membershipModel
      .findOne({
        user: userId, // Mongoose auto-casts
        gym: gymId, // Mongoose auto-casts
      })
      .populate('gym', 'name location slogan')
      .lean()
      .exec();

    // 2. Fetch subscription history for this gym from user's history
    // For the match clause on a Mixed type (gym object), we should try to match both string and ObjectId if possible,
    // or rely on how it's stored. Since we don't know for sure, let's try strict matching with what we have.
    // Ideally we shouldn't cast manually if we can avoid it, but inside 'match' for a subdocument, we might need to.
    // However, if we know gymId is valid (checked above), explicit cast is safe from crashing.

    const user = await this.userModel
      .findById(userId)
      .populate({
        path: 'subscriptionHistory',
        match: { 'gym._id': gymId }, // Try matching string first (common for Mixed types from JSON)
        options: { sort: { createdAt: -1 } },
      })
      .select('subscriptionHistory')
      .lean()
      .exec();

    // If history is empty, it might be because gym._id is stored as ObjectId.
    // But let's first fix the crash.

    return {
      membership: membership || null,
      history: user?.subscriptionHistory || [],
    };
  }
}
