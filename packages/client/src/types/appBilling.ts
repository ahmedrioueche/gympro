import { AuditInfo } from './common';
export type AppPlanType = 'free' | 'basic' | 'pro' | 'enterprise';
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
  status: 'active' | 'expired' | 'cancelled';
  trial?: boolean;
  paymentMethod?: 'card' | 'paypal' | 'bank_transfer';
  autoRenew?: boolean;
}
