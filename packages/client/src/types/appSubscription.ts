import { AuditInfo, PaymentMethod, SupportedCurrency } from "./common";

export const APP_PAYMENT_PROVIDERS = ["chargily", "paddle"] as const;
export const APP_SUBSCRIPTION_BILLING_CYCLES = ["monthly", "yearly"] as const;
export const APP_PLAN_LEVELS = ["free", "starter", "pro", "premium"] as const;

export const APP_SUBSCRIPTION_STATUSES = [
  "active",
  "expired",
  "cancelled",
  "trialing",
] as const;

export const APP_SUBSCRIPTION_HISTORY_ACTIONS = [
  "created",
  "upgraded",
  "downgraded",
  "renewed",
  "cancelled",
  "expired",
  "reactivated",
  "downgrade_scheduled",
  "switch_scheduled",
  "pending_change_cancelled",
] as const;

export type AppPaymentProvider = (typeof APP_PAYMENT_PROVIDERS)[number];
export type AppSubscriptionBillingCycle =
  (typeof APP_SUBSCRIPTION_BILLING_CYCLES)[number];
export type AppPlanLevel = (typeof APP_PLAN_LEVELS)[number];
export type AppSubscriptionStatus = (typeof APP_SUBSCRIPTION_STATUSES)[number];

export type AppSubscriptionHistoryAction =
  (typeof APP_SUBSCRIPTION_HISTORY_ACTIONS)[number];

export type AppPlanPricing = {
  [currency in SupportedCurrency]?: {
    monthly?: number;
    yearly?: number;
    oneTime?: number;
  };
};

export const APP_WARNING_EMAIL_TYPES = [
  "trial_7d",
  "trial_3d",
  "trial_1d",
  "trial_0d",
  "trial_expired",
  "renewal_7d",
  "renewal_3d",
  "renewal_1d",
  "renewal_0d",
  "renewal_expired",
  "grace_started",
  "grace_2d",
  "grace_expired",
  "cancelled_7d",
  "cancelled_3d",
  "cancelled_1d",
  "cancelled_0d",
  "payment_failed",
] as const;

export type WarningEmailType = (typeof APP_WARNING_EMAIL_TYPES)[number];

export interface AppPlan extends AuditInfo {
  _id: string;
  planId: string; //custom stable id
  version?: number;
  level: AppPlanLevel;
  order?: number; // for sorting plans
  name: string;
  description?: string;
  pricing: AppPlanPricing;
  paddleProductId?: string;
  paddlePriceIds?: {
    monthly?: string;
    yearly?: string;
  };
  trialDays?: number; // only for subscription plans

  // flexible limits
  limits: {
    maxGyms?: number;
    maxMembers?: number;
    maxGems?: number;
  };

  features: string[];
}

export const APP_SUBSCRIPTION_AUTO_RENEW_TYPES = ["auto", "manual"] as const;

export type AutoRenewType = (typeof APP_SUBSCRIPTION_AUTO_RENEW_TYPES)[number];

export interface AppSubscription extends AuditInfo {
  _id: string;
  userId: string;
  planId: string;
  startDate: string | Date;
  endDate?: string | Date;
  currentPeriodStart: string | Date;
  currentPeriodEnd: string | Date;
  status: AppSubscriptionStatus;
  paymentMethod?: PaymentMethod;
  autoRenew?: boolean;
  autoRenewType?: AutoRenewType;
  provider?: AppPaymentProvider;

  // Billing cycle tracking
  billingCycle?: AppSubscriptionBillingCycle;
  lastPaymentDate?: string | Date;
  nextPaymentDate?: string | Date;

  trial?: {
    startDate: string | Date;
    endDate: string | Date;
    hasUsedTrial: boolean; // Prevent multiple trials
    convertedToPaid?: boolean;
  };

  addOns?: {
    members?: number; // +100 members
    gyms?: number; // +1 gym
    gems?: number; // +200 gems
  }[];

  // ===== Grace Period Tracking =====
  softGracePeriod?: {
    startDate: string | Date; // When first warning shown
    expiresAt: string | Date; // When hard block kicks in (e.g., +6 hours)
  };

  // ===== Warning/Email Tracking =====
  warnings?: {
    type: WarningEmailType;
    sentAt: string | Date;
  }[];

  // Cancellation tracking
  cancelledAt?: string;
  cancelAtPeriodEnd?: boolean;
  cancellationReason?: string;
  pendingChangeEffectiveDate?: string | Date;
  pendingPlanId?: string;
  pendingBillingCycle?: AppSubscriptionBillingCycle;

  paddleSubscriptionId?: string;
  paddleCustomerId?: string;
  chargilyCheckoutId?: string;
  chargilyInvoiceId?: string;
}

// Separate history model for tracking all subscription changes
export interface AppSubscriptionHistory extends AuditInfo {
  _id: string;
  userId: string;
  subscriptionId: string; // reference to the AppSubscription
  planId: string;

  // Snapshot of subscription state at this point in time
  action: AppSubscriptionHistoryAction;
  startDate: string | Date;
  endDate?: string | Date;
  status: AppSubscriptionStatus;

  // Payment info for this history entry
  amountPaid?: number;
  currency?: SupportedCurrency;
  paymentMethod?: PaymentMethod;

  // Additional context
  notes?: string;
}

export type WarningSeverity =
  | "info"
  | "notice"
  | "warning"
  | "urgent"
  | "critical"
  | "blocker";

export type WarningTiming =
  | "days_7" // 7 days before
  | "days_3" // 3 days before
  | "days_1" // 1 day before
  | "hours_6" // 6 hours before
  | "expired" // Already expired (grace period)
  | "post_grace"; // After grace period

export interface BlockerModalConfig {
  show: boolean;
  type: "warning" | "blocker";

  reason:
    | "trial_expiring"
    | "trial_expired"
    | "manual_renewal_due"
    | "manual_expired"
    | "cancelled_ending"
    | "cancelled_expired";

  // Timing info
  daysRemaining?: number;
  expiryDate?: Date;
  softGraceExpiresAt?: Date;
  hoursUntilBlock?: number;
  severity: WarningSeverity;
  timing?: WarningTiming;
  // UI control
  canDismiss: boolean;

  // Actions
  primaryAction: "subscribe" | "renew" | "reactivate";
  secondaryActions?: ("view_plans" | "contact_support" | "export_data")[];

  // Content - NOW TRANSLATION KEYS
  titleKey: string; // e.g., 'subscription.blocker.trial_expired.title'
  messageKey: string; // e.g., 'subscription.blocker.trial_expired.message'
  urgencyMessageKey?: string; // e.g., 'subscription.blocker.urgency_message'

  showCountdown: boolean;
}
