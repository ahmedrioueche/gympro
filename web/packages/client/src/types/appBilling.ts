import { AuditInfo, PaymentMethod } from './common';

// Export constants
export const APP_PLAN_TYPES = ['free', 'basic', 'pro', 'enterprise'] as const;
export const APP_SUBSCRIPTION_STATUSES = ['active', 'expired', 'cancelled'] as const;

// Derive types from constants
export type AppPlanType = (typeof APP_PLAN_TYPES)[number];
export type AppSubscriptionStatus = (typeof APP_SUBSCRIPTION_STATUSES)[number];

export interface AppPlan extends AuditInfo {
  _id: string;
  name: string;
  type: AppPlanType;
  description?: string;
  priceMonthly: number;
  priceYearly?: number;
  features: string[];
  maxGyms?: number;
  maxMembers?: number;
}

export interface AppSubscription extends AuditInfo {
  gymId: string;
  planId: string;
  startDate: string;
  endDate?: string;
  status: AppSubscriptionStatus;
  trial?: boolean;
  paymentMethod?: PaymentMethod;
  autoRenew?: boolean;
}
