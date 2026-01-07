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
  "regular",
  "coached",
  "yoga",
  "crossfit",
  "pilates",
  "boxing",
  "sauna",
  "massage",
  "custom",
] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];
export type BaseSubscriptionType = (typeof BASE_SUBSCRIPTION_TYPES)[number];
export type SubscriptionPeriodUnit = (typeof SUBSCRIPTION_PERIOD_UNITS)[number];

export interface SubscriptionInfo {
  typeId: string;
  startDate: string | Date;
  endDate: string | Date;
  status: SubscriptionStatus;
  paymentMethod?: PaymentMethod;
}

export interface SubscriptionType extends AuditInfo {
  _id: string;
  gymId: string;
  baseType: BaseSubscriptionType;
  customName?: string;
  description?: string;
  price: number;
  duration: number;
  durationUnit: SubscriptionPeriodUnit;
  isAvailable: boolean;
}

import { User } from "./user";

export interface SubscriptionHistory extends AuditInfo {
  subscription: SubscriptionInfo;
  gym: Gym;
  handledBy?: string | User;
  notes?: string;
}
