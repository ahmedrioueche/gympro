import { AuditInfo } from "./common";
import { Gym } from "./gym";

export interface SubscriptionInfo {
  typeId: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "cancelled";
  paymentMethod?: "cash" | "ccp" | "dahabia" | "card";
}

export type BaseSubscriptionType =
  | "regular"
  | "coached"
  | "yoga"
  | "crossfit"
  | "pilates"
  | "boxing"
  | "sauna"
  | "massage"
  | "custom";

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
  createdAt: string;
}

export type SubscriptionPeriodUnit = "day" | "week" | "month" | "year";

export interface SubscriptionHistory extends AuditInfo {
  subscription: SubscriptionInfo;
  gym: Gym;
  handledBy?: string;
  notes?: string;
}
