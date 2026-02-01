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
import { NotificationsService } from '../notifications/notifications.service';
import { CreateEditorDto } from './dto/create-editor.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
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
        username: dto.username,
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

  async getEditors() {
    return this.userModel
      .find({ role: UserRole.AppEditor })
      .select('-profile.password')
      .sort({ createdAt: -1 });
  }

  async deleteEditor(id: string) {
    const result = await this.userModel.deleteOne({
      _id: id,
      role: UserRole.AppEditor,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Editor not found');
    }

    return { success: true, message: 'Editor remove successfully' };
  }

  async updateEditorPermissions(id: string, permissions: string[]) {
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
      .find({ role: UserRole.Coach })
      .select('-profile.password')
      .sort({ createdAt: -1 });
  }
}
