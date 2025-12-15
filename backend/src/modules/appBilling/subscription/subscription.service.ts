import {
  APP_PLAN_LEVELS,
  APP_SUBSCRIPTION_BILLING_CYCLES,
  AppCurrency,
  AppSubscriptionBillingCycle,
  DEFAULT_CURRENCY,
} from '@ahmedrioueche/gympro-client';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MAX_DAILY_CANCELLATIONS } from 'src/common/constants/subscription.constants';
import { User } from 'src/common/schemas/user.schema';
import { NotificationService } from 'src/common/services/notification.service';
import {
  AppPlanModel,
  AppSubscriptionHistoryModel,
  AppSubscriptionModel,
} from '../appBilling.schema';

@Injectable()
export class AppSubscriptionService {
  private readonly logger = new Logger(AppSubscriptionService.name);

  constructor(
    @InjectModel(AppSubscriptionModel.name)
    private readonly subscriptionModel: Model<AppSubscriptionModel>,
    @InjectModel(AppSubscriptionHistoryModel.name)
    private readonly subscriptionHistoryModel: Model<AppSubscriptionHistoryModel>,
    @InjectModel(AppPlanModel.name)
    private readonly appPlanModel: Model<AppPlanModel>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly notificationService: NotificationService,
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
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find target plan by planId field
    const plan = await this.appPlanModel.findOne({ planId }).exec();
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Check for existing active subscription
    const currentSub = await this.subscriptionModel
      .findOne({ userId, status: { $in: ['active', 'trialing'] } })
      .exec();

    // ✅ NEW: Validate plan availability if there's a current subscription
    if (currentSub) {
      const currentPlan = await this.appPlanModel
        .findOne({ planId: currentSub.planId })
        .exec();

      if (currentPlan) {
        const availability = this.validatePlanAvailability(
          currentPlan,
          currentSub.billingCycle || 'monthly',
          plan,
          billingCycle,
        );

        if (!availability.available) {
          throw new BadRequestException(
            availability.message || 'This plan change is not allowed',
          );
        }

        // ❌ Block downgrades - must use dedicated endpoint
        if (
          availability.changeType === 'downgrade' ||
          availability.changeType === 'switch_down'
        ) {
          throw new BadRequestException(
            'Downgrades must be scheduled using the downgrade endpoint',
          );
        }
      }
    }

    // Calculate proration credit for upgrades
    let prorationCredit = 0;
    let isUpgrade = false;

    if (currentSub) {
      isUpgrade = true;
      const currentPlan = await this.appPlanModel
        .findOne({ planId: currentSub.planId })
        .exec();

      if (currentPlan && currentSub.status !== 'trialing') {
        prorationCredit = this.calculateProrationCredit(
          currentSub,
          currentPlan,
          currency,
        );
      }
    }

    // Deactivate existing active subscriptions (for immediate upgrades)
    if (currentSub) {
      await this.subscriptionModel.updateMany(
        { userId, status: { $in: ['active', 'trialing'] } },
        { status: 'cancelled', endDate: new Date() },
      );
    }

    // Create new subscription
    const now = new Date();
    const { endDate, currentPeriodEnd, nextPaymentDate } =
      this.calculateSubscriptionDates(now, billingCycle, plan.type);

    const subscriptionData: any = {
      userId,
      planId,
      startDate: now,
      currentPeriodStart: now,
      currentPeriodEnd,
      status: 'active',
      lastPaymentDate: now,
      autoRenewType: 'auto',
      billingCycle,
      createdAt: new Date(),
    };

    if (endDate) subscriptionData.endDate = endDate;
    if (nextPaymentDate) subscriptionData.nextPaymentDate = nextPaymentDate;

    const sub = new this.subscriptionModel(subscriptionData);
    const saved = await sub.save();

    // Update user document with subscription reference
    await this.userModel.findByIdAndUpdate(userId, {
      appSubscription: saved._id,
    });

    // Calculate amount paid
    const currencyPricing = plan.pricing[currency] || {};
    const newCost = this.calculatePlanCost(
      plan.type,
      billingCycle,
      currencyPricing,
    );
    const amountPaid = Math.max(0, newCost - prorationCredit);

    if (plan.level !== 'free') {
      await this.notificationService.notifyUser(user, {
        key: 'subscription.created',
        vars: {
          name: user.profile?.fullName || user.profile?.email || 'User',
          planName: plan.name,
        },
      });
    }

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

    if (endDate) historyData.endDate = endDate;

    const history = new this.subscriptionHistoryModel(historyData);
    await history.save();

    return saved;
  }

  private validatePlanAvailability(
    currentPlan: AppPlanModel,
    currentBillingCycle: AppSubscriptionBillingCycle,
    targetPlan: AppPlanModel,
    targetBillingCycle: AppSubscriptionBillingCycle,
  ): {
    available: boolean;
    changeType?: string;
    message?: string;
  } {
    const currentLevelIndex = APP_PLAN_LEVELS.indexOf(currentPlan.level);
    const targetLevelIndex = APP_PLAN_LEVELS.indexOf(targetPlan.level);

    // ❌ RULE 1: Cannot select the same plan with same billing cycle
    if (
      currentPlan.planId === targetPlan.planId &&
      currentBillingCycle === targetBillingCycle
    ) {
      return {
        available: false,
        message: 'You are already subscribed to this plan',
      };
    }

    // ✅ Handle lifetime (one-time) plans
    if (currentBillingCycle === 'oneTime' && targetBillingCycle === 'oneTime') {
      // Can only upgrade to higher tier
      if (targetLevelIndex > currentLevelIndex) {
        return { available: true, changeType: 'upgrade' };
      } else {
        return {
          available: false,
          message: 'Cannot downgrade from lifetime plan to lower lifetime tier',
        };
      }
    }

    // ❌ RULE 2: Cannot switch from lifetime to subscription plans
    if (currentBillingCycle === 'oneTime' && targetBillingCycle !== 'oneTime') {
      return {
        available: false,
        message: 'Cannot switch from lifetime plan to subscription plan',
      };
    }

    // Determine change type for regular subscriptions
    const currentCycleIndex =
      APP_SUBSCRIPTION_BILLING_CYCLES.indexOf(currentBillingCycle);
    const targetCycleIndex =
      APP_SUBSCRIPTION_BILLING_CYCLES.indexOf(targetBillingCycle);

    const isDowngrade = targetLevelIndex < currentLevelIndex;
    const isSwitchDown =
      targetLevelIndex === currentLevelIndex &&
      targetCycleIndex < currentCycleIndex;
    const isUpgrade = targetLevelIndex > currentLevelIndex;
    const isSwitchUp =
      targetLevelIndex === currentLevelIndex &&
      targetCycleIndex > currentCycleIndex;

    if (isDowngrade) {
      return { available: true, changeType: 'downgrade' };
    } else if (isSwitchDown) {
      return { available: true, changeType: 'switch_down' };
    } else if (isUpgrade) {
      return { available: true, changeType: 'upgrade' };
    } else if (isSwitchUp) {
      return { available: true, changeType: 'switch_up' };
    }

    return { available: true, changeType: 'upgrade' };
  }

  /**
   * ✅ NEW: Calculate proration credit for upgrades
   */
  private calculateProrationCredit(
    currentSub: AppSubscriptionModel,
    currentPlan: AppPlanModel,
    currency: AppCurrency,
  ): number {
    const periodStart = currentSub.currentPeriodStart || currentSub.startDate;
    const periodEnd = currentSub.currentPeriodEnd;
    const nowTime = new Date().getTime();
    const startTime = new Date(periodStart).getTime();
    const endTime = new Date(periodEnd).getTime();
    const totalDuration = endTime - startTime;
    const elapsed = nowTime - startTime;

    if (totalDuration <= 0) return 0;

    const remainingTime = Math.max(0, totalDuration - elapsed);
    const ratio = remainingTime / totalDuration;

    const oldPriceMap = currentPlan.pricing?.[currency] || {};
    const oldPrice =
      currentSub.billingCycle === 'yearly'
        ? oldPriceMap.yearly || 0
        : oldPriceMap.monthly || 0;

    return oldPrice * ratio;
  }

  /**
   * ✅ NEW: Calculate subscription dates based on billing cycle
   */
  private calculateSubscriptionDates(
    startDate: Date,
    billingCycle: AppSubscriptionBillingCycle,
    planType: string,
  ): {
    endDate?: Date;
    currentPeriodEnd: Date;
    nextPaymentDate?: Date;
  } {
    let endDate: Date | undefined;
    let currentPeriodEnd: Date;
    let nextPaymentDate: Date | undefined;

    if (planType === 'oneTime') {
      // Lifetime access (100 years from now)
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

    return { endDate, currentPeriodEnd, nextPaymentDate };
  }

  /**
   * ✅ NEW: Calculate plan cost based on type and billing cycle
   */
  private calculatePlanCost(
    planType: string,
    billingCycle: AppSubscriptionBillingCycle,
    pricing: any,
  ): number {
    if (planType === 'oneTime') {
      return pricing.oneTime || 0;
    } else if (billingCycle === 'monthly') {
      return pricing.monthly || 0;
    } else if (billingCycle === 'yearly') {
      return pricing.yearly || 0;
    }
    return 0;
  }

  async downgradeSubscription(
    userId: string,
    planId: string,
    billingCycle: AppSubscriptionBillingCycle = 'monthly',
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check for existing active subscription
    const currentSub = await this.subscriptionModel
      .findOne({ userId, status: { $in: ['active', 'trialing'] } })
      .exec();

    if (!currentSub) {
      throw new NotFoundException('No active subscription found');
    }

    // Find target plan by planId field
    const targetPlan = await this.appPlanModel.findOne({ planId }).exec();
    if (!targetPlan) {
      throw new NotFoundException('Target plan not found');
    }

    // Find current plan
    const currentPlan = await this.appPlanModel
      .findOne({ planId: currentSub.planId })
      .exec();

    if (!currentPlan) {
      throw new NotFoundException('Current plan not found');
    }

    // Validate it's actually a downgrade/switch down
    const currentLevelIndex = APP_PLAN_LEVELS.indexOf(currentPlan.level);
    const targetLevelIndex = APP_PLAN_LEVELS.indexOf(targetPlan.level);

    const currentCycleIndex = APP_SUBSCRIPTION_BILLING_CYCLES.indexOf(
      currentSub.billingCycle || 'monthly',
    );
    const targetCycleIndex =
      APP_SUBSCRIPTION_BILLING_CYCLES.indexOf(billingCycle);

    const isDowngrade = targetLevelIndex < currentLevelIndex;
    const isSwitchDown =
      targetLevelIndex === currentLevelIndex &&
      targetCycleIndex < currentCycleIndex;

    if (!isDowngrade && !isSwitchDown) {
      throw new BadRequestException(
        'Target plan is not a downgrade. Use upgrade endpoint instead.',
      );
    }

    // Check if there's already a pending change
    if (currentSub.pendingPlanId) {
      throw new BadRequestException(
        'A plan change is already scheduled. Please cancel it before making new changes.',
      );
    }

    // Schedule the downgrade for end of current period
    currentSub.pendingPlanId = planId;
    currentSub.pendingBillingCycle = billingCycle;
    currentSub.pendingChangeEffectiveDate = currentSub.currentPeriodEnd;
    await currentSub.save();

    // ✅ Use reusable notification method
    await this.notificationService.notifyUser(user, {
      key: 'subscription.downgrade_scheduled',
      vars: {
        name: user.profile?.fullName || user.profile?.email || 'User',
        planName: targetPlan.name,
        date: currentSub.currentPeriodEnd.toLocaleDateString(),
      },
    });

    // Create history entry
    const history = new this.subscriptionHistoryModel({
      userId,
      subscriptionId: currentSub._id,
      planId: planId,
      action: 'downgrade_scheduled',
      status: currentSub.status,
      startDate: new Date(),
      details: `Downgrade/Switch scheduled to ${targetPlan.name} (${billingCycle}) on ${currentSub.currentPeriodEnd}`,
      createdAt: new Date(),
    });
    await history.save();

    return currentSub;
  }

  async cancelSubscription(userId: string, reason?: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const sub = await this.subscriptionModel
      .findOne({ userId, status: { $in: ['active', 'trialing'] } })
      .exec();

    if (!sub) {
      throw new NotFoundException('No active subscription found');
    }

    // Rate limiting check
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const cancellationsToday =
      await this.subscriptionHistoryModel.countDocuments({
        userId,
        action: 'cancelled',
        createdAt: { $gte: startOfDay },
      });

    if (cancellationsToday >= MAX_DAILY_CANCELLATIONS) {
      throw new HttpException(
        'Daily cancellation limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Mark for cancellation at period end
    sub.cancelledAt = new Date().toISOString();
    sub.cancellationReason = reason;
    sub.cancelAtPeriodEnd = true;
    sub.autoRenew = false;
    sub.nextPaymentDate = undefined;
    sub.endDate = sub.currentPeriodEnd;
    sub.pendingPlanId = undefined;
    sub.pendingBillingCycle = undefined;
    await sub.save();

    // ✅ Use reusable notification method
    await this.notificationService.notifyUser(user, {
      key: 'subscription.cancelled',
      vars: {
        name: user.profile?.fullName || user.profile?.email || 'User',
        date: sub.currentPeriodEnd.toLocaleDateString(),
      },
    });

    // Create history entry
    const history = new this.subscriptionHistoryModel({
      userId,
      planId: sub.planId,
      status: 'cancelled',
      subscriptionId: sub._id,
      action: 'cancelled',
      startDate: new Date(),
      details: `Subscription cancelled. Reason: ${reason || 'No reason provided'}`,
      changes: {
        cancelAtPeriodEnd: true,
        autoRenew: false,
      },
      createdAt: new Date(),
    });
    await history.save();

    return sub;
  }

  async reactivateSubscription(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

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
    sub.autoRenew = true;
    sub.nextPaymentDate = sub.currentPeriodEnd;
    sub.endDate = undefined;

    await sub.save();

    // ✅ Use reusable notification method
    await this.notificationService.notifyUser(user, {
      key: 'subscription.reactivated',
      vars: {
        name: user.profile?.fullName || user.profile?.email || 'User',
      },
    });

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
