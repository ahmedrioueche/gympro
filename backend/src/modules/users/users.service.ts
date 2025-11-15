import { UserErrorCode, UserRole } from '@ahmedrioueche/gympro-client';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../common/schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
        errorCode: UserErrorCode.USER_NOT_FOUND,
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
        errorCode: UserErrorCode.USER_NOT_FOUND,
      });
    }

    return this.sanitizeUser(user);
  }

  async update(id: string, updateData: Partial<User>) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        errorCode: UserErrorCode.USER_NOT_FOUND,
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
          errorCode: UserErrorCode.EMAIL_ALREADY_IN_USE,
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
          errorCode: UserErrorCode.USERNAME_ALREADY_IN_USE,
        });
      }
    }

    // Update user
    Object.assign(user, updateData);
    await user.save();

    return this.sanitizeUser(user);
  }

  async updateProfile(id: string, profileData: Partial<User['profile']>) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        errorCode: UserErrorCode.USER_NOT_FOUND,
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
          errorCode: UserErrorCode.EMAIL_ALREADY_IN_USE,
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
          errorCode: UserErrorCode.USERNAME_ALREADY_IN_USE,
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
        errorCode: UserErrorCode.USER_NOT_FOUND,
      });
    }

    // Prevent user from changing their own role
    if (id === currentUserId) {
      throw new BadRequestException({
        message: 'Cannot change your own role',
        errorCode: UserErrorCode.CANNOT_CHANGE_OWN_ROLE,
      });
    }

    // Validate role
    if (!Object.values(UserRole).includes(newRole)) {
      throw new BadRequestException({
        message: 'Invalid role',
        errorCode: UserErrorCode.INVALID_ROLE,
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
        errorCode: UserErrorCode.USER_NOT_FOUND,
      });
    }

    if (user.profile.isActive) {
      throw new BadRequestException({
        message: 'User is already active',
        errorCode: UserErrorCode.USER_ALREADY_ACTIVE,
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
        errorCode: UserErrorCode.USER_NOT_FOUND,
      });
    }

    // Prevent user from deactivating themselves
    if (id === currentUserId) {
      throw new BadRequestException({
        message: 'Cannot deactivate yourself',
        errorCode: UserErrorCode.CANNOT_DEACTIVATE_SELF,
      });
    }

    if (!user.profile.isActive) {
      throw new BadRequestException({
        message: 'User is already deactivated',
        errorCode: UserErrorCode.USER_ALREADY_DEACTIVATED,
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
        errorCode: UserErrorCode.USER_NOT_FOUND,
      });
    }

    // Prevent user from deleting themselves
    if (id === currentUserId) {
      throw new BadRequestException({
        message: 'Cannot delete yourself',
        errorCode: UserErrorCode.CANNOT_DEACTIVATE_SELF,
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
}
