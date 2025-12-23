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
    oneTime?: string;
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
