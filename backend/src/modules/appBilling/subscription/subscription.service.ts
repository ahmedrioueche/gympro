import {
  AppCurrency,
  AppSubscriptionBillingCycle,
  DEFAULT_CURRENCY,
} from '@ahmedrioueche/gympro-client';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MAX_DAILY_CANCELLATIONS } from 'src/common/constants/subscription.constants';
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

    // Find plan by planId field (not _id)
    const plan = await this.appPlanModel
      .findOne({ planId: sub.planId })
      .lean()
      .exec();

    const result = sub.toObject() as any;
    result.plan = plan || null;
    return result;
  }

  async subscribe(
    userId: string,
    planId: string,
    billingCycle: AppSubscriptionBillingCycle = 'monthly',
    currency: AppCurrency = DEFAULT_CURRENCY,
  ) {
    // Find plan by planId field (not _id)
    const plan = await this.appPlanModel.findOne({ planId }).exec();
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Check for existing active subscription
    const currentSub = await this.subscriptionModel
      .findOne({ userId, status: { $in: ['active', 'trialing'] } })
      .exec();

    if (currentSub) {
      const currentPlan = await this.appPlanModel
        .findOne({ planId: currentSub.planId })
        .exec();

      if (currentPlan) {
        // Compare Logic
        const levels = ['free', 'starter', 'pro', 'premium']; // Hardcoded to avoid import issues or use constant if available
        const cycles = ['monthly', 'yearly', 'oneTime'];

        const currentLevelIndex = levels.indexOf(currentPlan.level);
        const targetLevelIndex = levels.indexOf(plan.level);

        const currentCycleIndex = cycles.indexOf(
          currentSub.billingCycle || 'monthly',
        );
        const targetCycleIndex = cycles.indexOf(billingCycle);

        const isDowngrade = targetLevelIndex < currentLevelIndex;
        const isSwitchDown =
          targetLevelIndex === currentLevelIndex &&
          targetCycleIndex < currentCycleIndex;

        // If Downgrade or Switch Down -> Schedule for end of period
        if (isDowngrade || isSwitchDown) {
          if (currentSub.pendingPlanId) {
            throw new BadRequestException(
              'A plan change is already scheduled. Please cancel it before making new changes.',
            );
          }
          currentSub.pendingPlanId = planId;
          currentSub.pendingBillingCycle = billingCycle;
          currentSub.pendingChangeEffectiveDate = currentSub.currentPeriodEnd;
          await currentSub.save();

          // Create history entry
          const history = new this.subscriptionHistoryModel({
            userId,
            subscriptionId: currentSub._id,
            planId: planId,
            action: 'downgrade_scheduled',
            status: currentSub.status,
            startDate: new Date(), // Log the time of scheduling
            details: `Downgrade/Switch scheduled to ${plan.name} (${billingCycle}) on ${currentSub.currentPeriodEnd}`,
            createdAt: new Date(),
          });
          await history.save();

          return currentSub;
        }
      }
    }

    // Deactivate existing active subscriptions (Immediate Upgrade or New Subscription)
    let prorationCredit = 0;
    let isUpgrade = false;

    if (currentSub) {
      // If we are here, it's an UPGRADE or SWITCH UP
      isUpgrade = true;
      const currentPlan = await this.appPlanModel
        .findOne({ planId: currentSub.planId })
        .exec();

      if (currentPlan && currentSub.status !== 'trialing') {
        const periodStart =
          currentSub.currentPeriodStart || currentSub.startDate;
        const periodEnd = currentSub.currentPeriodEnd;
        const nowTime = new Date().getTime();
        const startTime = new Date(periodStart).getTime();
        const endTime = new Date(periodEnd).getTime();
        const totalDuration = endTime - startTime;
        const elapsed = nowTime - startTime;

        if (totalDuration > 0) {
          const remainingShow = Math.max(0, totalDuration - elapsed);
          const ratio = remainingShow / totalDuration;

          const oldPriceMap = currentPlan.pricing?.[currency] || {};
          const oldPrice =
            currentSub.billingCycle === 'yearly'
              ? oldPriceMap.yearly || 0
              : oldPriceMap.monthly || 0;

          prorationCredit = oldPrice * ratio;
        }
      }
    }

    await this.subscriptionModel.updateMany(
      { userId, status: { $in: ['active', 'trialing'] } },
      { status: 'cancelled', endDate: new Date() },
    );

    const now = new Date();
    const startDate = new Date(now);

    // Calculate endDate and nextPaymentDate based on billing cycle and plan type
    let endDate: Date | undefined;
    let currentPeriodEnd: Date;
    let nextPaymentDate: Date | undefined;

    if (plan.type === 'oneTime') {
      // One-time plans have lifetime access (set a far future date or omit)
      // Option 1: Set a far future date (100 years from now)
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 100);
      currentPeriodEnd = new Date(endDate);
      nextPaymentDate = undefined;
    } else if (billingCycle === 'monthly') {
      currentPeriodEnd = new Date(startDate);
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      nextPaymentDate = new Date(currentPeriodEnd);
    } else if (billingCycle === 'yearly') {
      currentPeriodEnd = new Date(startDate);
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
      nextPaymentDate = new Date(currentPeriodEnd);
    } else {
      // Default fallback
      currentPeriodEnd = new Date(startDate);
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    }

    const subscriptionData: any = {
      userId,
      planId,
      startDate,
      currentPeriodStart: startDate,
      currentPeriodEnd,
      status: 'active',
      lastPaymentDate: now,
      autoRenewType: 'auto',
      createdAt: new Date(),
    };

    // Only add optional fields if they exist
    if (endDate) {
      subscriptionData.endDate = endDate;
    }
    if (nextPaymentDate) {
      subscriptionData.nextPaymentDate = nextPaymentDate;
    }
    subscriptionData.billingCycle = billingCycle;

    const sub = new this.subscriptionModel(subscriptionData);
    const saved = await sub.save();

    // Update user document with subscription reference
    await this.userModel.findByIdAndUpdate(userId, {
      appSubscription: saved._id,
    });

    const currencyPricing = plan.pricing[currency] || {};

    // Determine amountPaid
    let newCost = 0;
    if (plan.type === 'subscription') {
      if (billingCycle === 'monthly') newCost = currencyPricing.monthly || 0;
      else if (billingCycle === 'yearly') newCost = currencyPricing.yearly || 0;
    } else if (plan.type === 'oneTime') {
      newCost = currencyPricing.oneTime || 0;
    }

    const amountPaid = Math.max(0, newCost - prorationCredit);

    // Create history entry
    const historyData: any = {
      userId,
      subscriptionId: saved._id,
      planId: planId,
      action: isUpgrade ? 'upgraded' : 'created',
      startDate: now,
      status: 'active',
      amountPaid: amountPaid,
      currency: currency,
      details: isUpgrade
        ? `Upgraded from previous plan. Price: ${newCost.toFixed(2)}, Credit: ${prorationCredit.toFixed(2)}, Paid: ${amountPaid.toFixed(2)}`
        : `New subscription created. Paid: ${amountPaid.toFixed(2)}`,
      createdAt: new Date(),
    };

    if (endDate) {
      historyData.endDate = endDate;
    }

    const history = new this.subscriptionHistoryModel(historyData);
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

    // Debug Logs for Rate Limiting
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const cancellationsToday =
      await this.subscriptionHistoryModel.countDocuments({
        userId,
        action: 'reactivated',
        createdAt: { $gte: startOfDay },
      });

    console.log('--- Cancellation Check ---');
    console.log('User:', userId);
    console.log('Start of Day:', startOfDay);
    console.log('Cancellations Found:', cancellationsToday);
    console.log('Limit:', MAX_DAILY_CANCELLATIONS);

    if (cancellationsToday >= MAX_DAILY_CANCELLATIONS) {
      console.log('BLOCKING CANCELLATION: Limit exceeded');
      throw new HttpException(
        'Daily cancellation limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Don't change status - user keeps access until currentPeriodEnd
    // sub.status stays 'active' or 'trialing' until period end
    sub.cancelledAt = new Date().toISOString();
    sub.cancellationReason = reason;
    sub.cancelAtPeriodEnd = true;
    sub.autoRenew = false;
    sub.nextPaymentDate = undefined;
    sub.endDate = sub.currentPeriodEnd;
    await sub.save();

    // Create history entry
    const history = new this.subscriptionHistoryModel({
      userId,
      subscriptionId: sub._id,
      action: 'cancelled',
      startDate: new Date(),
      details: `Subscription cancelled. Reason: ${reason || 'No reason provided'}`,
      changes: {
        cancelAtPeriodEnd: true,
        autoRenew: false,
      },
      createdAt: new Date(), // Ensure createdAt is explicitly set
    });
    await history.save();

    return sub;
  }

  async reactivateSubscription(userId: string) {
    const sub = await this.subscriptionModel
      .findOne({ userId, status: { $in: ['active', 'trialing'] } })
      .exec();

    if (!sub) {
      throw new NotFoundException('No active subscription found');
    }

    if (!sub.cancelAtPeriodEnd) {
      throw new BadRequestException(
        'Subscription is not scheduled for cancellation',
      );
    }

    // Reset cancellation flags
    sub.cancelAtPeriodEnd = false;
    sub.cancelledAt = undefined;
    sub.cancellationReason = undefined;

    // Restore auto-renew
    sub.autoRenew = true;
    // We do NOT change autoRenewType here, assuming it was preserved

    // Restore payment date and clear end date
    sub.nextPaymentDate = sub.currentPeriodEnd;
    sub.endDate = undefined;

    await sub.save();

    // Add history entry for reactivation
    const history = new this.subscriptionHistoryModel({
      userId,
      subscriptionId: sub._id,
      planId: sub.planId,
      action: 'reactivated',
      startDate: sub.startDate,
      endDate: sub.currentPeriodEnd,
      status: sub.status,
      details: 'Subscription reactivated by user',
      createdAt: new Date(),
    });
    await history.save();

    return sub;
  }

  async cancelPendingChange(userId: string) {
    const sub = await this.subscriptionModel
      .findOne({ userId, status: { $in: ['active', 'trialing'] } })
      .exec();

    if (!sub) {
      throw new NotFoundException('No active subscription found');
    }

    if (!sub.pendingPlanId) {
      throw new BadRequestException('No pending plan change found to cancel');
    }

    // Clear pending changes
    sub.pendingPlanId = undefined;
    sub.pendingBillingCycle = undefined;
    sub.pendingChangeEffectiveDate = undefined;
    await sub.save();

    // Add history entry
    const history = new this.subscriptionHistoryModel({
      userId,
      subscriptionId: sub._id,
      planId: sub.planId,
      action: 'pending_change_cancelled',
      status: sub.status,
      details: 'Pending plan change cancelled by user',
      createdAt: new Date(),
    });
    await history.save();

    return sub;
  }

  async getSubscriptionHistory(userId: string) {
    // Get history records
    const history = await this.subscriptionHistoryModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Manually populate plan data
    const planIds = [...new Set(history.map((h) => h.planId))];
    const plans = await this.appPlanModel
      .find({ planId: { $in: planIds } })
      .lean()
      .exec();

    // Create a map for quick lookup
    const planMap = new Map(plans.map((p) => [p.planId, p]));

    // Attach plan data to each history record
    return history.map((h) => ({
      ...h,
      plan: planMap.get(h.planId) || null,
    }));
  }
}
