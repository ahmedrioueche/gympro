import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import {
  AppPlanModel,
  AppSubscriptionHistoryModel,
  AppSubscriptionModel,
} from '../appBilling.schema';

@Injectable()
export class AppSubscriptionService {
  constructor(
    @InjectModel(AppSubscriptionModel.name)
    private readonly subscriptionModel: Model<AppSubscriptionModel>,
    @InjectModel(AppSubscriptionHistoryModel.name)
    private readonly subscriptionHistoryModel: Model<AppSubscriptionHistoryModel>,
    @InjectModel(AppPlanModel.name)
    private readonly appPlanModel: Model<AppPlanModel>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getMySubscription(userId: string) {
    const sub = await this.subscriptionModel
      .findOne({ userId, status: { $in: ['active', 'trialing'] } })
      .sort({ createdAt: -1 })
      .exec();

    if (!sub) return null;

    // Populate plan details (attach as `plan` field) for frontend convenience
    const plan = await this.appPlanModel.findById(sub.planId).lean().exec();
    const result = sub.toObject() as any;
    result.plan = plan || null;
    return result;
  }

  async subscribe(
    userId: string,
    planId: string,
    billingCycle: 'monthly' | 'yearly' | 'oneTime' = 'monthly',
  ) {
    const plan = await this.appPlanModel.findById(planId).exec();
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Deactivate existing active subscriptions
    await this.subscriptionModel.updateMany(
      { userId, status: { $in: ['active', 'trialing'] } },
      { status: 'cancelled', endDate: new Date() },
    );

    const now = new Date();
    const nextDate = new Date(now);
    nextDate.setDate(nextDate.getDate() + 30);

    const sub = new this.subscriptionModel({
      userId,
      planId,
      startDate: now,
      status: 'active',
      billingCycle,
      lastPaymentDate: now.toISOString(),
      nextPaymentDate: nextDate.toISOString(),
      autoRenew: true,
      createdAt: new Date(),
    });

    const saved = await sub.save();

    // Update user document with subscription reference
    await this.userModel.findByIdAndUpdate(userId, {
      appSubscription: saved._id,
    });

    // Create history entry
    const history = new this.subscriptionHistoryModel({
      userId,
      subscriptionId: saved._id,
      planId: planId,
      action: 'created',
      startDate: now,
      status: 'active',
      createdAt: new Date(),
    });

    await history.save();

    return saved;
  }

  async cancelSubscription(userId: string, reason?: string) {
    const sub = await this.subscriptionModel
      .findOne({ userId, status: { $in: ['active', 'trialing'] } })
      .exec();

    if (!sub) {
      throw new NotFoundException('No active subscription found');
    }

    sub.status = 'cancelled';
    sub.cancelledAt = new Date().toISOString();
    sub.cancellationReason = reason;
    sub.autoRenew = false;
    await sub.save();

    // Create history entry
    const history = new this.subscriptionHistoryModel({
      userId,
      subscriptionId: sub._id,
      planId: sub.planId,
      action: 'cancelled',
      startDate: sub.startDate,
      endDate: new Date(),
      status: 'cancelled',
      notes: reason,
      createdAt: new Date(),
    });

    await history.save();

    return sub;
  }

  async getSubscriptionHistory(userId: string) {
    return this.subscriptionHistoryModel
      .find({ userId })
      .populate('planId')
      .sort({ createdAt: -1 })
      .exec();
  }
}
