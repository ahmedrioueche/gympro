import { BaseSubscriptionType, PricingTier } from "../types/subscription";

export interface CreateSubscriptionTypeDto {
  baseType: BaseSubscriptionType;
  customName?: string;
  description?: string;
  pricingTiers: PricingTier[];
  isAvailable?: boolean;
}

export interface UpdateSubscriptionTypeDto {
  baseType?: BaseSubscriptionType;
  customName?: string;
  description?: string;
  pricingTiers?: PricingTier[];
  isAvailable?: boolean;
}
