import { GlobalAnalytics, GymAnalytics } from '@ahmedrioueche/gympro-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
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
    @InjectModel(User.name) private userModel: Model<User>,
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

    // ... existing code ...

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

  async getGymStats(gymId: string): Promise<GymAnalytics> {
    const gymObjectId = new Types.ObjectId(gymId);
    const gym = await this.gymModel.findById(gymId);
    if (!gym) throw new NotFoundException('Gym not found');

    // 1. Membership Distribution
    const membershipStats = await this.membershipModel.aggregate([
      { $match: { gym: gymObjectId } },
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

    const totalMembers = membershipStats.reduce(
      (acc, curr) => acc + curr.count,
      0,
    );

    // 2. Gender Distribution (Populate member info)
    // This is a bit more complex since we need to join with User
    const genderStats = await this.membershipModel.aggregate([
      { $match: { gym: gymObjectId } },
      {
        $lookup: {
          from: 'users',
          localField: 'member',
          foreignField: '_id',
          as: 'memberInfo',
        },
      },
      { $unwind: '$memberInfo' },
      { $group: { _id: '$memberInfo.profile.gender', count: { $sum: 1 } } },
    ]);

    const genderDist = { male: 0, female: 0, other: 0 };
    genderStats.forEach((s) => {
      const g = s._id?.toLowerCase();
      if (g === 'male') genderDist.male = s.count;
      else if (g === 'female') genderDist.female = s.count;
      else genderDist.other += s.count;
    });

    // 3. Occupancy Rate (Mocking for now as we don't have real-time tracking yet)
    const occupancyRate =
      totalMembers > 0
        ? ((gym.memberStats?.checkedIn || 0) / (totalMembers * 0.5)) * 100
        : 0;

    return {
      gymId,
      metrics: {
        totalMembers,
        activeMembers: dist.active,
        expiredMembers: dist.expired,
        checkedIn: gym.memberStats?.checkedIn || 0,
        occupancyRate: Math.min(100, Math.round(occupancyRate)),
      },
      membershipDistribution: dist,
      genderDistribution: genderDist,
      attendanceTrend: [
        { date: 'Today', count: 12 },
        { date: 'Yesterday', count: 18 },
        { date: '2 days ago', count: 15 },
      ], // Mocked trend
    };
  }
}
