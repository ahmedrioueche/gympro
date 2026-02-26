import { PricingTier } from "../types/subscription";

export interface CreateSubscriptionTypeDto {
  customName?: string;
  description?: string;
  pricingTiers: PricingTier[];
  isAvailable?: boolean;
  services?: string[];
  allowedIntervals?: number[];
  allowedDaysPerWeek?: number;
}

export interface UpdateSubscriptionTypeDto {
  customName?: string;
  description?: string;
  pricingTiers?: PricingTier[];
  isAvailable?: boolean;
  services?: string[];
  allowedIntervals?: number[];
  allowedDaysPerWeek?: number;
}
