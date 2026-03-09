import { UserRole } from '@ahmedrioueche/gympro-client';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import {
  AppPlanModel,
  AppSubscriptionModel,
} from '../app-billing/appBilling.schema';
import { AppPaymentModel } from '../app-billing/payment/appPayment.schema';
import { GymModel } from '../gym/gym.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateEditorDto } from './dto/create-editor.dto';
import { UpdateEditorDto } from './dto/update-editor.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(AppSubscriptionModel.name)
    private appSubscriptionModel: Model<AppSubscriptionModel>,
    @InjectModel(AppPlanModel.name) private appPlanModel: Model<AppPlanModel>,
    @InjectModel(AppPaymentModel.name)
    private appPaymentModel: Model<AppPaymentModel>,
    @InjectModel(GymModel.name) private gymModel: Model<GymModel>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createEditor(dto: CreateEditorDto) {
    const existingUser = await this.userModel.findOne({
      'profile.email': dto.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = new this.userModel({
      profile: {
        username: dto.username || dto.email.split('@')[0],
        email: dto.email,
        fullName: dto.fullName,
        password: hashedPassword,
        isValidated: true,
        isOnBoarded: true,
      },
      role: UserRole.AppEditor,
      dashboardAccess: ['admin'], // Use 'admin' dashboard access for editors too
      appPermissions: dto.appPermissions || [],
    });

    await newUser.save();
    return { success: true, message: 'Editor created successfully' };
  }

  async updateEditor(
    id: string,
    dto: UpdateEditorDto,
    requestingUserId?: string,
  ) {
    const editor = await this.userModel.findOne({
      _id: id,
      role: UserRole.AppEditor,
    });

    if (!editor) {
      throw new NotFoundException('Editor not found');
    }

    if (dto.email && dto.email !== editor.profile.email) {
      const existingUser = await this.userModel.findOne({
        'profile.email': dto.email,
        _id: { $ne: id },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
      editor.profile.email = dto.email;
    }

    if (dto.username) editor.profile.username = dto.username;
    if (dto.fullName) editor.profile.fullName = dto.fullName;

    if (dto.password) {
      editor.profile.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.appPermissions) {
      if (requestingUserId && id === requestingUserId) {
        throw new BadRequestException('You cannot modify your own permissions');
      }
      editor.appPermissions = dto.appPermissions;
    }

    await editor.save();
    return {
      success: true,
      message: 'Editor updated successfully',
      data: editor,
    };
  }

  async getEditors(requestingUserId?: string) {
    const query: any = { role: UserRole.AppEditor };
    // Exclude the requesting user from the list
    if (requestingUserId) {
      query._id = { $ne: requestingUserId };
    }
    return this.userModel
      .find(query)
      .select('-profile.password')
      .sort({ createdAt: -1 })
      .lean();
  }

  async deleteEditor(id: string, requestingUserId?: string) {
    if (requestingUserId && id === requestingUserId) {
      throw new BadRequestException('You cannot delete yourself');
    }

    const result = await this.userModel.deleteOne({
      _id: id,
      role: UserRole.AppEditor,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Editor not found');
    }

    return { success: true, message: 'Editor removed successfully' };
  }

  async updateEditorPermissions(
    id: string,
    permissions: string[],
    requestingUserId?: string,
  ) {
    if (requestingUserId && id === requestingUserId) {
      throw new BadRequestException('You cannot modify your own permissions');
    }

    const result = await this.userModel.updateOne(
      { _id: id, role: UserRole.AppEditor },
      { $set: { appPermissions: permissions } },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('Editor not found');
    }

    return { success: true, message: 'Permissions updated successfully' };
  }

  // ============================================
  // COACH REQUESTS
  // ============================================

  async getCoachRequests() {
    return this.userModel
      .find({ 'coachVerification.status': 'pending' })
      .select('profile coachVerification createdAt')
      .sort({ 'coachVerification.submittedAt': -1 });
  }

  async approveCoachRequest(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.coachVerification?.status !== 'pending') {
      throw new BadRequestException('Request is not pending');
    }

    // Approve
    user.coachVerification.status = 'approved';
    user.coachVerification.reviewedAt = new Date();

    // Update Role and Dashboard Access
    user.role = UserRole.Coach;
    if (!user.dashboardAccess?.includes('coach')) {
      user.dashboardAccess = [...(user.dashboardAccess || []), 'coach'];
    }

    await user.save();

    // Notify
    await this.notificationsService.notifyUser(user, {
      key: 'admin.coach_approved',
      type: 'alert',
      priority: 'high',
    });

    return { success: true, message: 'Coach request approved' };
  }

  async rejectCoachRequest(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.coachVerification?.status !== 'pending') {
      throw new BadRequestException('Request is not pending');
    }

    // Reject
    user.coachVerification.status = 'rejected';
    user.coachVerification.reviewedAt = new Date();

    await user.save();

    // Notify
    await this.notificationsService.notifyUser(user, {
      key: 'admin.coach_rejected',
      type: 'alert',
      priority: 'high',
    });

    return { success: true, message: 'Coach request rejected' };
  }

  async getCoaches() {
    return this.userModel
      .find({
        role: UserRole.Coach,
        // Exclude pending coaches so they only show up in the requests tab
        'coachVerification.status': { $ne: 'pending' },
      })
      .select('-profile.password')
      .sort({ createdAt: -1 });
  }

  async removeCoach(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.role !== UserRole.Coach) {
      throw new BadRequestException('User is not a coach');
    }

    // Revoke Coach Status
    user.role = UserRole.Member;
    user.dashboardAccess = (user.dashboardAccess || []).filter(
      (r) => r !== 'coach',
    );

    if (user.coachVerification) {
      user.coachVerification.status = 'rejected';
      user.coachVerification.reviewedAt = new Date();
    }

    await user.save();

    // Optionally notify the coach that access was revoked
    await this.notificationsService.notifyUser(user, {
      key: 'admin.coach_rejected',
      type: 'alert',
      priority: 'high',
    });

    return { success: true, message: 'Coach removed successfully' };
  }

  async getSubscriptions() {
    const subscriptions = await this.appSubscriptionModel
      .find()
      .populate('userId', 'profile.fullName profile.email profile.username')
      .sort({ createdAt: -1 })
      .lean();

    const planIds = [...new Set(subscriptions.map((s) => s.planId))];
    const plans = await this.appPlanModel
      .find({ planId: { $in: planIds } })
      .select('planId name')
      .lean();

    const planMap = plans.reduce(
      (acc, plan) => {
        acc[plan.planId] = plan.name;
        return acc;
      },
      {} as Record<string, string>,
    );

    return subscriptions.map((s) => ({
      ...s,
      planName: planMap[s.planId] || s.planId,
    }));
  }

  async getPayments() {
    const payments = await this.appPaymentModel
      .find()
      .populate('userId', 'profile.fullName profile.email profile.username')
      .sort({ createdAt: -1 })
      .lean();

    const planIds = [...new Set(payments.map((p) => p.planId))];
    const plans = await this.appPlanModel
      .find({ planId: { $in: planIds } })
      .select('planId name')
      .lean();

    const planMap = plans.reduce(
      (acc, plan) => {
        acc[plan.planId] = plan.name;
        return acc;
      },
      {} as Record<string, string>,
    );

    return payments.map((p) => ({
      ...p,
      planName: planMap[p.planId] || p.planId,
    }));
  }

  async getUsers() {
    return this.userModel
      .find()
      .select('-profile.password')
      .sort({ createdAt: -1 })
      .lean();
  }

  async toggleUserStatus(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Safety check: Cannot deactivate Admins or App Editors from here
    if (user.role === UserRole.Admin || user.role === UserRole.AppEditor) {
      throw new BadRequestException(
        'Cannot deactivate or manage privileged roles from this dashboard.',
      );
    }

    user.profile.isActive = !user.profile.isActive;
    await user.save();

    return {
      success: true,
      data: {
        userId: user._id,
        isActive: user.profile.isActive,
      },
    };
  }

  async getGyms() {
    return this.gymModel
      .find()
      .populate('owner', 'profile.fullName profile.email profile.username')
      .sort({ createdAt: -1 })
      .lean();
  }

  async toggleGymStatus(id: string) {
    const gym = await this.gymModel.findById(id);

    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    gym.isActive = !gym.isActive;
    await gym.save();

    return {
      success: true,
      data: {
        gymId: gym._id,
        isActive: gym.isActive,
      },
    };
  }
}
