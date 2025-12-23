import {
  APP_PLAN_LEVELS,
  APP_SUBSCRIPTION_BILLING_CYCLES,
  AppPaymentProvider,
  AppSubscriptionBillingCycle,
  DEFAULT_APP_PAYMENT_PROVIDER,
  DEFAULT_CURRENCY,
  SupportedCurrency,
} from '@ahmedrioueche/gympro-client';
import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MAX_DAILY_CANCELLATIONS } from 'src/common/constants/subscription.constants';
import { User } from 'src/common/schemas/user.schema';
import { NotificationService } from 'src/common/services/notification.service';
import { PaddleService } from 'src/modules/paddle/paddle.service';
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
    public readonly subscriptionModel: Model<AppSubscriptionModel>,
    @InjectModel(AppSubscriptionHistoryModel.name)
    public readonly subscriptionHistoryModel: Model<AppSubscriptionHistoryModel>,
    @InjectModel(AppPlanModel.name)
    private readonly appPlanModel: Model<AppPlanModel>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => PaddleService))
    private readonly paddleService: PaddleService,
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
    currency: SupportedCurrency = DEFAULT_CURRENCY,
    provider: AppPaymentProvider = DEFAULT_APP_PAYMENT_PROVIDER,
    paddleSubscriptionId?: string,
    paddleCustomerId?: string,
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
      .findOne({ userId, status: { $in: ['active', 'trialing', 'past_due'] } })
      .exec();

    // ✅ IDENTITY CHECK: If this is a Paddle subscription upgrade/renewal, update existing record
    if (provider === 'paddle' && paddleSubscriptionId) {
      const existingPaddleSub = await this.subscriptionModel
        .findOne({
          paddleSubscriptionId,
        })
        .exec();

      if (existingPaddleSub) {
        this.logger.log(
          `Updating existing Paddle subscription: ${paddleSubscriptionId}`,
        );

        const now = new Date();
        const { endDate, currentPeriodEnd, nextPaymentDate } =
          this.calculateSubscriptionDates(now, billingCycle);

        const isActualUpgrade =
          existingPaddleSub.planId !== planId ||
          existingPaddleSub.billingCycle !== billingCycle;

        existingPaddleSub.planId = planId;
        existingPaddleSub.billingCycle = billingCycle;
        existingPaddleSub.status = 'active';
        existingPaddleSub.currentPeriodStart = now;
        existingPaddleSub.currentPeriodEnd = currentPeriodEnd;
        existingPaddleSub.lastPaymentDate = now;
        if (endDate) existingPaddleSub.endDate = endDate;
        if (nextPaymentDate)
          existingPaddleSub.nextPaymentDate = nextPaymentDate;

        // Reset cancellation flags if it was previously scheduled to cancel
        existingPaddleSub.cancelAtPeriodEnd = false;
        existingPaddleSub.autoRenew = true;
        existingPaddleSub.cancelledAt = undefined;

        const saved = await existingPaddleSub.save();

        // Update user ref if needed
        await this.userModel.findByIdAndUpdate(userId, {
          appSubscription: saved._id,
        });

        // Add history and notify...
        return this.recordSubscriptionAction(
          user,
          saved,
          plan,
          isActualUpgrade,
          currency,
          0,
        ); // Credit handled by Paddle
      }
    }

    // Calculate proration credit for upgrades (Manual/Chargily flow)
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
        { userId, status: { $in: ['active', 'trialing', 'past_due'] } },
        { status: 'cancelled', endDate: new Date() },
      );
    }

    // Create new subscription
    const now = new Date();
    const { endDate, currentPeriodEnd, nextPaymentDate } =
      this.calculateSubscriptionDates(now, billingCycle);

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
      provider,
      paddleSubscriptionId,
      paddleCustomerId,
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
    const newCost = this.calculatePlanCost(billingCycle, currencyPricing);
    const amountPaid = Math.max(0, newCost - prorationCredit);

    if (plan.level !== 'free') {
      this.notificationService
        .notifyUser(user, {
          key: 'subscription.created',
          vars: {
            name: user.profile?.fullName || user.profile?.email || 'User',
            planName: plan.name,
          },
        })
        .catch((error) => {
          this.logger.error(
            'Failed to send subscription created notification',
            error,
          );
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

  private async recordSubscriptionAction(
    user: any,
    subscription: any,
    plan: any,
    isUpgrade: boolean,
    currency: SupportedCurrency,
    prorationCredit: number,
  ) {
    const now = new Date();
    const currencyPricing = plan.pricing[currency] || {};
    const newCost = this.calculatePlanCost(
      subscription.billingCycle,
      currencyPricing,
    );
    const amountPaid = Math.max(0, newCost - prorationCredit);

    if (plan.level !== 'free') {
      this.notificationService
        .notifyUser(user, {
          key: 'subscription.created',
          vars: {
            name: user.profile?.fullName || user.profile?.email || 'User',
            planName: plan.name,
          },
        })
        .catch((error) => {
          this.logger.error(
            'Failed to send subscription created notification',
            error,
          );
        });
    }

    const historyData: any = {
      userId: user._id,
      subscriptionId: subscription._id,
      planId: plan.planId,
      action: isUpgrade ? 'upgraded' : 'created',
      startDate: now,
      status: 'active',
      amountPaid: amountPaid,
      currency: currency,
      details: isUpgrade
        ? `Upgraded from previous plan. Paid: ${amountPaid.toFixed(2)}`
        : `New subscription created. Paid: ${amountPaid.toFixed(2)}`,
      createdAt: new Date(),
    };

    if (subscription.endDate) historyData.endDate = subscription.endDate;

    const history = new this.subscriptionHistoryModel(historyData);
    await history.save();

    return subscription;
  }

  /**
   * ✅ NEW: Calculate proration credit for upgrades
   */
  private calculateProrationCredit(
    currentSub: AppSubscriptionModel,
    currentPlan: AppPlanModel,
    currency: SupportedCurrency,
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
  ): {
    endDate?: Date;
    currentPeriodEnd: Date;
    nextPaymentDate?: Date;
  } {
    let endDate: Date | undefined;
    let currentPeriodEnd: Date;
    let nextPaymentDate: Date | undefined;

    if (billingCycle === 'monthly') {
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
    billingCycle: AppSubscriptionBillingCycle,
    pricing: any,
  ): number {
    if (billingCycle === 'monthly') {
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

    // ✅ Handle Paddle subscriptions differently
    if (currentSub.provider === 'paddle' && currentSub.paddleSubscriptionId) {
      try {
        this.logger.log(
          `📉 [DOWNGRADE] Processing Paddle downgrade: ${currentSub.paddleSubscriptionId}`,
        );

        // Get the new price ID
        const newPriceId = this.paddleService.getPaddlePriceId(
          targetPlan,
          billingCycle,
        );

        if (!newPriceId) {
          throw new BadRequestException(
            `Price ID not found for plan=${planId}, billing=${billingCycle}`,
          );
        }

        const isBillingCycleChange = currentSub.billingCycle !== billingCycle;

        // Schedule downgrade in Paddle (applies at end of billing period)
        const paddleData = await this.paddleService.scheduleDowngrade(
          currentSub.paddleSubscriptionId,
          newPriceId,
          isBillingCycleChange,
        );

        // ✅ For Paddle downgrades, we DON'T use pendingPlanId
        // Instead, we store it in the DB but know Paddle will handle the switch
        currentSub.pendingPlanId = planId;
        currentSub.pendingBillingCycle = billingCycle;
        currentSub.pendingChangeEffectiveDate = currentSub.currentPeriodEnd;
        await currentSub.save();

        this.logger.log(
          `✅ [DOWNGRADE] Paddle downgrade scheduled: ${currentSub.paddleSubscriptionId}`,
        );
      } catch (error) {
        this.logger.error(
          '❌ [DOWNGRADE] Failed to schedule downgrade in Paddle',
          error,
        );
        throw new BadRequestException(
          'Failed to schedule downgrade with payment provider',
        );
      }
    } else {
      // ✅ For manual/Chargily subscriptions, use pending change logic
      currentSub.pendingPlanId = planId;
      currentSub.pendingBillingCycle = billingCycle;
      currentSub.pendingChangeEffectiveDate = currentSub.currentPeriodEnd;
      await currentSub.save();
    }

    // Send notification
    this.notificationService
      .notifyUser(user, {
        key: 'subscription.downgrade_scheduled',
        vars: {
          name: user.profile?.fullName || user.profile?.email || 'User',
          planName: targetPlan.name,
          date: currentSub.currentPeriodEnd.toLocaleDateString(),
        },
      })
      .catch((error) => {
        this.logger.error(
          'Failed to send subscription downgrade scheduled notification',
          error,
        );
      });

    // Create history entry
    const history = new this.subscriptionHistoryModel({
      userId,
      subscriptionId: currentSub._id,
      planId: planId,
      action: 'downgrade_scheduled',
      status: currentSub.status,
      startDate: new Date(),
      details: `Downgrade/Switch scheduled to ${targetPlan.name} (${billingCycle}) on ${currentSub.currentPeriodEnd}${currentSub.provider === 'paddle' ? ' (via Paddle)' : ''}`,
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

    // ✅ If Paddle subscription, cancel in Paddle first
    if (sub.provider === 'paddle' && sub.paddleSubscriptionId) {
      const paddleData = await this.paddleService.cancelSubscription(
        sub.paddleSubscriptionId,
      );

      // ✅ Sync DB from Paddle response
      await this.syncFromPaddleData(paddleData);
    } else {
      // ✅ For non-Paddle subscriptions, update DB directly
      sub.cancelledAt = new Date().toISOString();
      sub.cancellationReason = reason;
      sub.cancelAtPeriodEnd = true;
      sub.autoRenew = false;
      sub.nextPaymentDate = undefined;
      sub.endDate = sub.currentPeriodEnd;
      sub.pendingPlanId = undefined;
      sub.pendingBillingCycle = undefined;
      await sub.save();
    }

    // Add cancellation reason to DB record
    const updatedSub = await this.subscriptionModel
      .findOne({ _id: sub._id })
      .exec();
    if (updatedSub) {
      updatedSub.cancellationReason = reason;
      await updatedSub.save();
    }

    // Send notification
    this.notificationService
      .notifyUser(user, {
        key: 'subscription.cancelled',
        vars: {
          name: user.profile?.fullName || user.profile?.email || 'User',
          date: sub.currentPeriodEnd.toLocaleDateString(),
        },
      })
      .catch((error) => {
        this.logger.error(
          'Failed to send subscription cancelled notification',
          error,
        );
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

    return updatedSub || sub;
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

    // ✅ If Paddle subscription, reactivate in Paddle first
    if (sub.provider === 'paddle' && sub.paddleSubscriptionId) {
      try {
        this.logger.log(
          `Reactivating Paddle subscription: ${sub.paddleSubscriptionId}`,
        );

        const paddleData = await this.paddleService.removeScheduledCancellation(
          sub.paddleSubscriptionId,
        );

        // ✅ Sync DB from Paddle response
        await this.syncFromPaddleData(paddleData);

        this.logger.log(
          `✅ Paddle subscription reactivated: ${sub.paddleSubscriptionId}`,
        );
      } catch (error) {
        this.logger.error('Failed to reactivate subscription in Paddle', error);
        throw new BadRequestException(
          'Failed to reactivate subscription with payment provider',
        );
      }
    } else {
      // ✅ For non-Paddle subscriptions, update DB directly
      sub.cancelAtPeriodEnd = false;
      sub.cancelledAt = undefined;
      sub.cancellationReason = undefined;
      sub.autoRenew = true;
      sub.nextPaymentDate = sub.currentPeriodEnd;
      sub.endDate = undefined;
      await sub.save();
    }

    // Send notification
    this.notificationService
      .notifyUser(user, {
        key: 'subscription.reactivated',
        vars: {
          name: user.profile?.fullName || user.profile?.email || 'User',
        },
      })
      .catch((error) => {
        this.logger.error(
          'Failed to send subscription reactivated notification',
          error,
        );
      });

    // Add history entry
    const history = new this.subscriptionHistoryModel({
      userId,
      subscriptionId: sub._id,
      planId: sub.planId,
      action: 'reactivated',
      startDate: sub.startDate,
      endDate: sub.currentPeriodEnd,
      status: sub.status,
      details: `Subscription reactivated${sub.provider === 'paddle' ? ' (via Paddle)' : ''}`,
      createdAt: new Date(),
    });
    await history.save();

    // Fetch fresh data
    const updatedSub = await this.subscriptionModel
      .findOne({ _id: sub._id })
      .exec();

    return updatedSub || sub;
  }

  async cancelPendingChange(userId: string) {
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

    if (!sub.pendingPlanId) {
      throw new BadRequestException('No pending plan change found to cancel');
    }

    // ✅ If Paddle subscription, cancel the scheduled change
    if (sub.provider === 'paddle' && sub.paddleSubscriptionId) {
      try {
        this.logger.log(
          `🔄 [CANCEL_PENDING] Cancelling scheduled change in Paddle: ${sub.paddleSubscriptionId}`,
        );

        // Get current plan to revert back to
        const currentPlan = await this.appPlanModel
          .findOne({ planId: sub.planId })
          .exec();

        if (!currentPlan) {
          throw new NotFoundException('Current plan not found');
        }

        const currentPriceId = this.paddleService.getPaddlePriceId(
          currentPlan,
          sub.billingCycle as AppSubscriptionBillingCycle,
        );

        if (!currentPriceId) {
          throw new BadRequestException(
            `Price ID not found for current plan=${sub.planId}, billing=${sub.billingCycle}`,
          );
        }

        // Cancel/revert the scheduled change
        await this.paddleService.cancelScheduledChange(
          sub.paddleSubscriptionId,
          currentPriceId,
        );

        this.logger.log(
          `✅ [CANCEL_PENDING] Scheduled change cancelled in Paddle: ${sub.paddleSubscriptionId}`,
        );
      } catch (error) {
        this.logger.error(
          '❌ [CANCEL_PENDING] Failed to cancel scheduled change in Paddle',
          error,
        );
        throw new BadRequestException(
          'Failed to cancel scheduled change with payment provider',
        );
      }
    }

    // Clear pending changes in DB
    sub.pendingPlanId = undefined;
    sub.pendingBillingCycle = undefined;
    sub.pendingChangeEffectiveDate = undefined;
    await sub.save();

    // Send notification
    this.notificationService
      .notifyUser(user, {
        key: 'subscription.pending_change_cancelled',
        vars: {
          name: user.profile?.fullName || user.profile?.email || 'User',
        },
      })
      .catch((error) => {
        this.logger.error(
          'Failed to send pending change cancelled notification',
          error,
        );
      });

    // Add history entry
    const history = new this.subscriptionHistoryModel({
      userId,
      subscriptionId: sub._id,
      planId: sub.planId,
      startDate: new Date(),
      action: 'pending_change_cancelled',
      status: sub.status,
      details: `Pending plan change cancelled by user${sub.provider === 'paddle' ? ' (via Paddle)' : ''}`,
      createdAt: new Date(),
    });
    await history.save();

    return sub;
  }
  async handlePaddleTransactionCompleted(data: {
    transactionId: string;
    paddleSubscriptionId: string;
    customData: any;
    paddleCustomerId: string;
    currency: string;
  }) {
    try {
      // Check if subscription already exists (upgrade scenario)
      const existingSub = await this.subscriptionModel
        .findOne({ paddleSubscriptionId: data.paddleSubscriptionId })
        .exec();

      if (existingSub) {
        this.logger.log(
          `⚠️ [WEBHOOK] Subscription exists: ${data.paddleSubscriptionId} - Ignoring transaction (handled by subscription.updated)`,
        );
        return;
      }

      // This is a NEW subscription
      if (!data.customData?.userId || !data.customData?.planId) {
        this.logger.error(
          `❌ [WEBHOOK] Missing custom_data fields in transaction ${data.transactionId}`,
        );
        return;
      }

      const { userId, planId, billingCycle } = data.customData;

      this.logger.log(
        `✅ [WEBHOOK] Creating NEW subscription → userId=${userId}, planId=${planId}`,
      );

      await this.subscribe(
        userId,
        planId,
        billingCycle || 'monthly',
        (data.currency as SupportedCurrency) || 'USD',
        'paddle',
        data.paddleSubscriptionId,
        data.paddleCustomerId,
      );

      this.logger.log(
        `✅ [WEBHOOK] Subscription created: ${data.paddleSubscriptionId}`,
      );
    } catch (error) {
      this.logger.error('❌ [WEBHOOK] Failed to handle transaction', error);
    }
  }

  /**
   * ✅ NEW: Sync local subscription from Paddle data
   * This is the SINGLE source of truth for updating subscriptions from Paddle
   */
  async syncFromPaddleData(paddleData: {
    paddleSubscriptionId: string;
    status: string;
    planId?: string;
    billingCycle?: AppSubscriptionBillingCycle;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    nextPaymentDate?: Date;
    cancelAtPeriodEnd?: boolean;
    scheduledCancellationDate?: Date;
    priceId?: string;
  }) {
    try {
      this.logger.log(
        `🔄 [SYNC] Syncing subscription: ${paddleData.paddleSubscriptionId}`,
      );

      const sub = await this.subscriptionModel
        .findOne({ paddleSubscriptionId: paddleData.paddleSubscriptionId })
        .exec();

      if (!sub) {
        this.logger.warn(
          `⚠️ [SYNC] Subscription not found: ${paddleData.paddleSubscriptionId}`,
        );
        return;
      }

      const oldPlanId = sub.planId;
      const oldBillingCycle = sub.billingCycle;

      // Update status
      if (paddleData.status === 'active' || paddleData.status === 'trialing') {
        sub.status = 'active';
      } else if (paddleData.status === 'past_due') {
        sub.status = 'active';
      } else if (paddleData.status === 'canceled') {
        sub.status = 'cancelled';
      }

      // Update billing periods
      if (paddleData.currentPeriodStart) {
        sub.currentPeriodStart = paddleData.currentPeriodStart;
      }
      if (paddleData.currentPeriodEnd) {
        sub.currentPeriodEnd = paddleData.currentPeriodEnd;
        if (sub.status === 'active') {
          sub.endDate = paddleData.currentPeriodEnd;
        }
      }

      // Update next payment date
      if (paddleData.nextPaymentDate) {
        sub.nextPaymentDate = paddleData.nextPaymentDate;
      }

      // Update cancellation state
      sub.cancelAtPeriodEnd = paddleData.cancelAtPeriodEnd || false;
      sub.autoRenew = !paddleData.cancelAtPeriodEnd;
      if (paddleData.scheduledCancellationDate) {
        sub.endDate = paddleData.scheduledCancellationDate;
      }

      // If priceId changed, resolve the new plan
      // If priceId changed, resolve the new plan
      if (paddleData.priceId) {
        const plan =
          (await this.appPlanModel
            .findOne({ 'paddlePriceIds.monthly': paddleData.priceId })
            .exec()) ||
          (await this.appPlanModel
            .findOne({ 'paddlePriceIds.yearly': paddleData.priceId })
            .exec()) ||
          (await this.appPlanModel
            .findOne({ 'paddlePriceIds.oneTime': paddleData.priceId })
            .exec());

        if (plan) {
          // Only update current plan if it's an immediate change (upgrade)
          // For scheduled changes (downgrades), keep current plan until effective date
          const isScheduledChange =
            sub.pendingPlanId &&
            sub.pendingChangeEffectiveDate &&
            sub.pendingChangeEffectiveDate > new Date();

          if (!isScheduledChange) {
            sub.planId = plan.planId;
            if (paddleData.billingCycle) {
              sub.billingCycle = paddleData.billingCycle;
            }

            if (
              oldPlanId !== sub.planId ||
              oldBillingCycle !== sub.billingCycle
            ) {
              this.logger.log(
                `🔄 [SYNC] Plan updated: ${oldPlanId}(${oldBillingCycle}) → ${sub.planId}(${sub.billingCycle})`,
              );
            }
          } else {
            this.logger.log(
              `⏳ [SYNC] Scheduled change detected - keeping current plan until ${sub.pendingChangeEffectiveDate}`,
            );
          }
        }
      }

      await sub.save();

      this.logger.log(
        `✅ [SYNC] Subscription synced: ${paddleData.paddleSubscriptionId}`,
      );

      return sub;
    } catch (error) {
      this.logger.error('❌ [SYNC] Failed to sync subscription', error);
      throw error;
    }
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
