import { ErrorCode, type DashboardType } from '@ahmedrioueche/gympro-client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import { RequestCoachAccessDto } from './dto/request-coach-access.dto';

@Injectable()
export class DashboardService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Request access to the coach dashboard.
   * Currently self-certification (auto-approved), but structured for future admin approval.
   */
  async requestCoachAccess(
    userId: string,
    dto: RequestCoachAccessDto,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    // Check if already has coach access
    if (user.dashboardAccess?.includes('coach')) {
      return { success: true, message: 'Already have coach dashboard access' };
    }

    // Self-certification: auto-approve for now
    // Future: set status to 'pending' and require admin review
    const coachVerification = {
      status: 'approved' as const, // Change to 'pending' for admin approval flow
      submittedAt: new Date(),
      certificationDetails: dto.certificationDetails,
    };

    // Add 'coach' to dashboardAccess
    const updatedAccess = [...(user.dashboardAccess || ['member']), 'coach'];

    await this.userModel.findByIdAndUpdate(userId, {
      dashboardAccess: updatedAccess,
      coachVerification,
    });

    return { success: true, message: 'Coach dashboard access granted' };
  }

  /**
   * Get available dashboards for a user along with associated gyms per dashboard.
   */
  async getAvailableDashboards(userId: string): Promise<{
    dashboards: DashboardType[];
    defaultDashboard: DashboardType;
    gymsPerDashboard: Record<DashboardType, { _id: string; name: string }[]>;
  }> {
    const user = await this.userModel
      .findById(userId)
      .populate({
        path: 'memberships',
        populate: { path: 'gym', select: '_id name' },
      })
      .lean();

    if (!user) {
      throw new BadRequestException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    const dashboards = (user.dashboardAccess as DashboardType[]) || ['member'];

    // Determine default dashboard based on role
    let defaultDashboard: DashboardType = 'member';
    if (user.role === 'owner' || user.role === 'manager') {
      defaultDashboard = 'manager';
    } else if (user.role === 'coach') {
      defaultDashboard = 'coach';
    }

    // Build gyms per dashboard
    const gymsPerDashboard: Record<
      DashboardType,
      { _id: string; name: string }[]
    > = {
      member: [],
      coach: [],
      manager: [],
    };

    // For manager dashboard, we need to query owned gyms separately
    // This is handled in the controller by calling gymService

    // For member/coach, filter from memberships
    if (user.memberships && Array.isArray(user.memberships)) {
      for (const membership of user.memberships as any[]) {
        const gym = membership.gym;
        if (!gym) continue;

        const gymInfo = { _id: gym._id.toString(), name: gym.name };
        const roles = membership.roles || [];

        if (roles.includes('member')) {
          gymsPerDashboard.member.push(gymInfo);
        }
        if (roles.includes('coach')) {
          gymsPerDashboard.coach.push(gymInfo);
        }
      }
    }

    return { dashboards, defaultDashboard, gymsPerDashboard };
  }

  /**
   * Add manager dashboard access when user creates a gym.
   */
  async grantManagerAccess(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId);

    if (!user) return;

    if (!user.dashboardAccess?.includes('manager')) {
      const updatedAccess = [
        ...(user.dashboardAccess || ['member']),
        'manager',
      ];
      await this.userModel.findByIdAndUpdate(userId, {
        dashboardAccess: updatedAccess,
      });
    }
  }
}
