import { AdminDashboardStats, UserRole } from '@ahmedrioueche/gympro-client';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { GymModel } from '../gym/gym.schema';

@Injectable()
export class AdminStatsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(GymModel.name) private gymModel: Model<GymModel>,
  ) {}

  async getDashboardStats(): Promise<AdminDashboardStats> {
    const [totalUsers, activeGyms, pendingApprovals, recentUsers, recentGyms] =
      await Promise.all([
        this.userModel.countDocuments({ role: UserRole.Member }),
        this.gymModel.countDocuments(),
        Promise.resolve(0),
        this.userModel.find().sort({ createdAt: -1 }).limit(5).lean().exec(), // Fetch recent users
        this.gymModel.find().sort({ createdAt: -1 }).limit(5).lean().exec(), // Fetch recent gyms
      ]);

    // Mock revenue for now as payment implementation varies
    const totalRevenue = 0;

    return {
      totalUsers,
      activeGyms,
      totalRevenue,
      pendingApprovals,
      systemHealth: 'healthy',
      recentUsers: recentUsers as any,
      recentGyms: recentGyms as any,
    };
  }
}
