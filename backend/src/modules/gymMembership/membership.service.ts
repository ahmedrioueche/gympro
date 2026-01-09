import {
  ErrorCode,
  MembershipStatus,
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
import {
  SubscriptionHistoryModel,
  SubscriptionTypeModel,
} from '../gymSubscription/gymSubscription.schema';
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
    @InjectModel(SubscriptionTypeModel.name)
    private subscriptionTypeModel: Model<SubscriptionTypeModel>,
    @InjectModel('SubscriptionHistory')
    private historyModel: Model<SubscriptionHistoryModel>,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Safely convert a string to a Mongoose ObjectId
   */
  private toObjectId(id: any): Types.ObjectId | null {
    if (!id || typeof id !== 'string') return null;
    const cid = id.trim();
    if (Types.ObjectId.isValid(cid) && cid.length === 24) {
      try {
        return new Types.ObjectId(cid);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

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
      const gymObjectId = this.toObjectId(gymId);
      if (!gymObjectId) {
        throw new BadRequestException({
          message: 'Invalid gymId format',
          errorCode: ErrorCode.INVALID_USER_DATA,
        });
      }

      const existingMembership = await this.membershipModel.findOne({
        gym: gymObjectId,
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
    const gymObjectId = this.toObjectId(gymId);
    if (!gymObjectId) {
      throw new BadRequestException({
        message: 'Invalid gymId format',
        errorCode: ErrorCode.INVALID_USER_DATA,
      });
    }

    const membership = new this.membershipModel({
      user: user._id,
      gym: gymObjectId,
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

    // FIX: Add initial subscription to history
    if (subscriptionInfo) {
      if (!user.subscriptionHistory) {
        user.subscriptionHistory = [];
      }

      // Fetch gym details for history entry
      const gym = await this.gymModel
        .findById(gymId)
        .select('name location slogan slug')
        .lean()
        .exec();

      const history = new this.historyModel({
        subscription: subscriptionInfo,
        gym: gym || ({ _id: gymObjectId } as any),
        handledBy: createdBy,
        notes: 'Initial subscription upon registration',
      });
      await history.save();
      user.subscriptionHistory.push(history._id);
    }

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
    const memObjectId = this.toObjectId(membershipId);
    const gymObjectId = this.toObjectId(gymId);

    if (!memObjectId || !gymObjectId) {
      throw new BadRequestException({
        message: 'Invalid ID format',
        errorCode: ErrorCode.INVALID_USER_DATA,
      });
    }

    const membership = await this.membershipModel
      .findOne({
        _id: memObjectId,
        gym: gymObjectId,
      })
      .populate('gym')
      .exec();

    if (!membership) {
      throw new BadRequestException({
        message: 'Membership not found',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    // Find the user directly via reference
    const user = await this.userModel
      .findById(membership.user)
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

    // Consistency check: Ensure user knows about this membership
    if (!user.memberships.includes(membership._id)) {
      this.logger.warn(
        `[Auto-Repair] User ${user._id} missing membership link ${membership._id}. Fixing...`,
      );
      user.memberships.push(membership._id);
      await user.save();
    }

    return {
      membership: membership.toObject(),
      user: user.toObject(),
    };
  }

  /**
   * Get member profile with subscription details and payment history for gym manager view
   */
  async getMemberProfile(membershipId: string, gymId: string) {
    const memObjectId = this.toObjectId(membershipId);
    const gymObjectId = this.toObjectId(gymId);

    if (!memObjectId || !gymObjectId) {
      throw new BadRequestException({
        message: 'Invalid ID format',
        errorCode: ErrorCode.INVALID_USER_DATA,
      });
    }

    const membership = await this.membershipModel
      .findOne({
        $or: [{ _id: memObjectId }, { user: memObjectId }],
        gym: gymObjectId,
      })
      .exec();

    if (!membership) {
      throw new BadRequestException({
        message: 'Membership not found',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    // Find the user directly via reference
    const user = await this.userModel
      .findById(membership.user)
      .select(
        '-profile.password -setupToken -setupTokenExpiry -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry',
      )
      .populate({
        path: 'subscriptionHistory',
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: 'gym', select: 'name' },
          { path: 'handledBy', select: 'profile.fullName' },
        ],
      })
      .exec();

    if (!user) {
      throw new BadRequestException({
        message: 'User not found for this membership',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    // Consistency check: Ensure user knows about this membership
    if (!user.memberships.includes(membership._id)) {
      this.logger.warn(
        `[Auto-Repair] User ${user._id} missing membership link ${membership._id}. Fixing...`,
      );
      user.memberships.push(membership._id);
      await user.save();
    }

    // Fetch subscription type details if subscription exists
    let subscriptionType: any = null;
    if (membership.subscription?.typeId) {
      try {
        subscriptionType = await this.subscriptionTypeModel
          .findById(membership.subscription.typeId)
          .lean()
          .exec();
      } catch (err) {
        this.logger.warn(`Failed to fetch subscription type: ${err.message}`);
      }
    }

    // Payment history not yet implemented for gym subscriptions
    // Will return empty array for now
    const payments: any[] = [];

    return {
      membership: {
        _id: membership._id.toString(),
        joinedAt: membership.joinedAt,
        membershipStatus: membership.membershipStatus,
        roles: membership.roles,
        subscription: membership.subscription,
      },
      user: this.sanitizeUser(user),
      payments,
      subscriptionType,
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
    const memObjectId = this.toObjectId(membershipId);
    const gymObjectId = this.toObjectId(gymId);

    if (!memObjectId || !gymObjectId) {
      throw new BadRequestException({
        message: 'Invalid ID format',
        errorCode: ErrorCode.INVALID_USER_DATA,
      });
    }

    const membership = await this.membershipModel
      .findOne({
        _id: memObjectId,
        gym: gymObjectId,
      })
      .exec();

    if (!membership) {
      throw new BadRequestException({
        message: 'Membership not found',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    // Find and update the user
    const user = await this.userModel.findById(membership.user).exec();

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
    const memObjectId = this.toObjectId(membershipId);
    const gymObjectId = this.toObjectId(gymId);

    if (!memObjectId || !gymObjectId) {
      throw new BadRequestException({
        message: 'Invalid ID format',
        errorCode: ErrorCode.INVALID_USER_DATA,
      });
    }

    const membership = await this.membershipModel
      .findOne({
        _id: memObjectId,
        gym: gymObjectId,
      })
      .exec();

    if (!membership) {
      throw new BadRequestException({
        message: 'Membership not found',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    // Find the user and remove this membership from their array
    const user = await this.userModel.findById(membership.user).exec();

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

  /**
   * Update membership settings
   */
  async updateMembershipSettings(userId: string, gymId: string, settings: any) {
    const uObjectId = this.toObjectId(userId);
    const gObjectId = this.toObjectId(gymId);

    if (!uObjectId || !gObjectId) {
      throw new BadRequestException({
        message: 'Invalid ID format',
        errorCode: ErrorCode.INVALID_USER_DATA,
      });
    }

    const membership = await this.membershipModel
      .findOne({
        user: uObjectId,
        gym: gObjectId,
      })
      .exec();

    if (!membership) {
      throw new BadRequestException({
        message: 'Membership not found',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    // Deep merge settings
    if (settings.general) {
      membership.settings.general = {
        ...membership.settings.general,
        ...settings.general,
      };
    }
    if (settings.notifications) {
      membership.settings.notifications = {
        ...membership.settings.notifications,
        ...settings.notifications,
      };
    }
    if (settings.privacy) {
      membership.settings.privacy = {
        ...membership.settings.privacy,
        ...settings.privacy,
      };
    }

    await membership.save();
    this.logger.log(`Updated settings for membership ${membership._id}`);

    return membership.toObject();
  }

  /**
   * Reactivate a member's cancelled or expired subscription
   */
  async reactivateSubscription(
    membershipId: string,
    gymId: string,
    dto: {
      subscriptionTypeId: string;
      startDate: string;
      paymentMethod?: string;
      notes?: string;
    },
    performedBy: string,
  ) {
    const memObjectId = this.toObjectId(membershipId);
    const gymObjectId = this.toObjectId(gymId);

    if (!memObjectId || !gymObjectId) {
      throw new BadRequestException({
        message: 'Invalid ID format',
        errorCode: ErrorCode.INVALID_USER_DATA,
      });
    }

    const membership = await this.membershipModel
      .findOne({
        _id: memObjectId,
        gym: gymObjectId,
      })
      .exec();

    if (!membership) {
      throw new BadRequestException({
        message: 'Membership not found',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    // Find the user
    const user = await this.userModel.findById(membership.user).exec();

    if (!user) {
      throw new BadRequestException({
        message: 'User not found for this membership',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }

    // Consistency check
    if (!user.memberships.includes(membership._id)) {
      user.memberships.push(membership._id);
      // We'll save user later in this function
    }

    // Calculate end date (default 1 month for now, should be based on type)
    const start = new Date(dto.startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const subscriptionInfo: SubscriptionInfo = {
      typeId: dto.subscriptionTypeId,
      startDate: dto.startDate,
      endDate: end.toISOString().split('T')[0],
      status: 'active',
      paymentMethod: (dto.paymentMethod as any) || 'cash',
    };

    // Update Membership
    membership.subscription = subscriptionInfo;
    membership.membershipStatus = 'active' as MembershipStatus;
    await membership.save();

    // Add to User History
    if (!user.subscriptionHistory) {
      user.subscriptionHistory = [];
    }

    // Fetch gym details for history entry
    const gym = await this.gymModel
      .findById(gymId)
      .select('name location slogan slug')
      .lean()
      .exec();

    const history = new this.historyModel({
      subscription: subscriptionInfo,
      gym: gym || ({ _id: gymObjectId } as any),
      handledBy: performedBy,
      notes: dto.notes || 'Subscription reactivated manually',
    });
    await history.save();
    user.subscriptionHistory.push(history._id);

    await user.save();

    this.logger.log(
      `Reactivated subscription for member ${user._id} in gym ${gymId}`,
    );

    // NOTIFICATIONS

    // 1. Notify the Member (Welcome Back)
    try {
      const gym = await this.gymModel
        .findById(gymId)
        .select('name')
        .lean()
        .exec();

      if (gym) {
        await this.notificationsService.notifyUser(user, {
          key: 'subscription.reactivated',
          title: 'Subscription Reactivated! 🎉',
          message: `Your subscription at ${gym.name} has been reactivated. Welcome back!`,
          vars: {
            name: user.profile?.fullName || 'Member',
            gymName: gym.name,
          },
          type: 'subscription',
          priority: 'high',
          relatedId: gymId,
        });
      }
    } catch (notifError) {
      this.logger.error(
        `Failed to send member reactivation notification: ${notifError}`,
      );
    }

    // 2. Notify Managers (Member Reactivated)
    // Finding managers for this gym is expensive if we do it here directly query by query.
    // Ideally, the NotificationService or Gateway should handle "notify gym managers".
    // For now, let's skip searching for all managers to avoid perf hit, or implement if simple.
    // The requirement asked for it. Let's do a simple find.
    try {
      const managers = await this.membershipModel
        .find({
          gym: gymObjectId,
          roles: { $in: [UserRole.Owner, UserRole.Manager] },
        })
        .select('user')
        .lean()
        .exec();

      const managerIds = managers.map((m) => m.user);
      if (managerIds.length > 0) {
        const managersUsers = await this.userModel
          .find({ _id: { $in: managerIds } })
          .exec();

        for (const manager of managersUsers) {
          await this.notificationsService.notifyUser(manager, {
            key: 'member_reactivated_alert',
            title: 'Member Reactivated',
            message: `${user.profile?.fullName} has reactivated their subscription.`,
            vars: {
              memberName: user.profile?.fullName || 'A member',
            },
            type: 'membership',
            priority: 'low',
            relatedId: user._id.toString(),
            skipExternal: true, // Internal alert only
          });
        }
      }
    } catch (mgrNotifError) {
      this.logger.warn(`Failed to notify managers: ${mgrNotifError}`);
    }

    return {
      membership: membership.toObject(),
      user: this.sanitizeUser(user),
    };
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
    const userObjectId = this.toObjectId(userId);
    if (!userObjectId) {
      throw new BadRequestException({
        message: 'Invalid userId format',
        errorCode: ErrorCode.INVALID_USER_DATA,
      });
    }

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
    const cleanUserId = typeof userId === 'string' ? userId.trim() : userId;
    const cleanGymId = typeof gymId === 'string' ? gymId.trim() : gymId;

    this.logger.log('=== DEBUG START ===');
    this.logger.log(`cleanUserId: ${cleanUserId}`);
    this.logger.log(`cleanGymId: ${cleanGymId}`);

    const userObjectId = this.toObjectId(cleanUserId);
    const gymObjectId = this.toObjectId(cleanGymId);

    this.logger.log(`userObjectId: ${userObjectId}`);
    this.logger.log(`gymObjectId: ${gymObjectId}`);

    if (!userObjectId) {
      this.logger.warn(`Invalid userId format: ${cleanUserId}`);
      throw new BadRequestException({
        message: 'Invalid userId format',
        errorCode: ErrorCode.INVALID_USER_DATA,
      });
    }

    let allUserMemberships: any[] = [];
    try {
      // 1. Fetch all memberships for this user
      allUserMemberships = await this.membershipModel
        .find({
          user: userObjectId,
        })
        .populate('gym', 'name location slogan slug _id')
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      this.logger.log(
        `[MembershipService] Total memberships for user: ${allUserMemberships.length}`,
      );
    } catch (err) {
      this.logger.error(
        `[MembershipService] Error fetching memberships: ${err.message}`,
      );
      throw err;
    }

    // FIX: Better filtering logic
    const memberships = allUserMemberships.filter((m: any) => {
      if (!m || !m.gym) {
        this.logger.log('Skipping membership - no gym data');
        return false;
      }

      // Since gym is populated, it's an object with _id property
      const gymData = m.gym as any;

      // Safely extract gymId and slug
      let gId = '';
      let gSlug = '';

      if (typeof gymData === 'object' && gymData._id) {
        gId = gymData._id.toString();
        gSlug = gymData.slug || '';
      } else if (typeof gymData === 'string') {
        // If gym is not populated (shouldn't happen but defensive)
        gId = gymData;
      } else {
        this.logger.log(
          `Unexpected gym data structure: ${JSON.stringify(gymData)}`,
        );
        return false;
      }

      const target = (cleanGymId || '').toString().toLowerCase();
      const match =
        gId.toLowerCase() === target || gSlug.toLowerCase() === target;

      this.logger.log(
        `[MembershipService] Testing membership ${m._id}: gymId=${gId}, slug=${gSlug} against target=${cleanGymId} -> match=${match}`,
      );
      return match;
    });

    this.logger.log(`Filtered to ${memberships.length} memberships`);

    // The "primary" membership for the summary card
    const membership =
      memberships.find(
        (m: any) =>
          m.membershipStatus === 'active' || m.membershipStatus === 'pending',
      ) ||
      memberships[0] ||
      null;

    let history: any[] = [];
    try {
      // 2. Fetch all subscription history records
      const user = await this.userModel
        .findById(userObjectId)
        .populate({
          path: 'subscriptionHistory',
          options: { sort: { createdAt: -1 } },
        })
        .select('subscriptionHistory')
        .lean()
        .exec();

      const allHistory = (user?.subscriptionHistory as any[]) || [];
      history = allHistory.filter((h: any) => {
        if (!h || !h.gym) return false;

        const historyGym = h.gym as any;
        let gId = '';
        let gSlug = '';

        if (typeof historyGym === 'object' && historyGym._id) {
          gId = historyGym._id.toString();
          gSlug = historyGym.slug || '';
        } else if (typeof historyGym === 'string') {
          gId = historyGym;
        }

        const target = (cleanGymId || '').toString().toLowerCase();
        return gId.toLowerCase() === target || gSlug.toLowerCase() === target;
      });
    } catch (err) {
      this.logger.error(
        `[MembershipService] Error fetching history: ${err.message}`,
      );
      // Don't crash the whole Request if history fetch fails
      history = [];
    }

    this.logger.log('=== DEBUG END ===');
    this.logger.log(
      `[MembershipService] Returning ${memberships.length} memberships and ${history.length} history records`,
    );

    return {
      membership,
      memberships,
      history,
    };
  }
}
