import { AdminDashboardStats, UserRole } from '@ahmedrioueche/gympro-client';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { AppPaymentModel } from '../app-billing/payment/appPayment.schema';
import { GymModel } from '../gym/gym.schema';

@Injectable()
export class AdminStatsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(GymModel.name) private gymModel: Model<GymModel>,
    @InjectModel(AppPaymentModel.name)
    private paymentModel: Model<AppPaymentModel>,
  ) {}

  async getDashboardStats(): Promise<AdminDashboardStats> {
    const [
      totalUsers,
      activeGyms,
      pendingApprovals,
      recentUsers,
      recentGyms,
      revenueResult,
    ] = await Promise.all([
      this.userModel.countDocuments({ role: UserRole.Member }),
      this.gymModel.countDocuments(),
      this.userModel.countDocuments({
        role: UserRole.Coach,
        'coachVerification.status': 'pending',
      }),
      this.userModel.find().sort({ createdAt: -1 }).limit(5).lean().exec(),
      this.gymModel.find().sort({ createdAt: -1 }).limit(5).lean().exec(),
      this.paymentModel.aggregate([
        { $match: { status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amountCents' } } },
      ]),
    ]);

    const totalRevenue = (revenueResult[0]?.total || 0) / 100;

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
