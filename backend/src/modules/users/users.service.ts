import {
  DEFAULT_CURRENCY,
  DEFAULT_REGION,
  DEFAULT_TRIAL_DAYS_NUMBER,
  EditUserDto,
  ErrorCode,
  SupportedCurrency,
  UserRole,
} from '@ahmedrioueche/gympro-client';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../common/schemas/user.schema';

import { GeolocationService } from '../../common/services/geolocation.service';
import { AppPlanModel } from '../appBilling/appBilling.schema';
import { AppSubscriptionService } from '../appBilling/subscription/subscription.service';
import { GymService } from '../gym/gym.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(AppPlanModel.name) private appPlanModel: Model<AppPlanModel>,
    private readonly subscriptionService: AppSubscriptionService,
    private readonly gymService: GymService,
    private readonly geolocationService: GeolocationService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    role?: UserRole,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { 'profile.email': { $regex: search, $options: 'i' } },
        { 'profile.username': { $regex: search, $options: 'i' } },
        { 'profile.fullName': { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate('memberships')
        .populate('currentProgram')
        .populate('notifications')
        .sort({ createdAt: -1 })
        .exec(),
      this.userModel.countDocuments(query),
    ]);

    return {
      data: users.map((user) => this.sanitizeUser(user)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      .populate('memberships')
      .populate('currentProgram')
      .populate('notifications')
      .exec();

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    return this.sanitizeUser(user);
  }

  async findByEmail(email: string) {
    const user = await this.userModel
      .findOne({ 'profile.email': email })
      .populate('memberships')
      .populate('currentProgram')
      .populate('notifications')
      .exec();

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    return this.sanitizeUser(user);
  }

  async findByPhone(phoneNumber: string) {
    const user = await this.userModel
      .findOne({ 'profile.phoneNumber': phoneNumber })
      .populate('memberships')
      .populate('currentProgram')
      .populate('notifications')
      .exec();

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    return this.sanitizeUser(user);
  }

  async update(id: string, updateData: Partial<User>) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    // Check if email is being updated and if it's already in use
    if (
      updateData.profile?.email &&
      updateData.profile.email !== user.profile.email
    ) {
      const existingUser = await this.userModel.findOne({
        'profile.email': updateData.profile.email,
        _id: { $ne: id },
      });

      if (existingUser) {
        throw new BadRequestException({
          message: 'Email is already in use',
          errorCode: ErrorCode.EMAIL_ALREADY_IN_USE,
        });
      }
    }

    // Check if username is being updated and if it's already in use
    if (
      updateData.profile?.username &&
      updateData.profile.username !== user.profile.username
    ) {
      const existingUser = await this.userModel.findOne({
        'profile.username': updateData.profile.username,
        _id: { $ne: id },
      });

      if (existingUser) {
        throw new BadRequestException({
          message: 'Username is already in use',
          errorCode: ErrorCode.USERNAME_ALREADY_IN_USE,
        });
      }
    }

    // Update user
    Object.assign(user, updateData);
    await user.save();

    return this.sanitizeUser(user);
  }

  async updateProfile(id: string, profileData: EditUserDto) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    // Check if email is being updated and if it's already in use
    if (profileData.email && profileData.email !== user.profile.email) {
      const existingUser = await this.userModel.findOne({
        'profile.email': profileData.email,
        _id: { $ne: id },
      });

      if (existingUser) {
        throw new BadRequestException({
          message: 'Email is already in use',
          errorCode: ErrorCode.EMAIL_ALREADY_IN_USE,
        });
      }
    }

    // Check if username is being updated and if it's already in use
    if (
      profileData.username &&
      profileData.username !== user.profile.username
    ) {
      const existingUser = await this.userModel.findOne({
        'profile.username': profileData.username,
        _id: { $ne: id },
      });

      if (existingUser) {
        throw new BadRequestException({
          message: 'Username is already in use',
          errorCode: ErrorCode.USERNAME_ALREADY_IN_USE,
        });
      }
    }

    // Update profile
    Object.assign(user.profile, profileData);
    await user.save();

    return this.sanitizeUser(user);
  }

  async updateRole(id: string, newRole: UserRole, currentUserId: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    // Prevent user from changing their own role
    if (id === currentUserId) {
      throw new BadRequestException({
        message: 'Cannot change your own role',
        errorCode: ErrorCode.CANNOT_CHANGE_OWN_ROLE,
      });
    }

    // Validate role
    if (!Object.values(UserRole).includes(newRole)) {
      throw new BadRequestException({
        message: 'Invalid role',
        errorCode: ErrorCode.INVALID_ROLE,
      });
    }

    user.role = newRole;
    await user.save();

    return this.sanitizeUser(user);
  }

  async activate(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    if (user.profile.isActive) {
      throw new BadRequestException({
        message: 'User is already active',
        errorCode: ErrorCode.USER_ALREADY_ACTIVE,
      });
    }

    user.profile.isActive = true;
    await user.save();

    return this.sanitizeUser(user);
  }

  async deactivate(id: string, currentUserId: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    // Prevent user from deactivating themselves
    if (id === currentUserId) {
      throw new BadRequestException({
        message: 'Cannot deactivate yourself',
        errorCode: ErrorCode.CANNOT_DEACTIVATE_SELF,
      });
    }

    if (!user.profile.isActive) {
      throw new BadRequestException({
        message: 'User is already deactivated',
        errorCode: ErrorCode.USER_ALREADY_DEACTIVATED,
      });
    }

    user.profile.isActive = false;
    await user.save();

    return this.sanitizeUser(user);
  }

  async delete(id: string, currentUserId: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    // Prevent user from deleting themselves
    if (id === currentUserId) {
      throw new BadRequestException({
        message: 'Cannot delete yourself',
        errorCode: ErrorCode.CANNOT_DEACTIVATE_SELF,
      });
    }

    await this.userModel.findByIdAndDelete(id);

    return { message: 'User deleted successfully' };
  }

  // Helper method to remove sensitive data
  private sanitizeUser(user: any) {
    const userObj = user.toObject ? user.toObject() : user;

    if (userObj.profile?.password) {
      delete userObj.profile.password;
    }

    delete userObj.verificationToken;
    delete userObj.verificationTokenExpiry;
    delete userObj.resetPasswordToken;
    delete userObj.resetPasswordTokenExpiry;

    return userObj;
  }

  /**
   * Detect region from user's IP address
   */
  async detectRegion(req: any) {
    // Extract IP from request
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      '';

    this.logger.log(`Detecting region for IP: ${ip}`);
    return this.geolocationService.detectRegionFromIP(ip);
  }

  async completeOnboarding(userId: string, data: any) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    // Update role
    if (data.role && Object.values(UserRole).includes(data.role)) {
      user.role = data.role;
    }

    // Update profile fields
    if (data.username) user.profile.username = data.username;
    if (data.age) user.profile.age = data.age;
    if (data.gender) user.profile.gender = data.gender;
    if (data.ownerName) user.profile.fullName = data.ownerName;

    // Initialize appSettings if not exists
    if (!user.appSettings) {
      user.appSettings = {
        theme: 'auto',
        notifications: {
          enablePush: true,
          enableEmail: true,
        },
        locale: {
          language: data.language || DEFAULT_REGION.language,
          currency: data.currency || DEFAULT_REGION.currency,
          region: data.region || DEFAULT_REGION.region,
          regionName: data.regionName || DEFAULT_REGION.regionName,
          timezone: data.timezone || DEFAULT_REGION.timezone,
        },
      } as any;
    } else {
      // Set locale with region/currency data
      user.appSettings.locale = {
        language: data.language || DEFAULT_REGION.language,
        currency: data.currency || DEFAULT_REGION.currency,
        region: data.region || DEFAULT_REGION.region,
        regionName: data.regionName || DEFAULT_REGION.regionName,
        timezone: data.timezone || DEFAULT_REGION.timezone,
      };
    }

    // Create Gym if owner and gymName provided
    if (user.role === UserRole.Owner && data.gymName) {
      try {
        await this.gymService.create({
          name: data.gymName,
          owner: user._id.toString(),
        });
      } catch (error) {
        this.logger.error(
          `Failed to create gym for user ${userId}: ${error.message}`,
        );
        throw new BadRequestException('Failed to create gym: ' + error.message);
      }
    }

    // Mark as onboarded
    user.profile.isOnBoarded = true;
    await user.save();

    // Auto-subscribe to free plan
    await this.autoSubscribeToFreePlan(user._id.toString());

    // Send welcome notification after onboarding completion (background task)
    this.notificationsService
      .notifyUser(user, {
        key: 'onboarding.completed',
        vars: {
          name: user.profile?.fullName || user.profile?.email || 'User',
          trialDays: DEFAULT_TRIAL_DAYS_NUMBER.toString(),
        },
      })
      .catch((error) => {
        this.logger.error(
          `Failed to send onboarding completion notification to user ${userId}: ${error.message}`,
        );
      });

    return this.sanitizeUser(user);
  }

  private async autoSubscribeToFreePlan(userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      console.log({ user });
      const currency =
        (user?.appSettings?.locale?.currency as SupportedCurrency) ||
        DEFAULT_CURRENCY;
      const provider =
        user?.appSettings?.locale?.region === 'DZ' ? 'chargily' : 'paddle';
      const freePlan = await this.appPlanModel
        .findOne({ planId: 'subscription-free' })
        .exec();

      if (freePlan) {
        await this.subscriptionService.subscribe(
          userId,
          freePlan.planId,
          'monthly',
          currency,
          provider,
          undefined,
          undefined,
          true,
        );
        this.logger.log(`User ${userId} auto-subscribed to free plan`);
      } else {
        this.logger.warn(
          'Free plan not found - user created without subscription',
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to auto-subscribe user ${userId} to free plan: ${error}`,
      );
    }
  }
}
