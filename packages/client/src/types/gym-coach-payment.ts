import { Currency } from "./common";

export enum GymCoachPaymentType {
  EARNING = "earning",
  PAYOUT = "payout",
  ADJUSTMENT = "adjustment",
}

export enum GymCoachPaymentCategory {
  SESSION_COMMISSION = "session_commission",
  MEMBERSHIP_COMMISSION = "membership_commission",
  BASE_SALARY = "base_salary",
  BONUS = "bonus",
  TRANSFER = "transfer",
}

export enum GymCoachPaymentStatus {
  PENDING = "pending",
  CLEARED = "cleared",
  PAID = "paid",
  CANCELLED = "cancelled",
}

export interface GymCoachPayment {
  _id: string;
  gymId: string;
  coachId: string;
  amount: number;
  currency: Currency;
  type: GymCoachPaymentType;
  category: GymCoachPaymentCategory;
  status: GymCoachPaymentStatus;

  // Audit Trail
  referenceId?: string;
  referenceType?: string;
  description?: string;

  metadata?: {
    commissionRateSnapshot?: number;
    originalServicePrice?: number;
  };

  createdAt: string | Date;
  paidAt?: string | Date;
}

export interface GymCoachStats {
  totalEarned: number;
  pendingBalance: number;
  totalPaidOut: number;
}
