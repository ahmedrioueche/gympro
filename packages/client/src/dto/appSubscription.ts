import {
  AppPlanLevel,
  AppPlanPricing,
  AppPlanType,
  AppSubscriptionBillingCycle,
  AppSubscriptionStatus,
} from "../types/appSubscription";
import { PaymentMethod } from "../types/common";

export interface CreateAppPlanDto {
  planId: string;
  version?: number; // optional
  order?: number; // optional
  type: AppPlanType;
  level: AppPlanLevel;
  name: string; // changed from nameKey
  description?: string; // changed from descriptionKey
  pricing: AppPlanPricing;
  trialDays?: number;
  limits: {
    maxGyms?: number;
    maxMembers?: number;
    maxGems?: number;
  };
  features: string[]; // changed from featureKeys
  createdAt?: Date;
}

export interface UpdateAppPlanDto {
  planId: string;
  type?: AppPlanType;
  level?: AppPlanLevel;
  nameKey?: string;
  descriptionKey?: string;
  pricing: AppPlanPricing;
  limits?: {
    maxGyms?: number;
    maxMembers?: number;
    maxGems?: number;
  };
  featureKeys?: string[];
}

export interface PlanPricingDto {
  monthly?: number;
  yearly?: number;
  oneTime?: number;
}

export interface PlanLimitsDto {
  maxGyms: number;
  maxMembers: number;
  maxGems: number;
}

export interface PlanDto {
  _id: string;
  planId: string;
  version: number;
  order?: number;
  type: AppPlanType;
  level: AppPlanLevel;
  name: string;
  description: string;
  currency: string;
  pricing: AppPlanPricing;
  trialDays?: number;
  limits: PlanLimitsDto;
  features: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AddOnDto {
  gyms?: number;
  members?: number;
  [key: string]: any;
}

export interface GetSubscriptionDto {
  _id: string;
  userId: string;
  planId: string;
  startDate: string | Date;
  endDate?: string | Date;
  status: AppSubscriptionStatus;
  paymentMethod?: PaymentMethod;
  autoRenew?: boolean;

  billingCycle?: AppSubscriptionBillingCycle;
  lastPaymentDate?: string;
  nextPaymentDate?: string;

  trial?: {
    startDate: string | Date;
    endDate: string | Date;
    hasUsedTrial: boolean;
    convertedToPaid?: boolean;
  };

  addOns?: {
    members?: number;
    gyms?: number;
    gems?: number;
  }[];

  cancelledAt?: string;
  cancellationReason?: string;
  plan: PlanDto;
}
