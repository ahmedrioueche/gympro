import {
  AppSubscription,
  BlockerModalConfig,
  WarningSeverity,
  WarningTiming,
} from '@ahmedrioueche/gympro-client';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppSubscriptionModel } from '../appBilling.schema';

@Injectable()
export class SubscriptionBlockerService {
  private readonly SOFT_GRACE_HOURS = 6;
  private readonly READ_ONLY_GRACE_DAYS = 3;

  // Pre-expiry warning thresholds
  private readonly WARNING_THRESHOLDS = {
    DAYS_7: 7,
    DAYS_3: 3,
    DAYS_1: 1,
    HOURS_6: 6,
  };

  constructor(
    @InjectModel(AppSubscriptionModel.name)
    private subscriptionModel: Model<AppSubscription>,
  ) {}

  /**
   * Main method: Determine if modal should show and what type
   */
  async getBlockerConfig(userId: string): Promise<BlockerModalConfig | null> {
    const subscription = await this.subscriptionModel
      .findOne({
        userId,
      })
      .exec();

    if (!subscription) {
      return null;
    }

    const now = new Date();

    // FIRST: Check for pre-expiry warnings (skip for manual subscriptions)
    if (subscription.autoRenewType !== 'manual') {
      const preWarning = this.checkPreExpiryWarning(subscription, now);

      if (preWarning.shouldWarn) {
        return this.createPreExpiryWarningModal(subscription, preWarning);
      }
    }

    // THEN: Check if subscription is expired/expiring
    const expiryCheck = this.checkExpiry(subscription, now);

    if (!expiryCheck.shouldBlock) {
      return null;
    }

    // First time seeing this expired state? Start soft grace
    if (!subscription.softGracePeriod) {
      await this.startSoftGrace(subscription._id.toString(), now);

      // Reload subscription with updated softGracePeriod
      const updatedSub = await this.subscriptionModel
        .findById(subscription._id)
        .exec();
      return this.createWarningModal(updatedSub!, expiryCheck);
    }

    // Calculate grace phases
    const softGraceEnd = new Date(subscription.softGracePeriod.expiresAt);
    const readOnlyEnd = new Date(softGraceEnd);
    readOnlyEnd.setDate(readOnlyEnd.getDate() + this.READ_ONLY_GRACE_DAYS);

    // Still in soft grace (warning phase) → Show dismissible warning
    if (now < softGraceEnd) {
      return this.createWarningModal(subscription, expiryCheck);
    }

    // In read-only grace period → Show blocker but keep status active
    if (now < readOnlyEnd) {
      return this.createBlockerModal(subscription, expiryCheck);
    }

    // Read-only grace expired → Mark as expired and show hard block
    if (subscription.status === 'active') {
      await this.subscriptionModel.findByIdAndUpdate(subscription._id, {
        status: 'expired',
      });
      subscription.status = 'expired'; // Update local object
    }

    return this.createBlockerModal(subscription, expiryCheck);
  }

  /**
   * Check for pre-expiry warnings (7d, 3d, 1d, 6h before expiry)
   * Skip for manual subscriptions
   */
  private checkPreExpiryWarning(
    sub: AppSubscription,
    now: Date,
  ): {
    shouldWarn: boolean;
    timing: WarningTiming | null;
    daysRemaining: number;
    hoursRemaining: number;
    expiryDate: Date | null;
  } {
    // Skip for manual subscriptions
    if (sub.autoRenewType === 'manual') {
      return {
        shouldWarn: false,
        timing: null,
        daysRemaining: 0,
        hoursRemaining: 0,
        expiryDate: null,
      };
    }

    // Determine end date based on subscription type
    let endDate: Date | null = null;

    if (sub.status === 'trialing' && sub.trial?.endDate) {
      endDate = new Date(sub.trial.endDate);
    } else if (sub.currentPeriodEnd) {
      endDate = new Date(sub.currentPeriodEnd);
    }

    if (!endDate) {
      return {
        shouldWarn: false,
        timing: null,
        daysRemaining: 0,
        hoursRemaining: 0,
        expiryDate: null,
      };
    }

    const msRemaining = endDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.ceil(msRemaining / (1000 * 60 * 60));

    // Already expired or expiring soon
    if (daysRemaining <= 0) {
      return {
        shouldWarn: false,
        timing: null,
        daysRemaining: 0,
        hoursRemaining: 0,
        expiryDate: endDate,
      };
    }

    // Check thresholds (exact day matches)
    if (daysRemaining === this.WARNING_THRESHOLDS.DAYS_7) {
      return {
        shouldWarn: true,
        timing: 'days_7',
        daysRemaining,
        hoursRemaining,
        expiryDate: endDate,
      };
    }

    if (daysRemaining === this.WARNING_THRESHOLDS.DAYS_3) {
      return {
        shouldWarn: true,
        timing: 'days_3',
        daysRemaining,
        hoursRemaining,
        expiryDate: endDate,
      };
    }

    if (daysRemaining === this.WARNING_THRESHOLDS.DAYS_1) {
      return {
        shouldWarn: true,
        timing: 'days_1',
        daysRemaining,
        hoursRemaining,
        expiryDate: endDate,
      };
    }

    // Less than 1 day remaining, check hours
    if (
      daysRemaining === 0 &&
      hoursRemaining <= this.WARNING_THRESHOLDS.HOURS_6 &&
      hoursRemaining > 0
    ) {
      return {
        shouldWarn: true,
        timing: 'hours_6',
        daysRemaining,
        hoursRemaining,
        expiryDate: endDate,
      };
    }

    // No warning threshold met
    return {
      shouldWarn: false,
      timing: null,
      daysRemaining,
      hoursRemaining,
      expiryDate: endDate,
    };
  }

  /**
   * Check if subscription is expired or expiring
   */
  private checkExpiry(
    sub: AppSubscription,
    now: Date,
  ): {
    shouldBlock: boolean;
    reason: BlockerModalConfig['reason'] | null;
    expiryDate: Date | null;
    daysRemaining: number;
  } {
    // Case 1: Trial expired
    if (sub.status === 'trialing' && sub.trial?.endDate) {
      const expiryDate = new Date(sub.trial.endDate);
      const daysRemaining = this.getDaysRemaining(expiryDate, now);

      if (daysRemaining <= 0) {
        return {
          shouldBlock: true,
          reason: 'trial_expired',
          expiryDate,
          daysRemaining: 0,
        };
      }
    }

    // Case 2: Manual subscription period ended (needs renewal)
    // Status is still "active" but period has ended
    if (
      sub.status === 'active' &&
      sub.autoRenewType === 'manual' &&
      sub.currentPeriodEnd
    ) {
      const periodEnd = new Date(sub.currentPeriodEnd);
      const periodExpired = periodEnd < now;

      if (periodExpired) {
        return {
          shouldBlock: true,
          reason: 'manual_expired',
          expiryDate: periodEnd,
          daysRemaining: 0,
        };
      }
    }

    // Case 3: Cancelled subscription reached end date
    if (
      sub.status === 'active' &&
      sub.cancelAtPeriodEnd === true &&
      sub.currentPeriodEnd
    ) {
      const endDate = new Date(sub.currentPeriodEnd);
      const hasEnded = endDate < now;

      if (hasEnded) {
        return {
          shouldBlock: true,
          reason: 'cancelled_expired',
          expiryDate: endDate,
          daysRemaining: 0,
        };
      }
    }

    // Case 4: Cancelled subscription (already marked as cancelled)
    if (sub.status === 'cancelled' && sub.endDate) {
      const expiryDate = new Date(sub.endDate);
      const daysRemaining = this.getDaysRemaining(expiryDate, now);

      if (daysRemaining <= 0) {
        return {
          shouldBlock: true,
          reason: 'cancelled_expired',
          expiryDate,
          daysRemaining: 0,
        };
      }
    }

    // Case 5: Subscription marked as expired
    if (sub.status === 'expired') {
      return {
        shouldBlock: true,
        reason: 'manual_expired',
        expiryDate: sub.endDate ? new Date(sub.endDate) : null,
        daysRemaining: 0,
      };
    }

    return {
      shouldBlock: false,
      reason: null,
      expiryDate: null,
      daysRemaining: 0,
    };
  }

  /**
   * Start soft grace period (user gets X hours before read-only mode)
   */
  private async startSoftGrace(
    subscriptionId: string,
    now: Date,
  ): Promise<void> {
    const expiresAt = new Date(
      now.getTime() + this.SOFT_GRACE_HOURS * 60 * 60 * 1000,
    );

    await this.subscriptionModel.findByIdAndUpdate(subscriptionId, {
      $set: {
        softGracePeriod: {
          startDate: now,
          expiresAt,
        },
      },
    });
  }

  /**
   * Create pre-expiry warning modal (7d, 3d, 1d, 6h before expiry)
   */
  private createPreExpiryWarningModal(
    sub: AppSubscription,
    warning: ReturnType<typeof this.checkPreExpiryWarning>,
  ): BlockerModalConfig {
    const severity = this.getSeverityForTiming(warning.timing!);
    const reason = this.getReasonForPreWarning(sub);
    const { titleKey, messageKey } = this.getPreExpiryTranslationKeys(
      reason,
      warning.timing!,
    );

    return {
      show: true,
      type: 'warning',
      reason,
      expiryDate: warning.expiryDate!,
      daysRemaining: warning.daysRemaining,
      canDismiss: true,
      primaryAction: this.getPrimaryActionForPreWarning(sub),
      secondaryActions: ['view_plans'],
      titleKey,
      messageKey,
      severity,
      timing: warning.timing!,
      showCountdown: true,
    };
  }

  /**
   * Create warning modal config (dismissible) - for expired state with soft grace
   */
  private createWarningModal(
    sub: AppSubscription,
    expiry: ReturnType<typeof this.checkExpiry>,
  ): BlockerModalConfig {
    const hoursUntilBlock = this.getHoursRemaining(
      sub.softGracePeriod!.expiresAt,
    );

    const { titleKey, messageKey } = this.getTranslationKeys(
      expiry.reason!,
      'warning',
    );

    return {
      show: true,
      type: 'warning',
      reason: expiry.reason!,
      expiryDate: expiry.expiryDate!,
      softGraceExpiresAt: new Date(sub.softGracePeriod!.expiresAt),
      hoursUntilBlock,
      canDismiss: true,
      primaryAction: this.getPrimaryAction(expiry.reason!),
      secondaryActions: ['view_plans', 'export_data'],
      titleKey,
      messageKey,
      urgencyMessageKey: 'subscription.blocker.urgency_message',
      showCountdown: true,
      severity: 'critical',
      timing: 'expired',
    };
  }

  /**
   * Create blocker modal config (non-dismissible) - for post-grace hard block
   */
  private createBlockerModal(
    sub: AppSubscription,
    expiry: ReturnType<typeof this.checkExpiry>,
  ): BlockerModalConfig {
    const { titleKey, messageKey } = this.getTranslationKeys(
      expiry.reason!,
      'blocker',
    );

    return {
      show: true,
      type: 'blocker',
      reason: expiry.reason!,
      expiryDate: expiry.expiryDate!,
      canDismiss: false,
      primaryAction: this.getPrimaryAction(expiry.reason!),
      secondaryActions: ['view_plans', 'export_data'],
      titleKey,
      messageKey,
      showCountdown: false,
      severity: 'blocker',
      timing: 'post_grace',
    };
  }

  /**
   * Get severity level based on timing
   */
  private getSeverityForTiming(timing: WarningTiming): WarningSeverity {
    switch (timing) {
      case 'days_7':
        return 'info';
      case 'days_3':
        return 'notice';
      case 'days_1':
        return 'warning';
      case 'hours_6':
        return 'urgent';
      case 'expired':
        return 'critical';
      case 'post_grace':
        return 'blocker';
    }
  }

  /**
   * Get reason for pre-expiry warning
   */
  private getReasonForPreWarning(
    sub: AppSubscription,
  ): BlockerModalConfig['reason'] {
    if (sub.status === 'trialing') {
      return 'trial_expiring';
    }

    if (sub.cancelAtPeriodEnd) {
      return 'cancelled_ending';
    }

    // Auto-renewing subscription
    return 'manual_renewal_due'; // Using manual_renewal_due for auto-renew warnings
  }

  /**
   * Get translation keys for pre-expiry warnings
   */
  private getPreExpiryTranslationKeys(
    reason: BlockerModalConfig['reason'],
    timing: WarningTiming,
  ): { titleKey: string; messageKey: string } {
    const prefix = 'subscription.blocker';
    return {
      titleKey: `${prefix}.${reason}.${timing}.title`,
      messageKey: `${prefix}.${reason}.${timing}.message`,
    };
  }

  /**
   * Get translation keys based on reason and modal type (for expired states)
   */
  private getTranslationKeys(
    reason: BlockerModalConfig['reason'],
    type: 'warning' | 'blocker',
  ): { titleKey: string; messageKey: string } {
    const prefix = 'subscription.blocker';

    if (type === 'warning') {
      switch (reason) {
        case 'trial_expired':
          return {
            titleKey: `${prefix}.trial_expired.warning_title`,
            messageKey: `${prefix}.trial_expired.warning_message`,
          };
        case 'manual_expired':
          return {
            titleKey: `${prefix}.manual_expired.warning_title`,
            messageKey: `${prefix}.manual_expired.warning_message`,
          };
        case 'cancelled_expired':
          return {
            titleKey: `${prefix}.cancelled_expired.warning_title`,
            messageKey: `${prefix}.cancelled_expired.warning_message`,
          };
        default:
          return {
            titleKey: `${prefix}.default.warning_title`,
            messageKey: `${prefix}.default.warning_message`,
          };
      }
    }

    // Blocker type
    switch (reason) {
      case 'trial_expired':
        return {
          titleKey: `${prefix}.trial_expired.blocker_title`,
          messageKey: `${prefix}.trial_expired.blocker_message`,
        };
      case 'manual_expired':
        return {
          titleKey: `${prefix}.manual_expired.blocker_title`,
          messageKey: `${prefix}.manual_expired.blocker_message`,
        };
      case 'cancelled_expired':
        return {
          titleKey: `${prefix}.cancelled_expired.blocker_title`,
          messageKey: `${prefix}.cancelled_expired.blocker_message`,
        };
      default:
        return {
          titleKey: `${prefix}.default.blocker_title`,
          messageKey: `${prefix}.default.blocker_message`,
        };
    }
  }

  /**
   * Get primary action for pre-expiry warnings
   */
  private getPrimaryActionForPreWarning(
    sub: AppSubscription,
  ): BlockerModalConfig['primaryAction'] {
    if (sub.status === 'trialing') {
      return 'subscribe';
    }

    if (sub.cancelAtPeriodEnd) {
      return 'reactivate';
    }

    // Auto-renewing subscription - check payment
    return 'renew';
  }

  /**
   * Get primary action based on reason (for expired states)
   */
  private getPrimaryAction(
    reason: BlockerModalConfig['reason'],
  ): BlockerModalConfig['primaryAction'] {
    switch (reason) {
      case 'trial_expired':
      case 'trial_expiring':
        return 'subscribe';

      case 'manual_expired':
      case 'manual_renewal_due':
        return 'renew';

      case 'cancelled_expired':
      case 'cancelled_ending':
        return 'reactivate';

      default:
        return 'subscribe';
    }
  }

  /**
   * Helper: Calculate days remaining
   */
  private getDaysRemaining(endDate: Date, now: Date): number {
    const diff = endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Helper: Calculate hours remaining
   */
  private getHoursRemaining(endDate: string | Date): number {
    const diff = new Date(endDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60)));
  }

  /**
   * Reset soft grace period (useful for testing or manual admin actions)
   */
  async resetSoftGrace(subscriptionId: string): Promise<void> {
    await this.subscriptionModel.findByIdAndUpdate(subscriptionId, {
      $unset: { softGracePeriod: 1 },
    });
  }

  /**
   * Get current grace phase for a subscription
   * Useful for access control logic
   */
  getGracePhase(sub: AppSubscription): 'warning' | 'read_only' | 'expired' {
    if (!sub.softGracePeriod) return 'warning';

    const now = Date.now();
    const softEnd = new Date(sub.softGracePeriod.expiresAt).getTime();
    const readOnlyEnd =
      softEnd + this.READ_ONLY_GRACE_DAYS * 24 * 60 * 60 * 1000;

    if (now < softEnd) return 'warning';
    if (now < readOnlyEnd) return 'read_only';
    return 'expired';
  }
}
