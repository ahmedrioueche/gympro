import {
  AppPaymentProvider,
  AppPlanLevel,
  AppPlanPricing,
  AppSubscriptionBillingCycle,
  AppSubscriptionStatus,
  AutoRenewType,
  WarningEmailType,
} from "../types/appSubscription";
import { PaymentMethod } from "../types/common";
import { GymManagerFeature } from "../types/features";

export interface AppFeaturePackage {
  _id: string;
  name: string;
  localizedName?: Record<string, string>;
  features: GymManagerFeature[];
  order: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateAppFeaturePackageDto {
  name: string;
  localizedName?: Record<string, string>;
  features: GymManagerFeature[];
  order?: number;
  isActive?: boolean;
}

export interface UpdateAppFeaturePackageDto extends Partial<CreateAppFeaturePackageDto> {}

export interface CreateAppPlanDto {
  planId: string;
  version?: number;
  order?: number;
  level: AppPlanLevel;
  name: string;
  description?: string;
  isActive?: boolean;
  pricing: AppPlanPricing;
  paddleProductId?: string;
  paddlePriceIds?: {
    monthly?: string;
    yearly?: string;
    oneTime?: string;
  };
  trialDays?: number;
  limits: {
    maxGyms?: number;
    maxMembers?: number;
    maxGems?: number;
  };
  featurePackages?: string[];
  publicFeaturePackages?: string[];
  createdAt?: Date;
}

export interface UpdateAppPlanDto {
  planId?: string;
  version?: number;
  order?: number;
  level?: AppPlanLevel;
  name?: string;
  description?: string;
  isActive?: boolean;
  pricing?: AppPlanPricing;
  paddleProductId?: string;
  paddlePriceIds?: {
    monthly?: string;
    yearly?: string;
    oneTime?: string;
  };
  trialDays?: number;
  limits?: {
    maxGyms?: number;
    maxMembers?: number;
    maxGems?: number;
  };
  featurePackages?: string[];
  publicFeaturePackages?: string[];
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
  level: AppPlanLevel;
  name: string;
  description: string;
  isActive?: boolean;
  pricing: AppPlanPricing;
  trialDays?: number;
  limits: PlanLimitsDto;
  featurePackages?: AppFeaturePackage[];
  publicFeaturePackages?: AppFeaturePackage[];
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
  currentPeriodStart: string | Date;
  currentPeriodEnd: string | Date;
  status: AppSubscriptionStatus;
  paymentMethod?: PaymentMethod;
  autoRenew?: boolean;
  autoRenewType?: AutoRenewType;
  billingCycle?: AppSubscriptionBillingCycle;
  lastPaymentDate?: string | Date;
  nextPaymentDate?: string | Date;

  provider?: AppPaymentProvider;
  paddleSubscriptionId?: string;
  paddleCustomerId?: string;
  chargilyCheckoutId?: string;
  chargilyInvoiceId?: string;

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

  cancelledAt?: string;
  cancelAtPeriodEnd?: boolean;
  cancellationReason?: string;

  pendingPlanId?: string;
  pendingBillingCycle?: AppSubscriptionBillingCycle;
  pendingChangeEffectiveDate?: string | Date;

  plan: PlanDto;
}
