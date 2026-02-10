import { AuditInfo, PaymentMethod } from "./common";
import { Gym } from "./gym";

export const SUBSCRIPTION_STATUSES = [
  "active",
  "expired",
  "cancelled",
] as const;
export const SUBSCRIPTION_PERIOD_UNITS = [
  "day",
  "week",
  "month",
  "year",
] as const;

export const BASE_SUBSCRIPTION_TYPES = [
  "starter",
  "pro",
  "premium",
  "free",
] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];
export type SubscriptionPeriodUnit = (typeof SUBSCRIPTION_PERIOD_UNITS)[number];
export type BaseSubscriptionType = (typeof BASE_SUBSCRIPTION_TYPES)[number];

export interface SubscriptionInfo {
  typeId: string;
  startDate: string | Date;
  endDate: string | Date;
  status: SubscriptionStatus;
  paymentMethod?: PaymentMethod;
}

export interface PricingTier {
  duration: number;
  durationUnit: SubscriptionPeriodUnit;
  price: number;
}

export interface SubscriptionType extends AuditInfo {
  _id: string;
  gymId: string;
  customName?: string;
  description?: string;
  pricingTiers: PricingTier[];
  isAvailable: boolean;
  services?: string[];
}

import { User } from "./user";

export interface SubscriptionHistory extends AuditInfo {
  subscription: SubscriptionInfo;
  gym: Gym;
  pricePaid?: number;
  currency?: string;
  handledBy?: string | User;
  notes?: string;
}
