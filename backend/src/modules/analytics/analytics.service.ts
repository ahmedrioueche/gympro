import { GlobalAnalytics } from '@ahmedrioueche/gympro-client';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppPaymentModel } from '../appBilling/payment/appPayment.schema';
import { GymModel } from '../gym/gym.schema';
import { GymMembershipModel } from '../gymMembership/membership.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(GymModel.name) private gymModel: Model<GymModel>,
    @InjectModel(GymMembershipModel.name)
    private membershipModel: Model<GymMembershipModel>,
    @InjectModel(AppPaymentModel.name)
    private paymentModel: Model<AppPaymentModel>,
  ) {}

  async getGlobalStats(managerId: string): Promise<GlobalAnalytics> {
    const managerObjectId = new Types.ObjectId(managerId);

    // 1. Get all gyms for this manager
    const gyms = await this.gymModel.find({ owner: managerObjectId }).lean();
    const gymIds = gyms.map((g) => g._id);

    // 2. Metrics Aggregation
    // Total Revenue (only completed payments for this user)
    const revenueStats = await this.paymentModel.aggregate([
      { $match: { userId: managerObjectId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Membership Stats across all gyms
    const membershipStats = await this.membershipModel.aggregate([
      { $match: { gym: { $in: gymIds } } },
      { $group: { _id: '$membershipStatus', count: { $sum: 1 } } },
    ]);

    const dist = {
      active: 0,
      pending: 0,
      expired: 0,
      banned: 0,
    };

    membershipStats.forEach((s) => {
      if (s._id === 'active') dist.active = s.count;
      else if (s._id === 'pending') dist.pending = s.count;
      else if (s._id === 'expired' || s._id === 'canceled')
        dist.expired += s.count;
      else if (s._id === 'banned') dist.banned = s.count;
    });

    // Revenue by Gym (Top performing)
    // Note: AppPayment currently doesn't link directly to a Gym ID.
    // In our model, payments are per manager (global level).
    // For now, we'll mock or use gym counts as a proxy or just return empty for revenueByGym
    // if we don't have gym-specific payment records yet.
    // Let's assume for now revenue is global.

    // Revenue Trend (Mocking for now as we don't have historical snapshots easily)
    const revenueTrendData = [
      { date: '2023-10', amount: 1200 },
      { date: '2023-11', amount: 1500 },
      { date: '2023-12', amount: 1800 },
    ];

    const memberTrendData = [
      { date: '2023-10', count: 50 },
      { date: '2023-11', count: 85 },
      { date: '2023-12', count: 120 },
    ];

    return {
      metrics: {
        totalRevenue: revenueStats[0]?.total || 0,
        totalMembers: membershipStats.reduce(
          (acc, curr) => acc + curr.count,
          0,
        ),
        activeMembers: dist.active,
        totalGyms: gyms.length,
        revenueTrend: 15.5, // Mocked
        membersTrend: 8.2, // Mocked
      },
      revenueByGym: [], // We need to add gymId to AppPayment for this to be real
      membershipDistribution: dist,
      revenueTrendData,
      memberTrendData,
    };
  }
}
