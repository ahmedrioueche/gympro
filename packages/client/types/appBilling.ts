import { AuditInfo } from "./common";

export type AppPlanType = "free" | "basic" | "pro" | "enterprise";

export interface AppPlan {
  _id: string;
  name: string;
  type: AppPlanType;
  description?: string;
  priceMonthly: number;
  priceYearly?: number;
  features: string[];
  maxGyms?: number; // e.g., free plan allows 1 gym
  maxMembers?: number;
  createdAt: string;
}

export interface AppSubscription extends AuditInfo {
  gymId: string;
  planId: string; // links to AppPlan._id
  startDate: string;
  endDate?: string;
  status: "active" | "expired" | "cancelled";
  trial?: boolean; // free trial flag
  paymentMethod?: "card" | "paypal" | "bank_transfer";
  autoRenew?: boolean;
}
