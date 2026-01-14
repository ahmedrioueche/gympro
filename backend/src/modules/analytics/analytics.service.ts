import { GlobalAnalytics, GymAnalytics } from '@ahmedrioueche/gympro-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import { AppPaymentModel } from '../appBilling/payment/appPayment.schema';
import { GymModel } from '../gym/gym.schema';
import { GymMembershipModel } from '../gymMembership/membership.schema';

import { SubscriptionHistoryModel } from '../gymSubscription/gymSubscription.schema';
@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel('GymModel') private gymModel: Model<GymModel>,
    @InjectModel('GymMembership')
    private membershipModel: Model<GymMembershipModel>,
    @InjectModel(AppPaymentModel.name)
    private paymentModel: Model<AppPaymentModel>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel('SubscriptionHistory')
    private historyModel: Model<SubscriptionHistoryModel>,
  ) {}

  async getGlobalStats(managerId: string): Promise<GlobalAnalytics> {
    const managerObjectId = new Types.ObjectId(managerId);

    // 1. Get all gyms and user data for this manager
    const [gyms, user] = await Promise.all([
      this.gymModel.find({ owner: managerObjectId }).lean(),
      this.userModel
        .findById(managerObjectId)
        .select('lastVisitedGymId')
        .lean(),
    ]);
    const gymIds = gyms.map((g) => new Types.ObjectId(g._id));

    // 2. Metrics Aggregation
    // Total Revenue (only completed member payments for this manager's gyms)
    const revenueStats = await this.historyModel.aggregate([
      { $match: { 'gym._id': { $in: gymIds } } },
      { $group: { _id: null, total: { $sum: '$pricePaid' } } },
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

    // Revenue Trend (Real data from history)
    const revenueTrendData = await this.getGranularRevenue(gymIds, 'monthly');

    // Monthly Revenue (Current Month)
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenueStats = await this.historyModel.aggregate([
      {
        $match: {
          'gym._id': { $in: gymIds },
          createdAt: { $gte: currentMonthStart },
        },
      },
      { $group: { _id: null, total: { $sum: '$pricePaid' } } },
    ]);

    return {
      metrics: {
        totalRevenue: revenueStats[0]?.total || 0,
        monthlyRevenue: monthlyRevenueStats[0]?.total || 0,
        totalMembers: membershipStats.reduce(
          (acc, curr) => acc + curr.count,
          0,
        ),
        activeMembers: dist.active,
        totalGyms: gyms.length,
        revenueTrend: 0, // TODO: Calculate actual trend
        membersTrend: 0, // TODO: Calculate actual trend
      },
      revenueByGym: [], // TODO: Group by gym._id
      membershipDistribution: dist,
      revenueTrendData,
      memberTrendData: [],
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

    // 4. Revenue Aggregation for this specific gym
    const revenueStats = await this.historyModel.aggregate([
      { $match: { 'gym._id': gymObjectId } },
      { $group: { _id: null, total: { $sum: '$pricePaid' } } },
    ]);

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenueStats = await this.historyModel.aggregate([
      {
        $match: {
          'gym._id': gymObjectId,
          createdAt: { $gte: currentMonthStart },
        },
      },
      { $group: { _id: null, total: { $sum: '$pricePaid' } } },
    ]);

    return {
      gymId,
      metrics: {
        totalMembers,
        activeMembers: dist.active,
        expiredMembers: dist.expired,
        checkedIn: gym.memberStats?.checkedIn || 0,
        occupancyRate: Math.min(100, Math.round(occupancyRate)),
        totalRevenue: revenueStats[0]?.total || 0,
        monthlyRevenue: monthlyRevenueStats[0]?.total || 0,
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

  /**
   * Helper to calculate granular revenue buckets
   */
  async getGranularRevenue(
    gymIds: Types.ObjectId[],
    period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly',
  ) {
    const now = new Date();
    let startDate: Date;
    let format: string;

    switch (period) {
      case 'hourly':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        format = '%Y-%m-%d %H:00';
        break;
      case 'daily':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        format = '%Y-%m-%d';
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);
        format = '%Y-%U'; // Year-WeekNumber
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        format = '%Y-%m';
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear() - 5, 0, 1);
        format = '%Y';
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        format = '%Y-%m';
    }

    const stats = await this.historyModel.aggregate([
      {
        $match: {
          'gym._id': { $in: gymIds },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format, date: '$createdAt' } },
          amount: { $sum: '$pricePaid' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return stats.map((s) => ({
      date: s._id,
      amount: s.amount,
    }));
  }
}
