/**
 * These payment and invoice interfaces are designed to be generic and reusable
 * for both App-level billing (e.g., SaaS subscriptions, plans) and Gym-level
 * billing (e.g., membership subscriptions, services, coaching fees).
 *
 * - `PaymentTransaction` tracks individual payments, including partial payments
 *   and refunds.
 * - `Invoice` aggregates payments and provides a summary status for reporting
 *   and receipts.
 *
 * The `targetType` and `targetId` fields make it easy to link payments/invoices
 * to any billable entity in the system.
 */
import { AuditInfo } from "./common";

export type PaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded"
  | "partial";

export type PaymentTargetType =
  | "app_subscription"
  | "gym_subscription"
  | "service";

export type InvoiceStatus = "unpaid" | "partially_paid" | "paid" | "refunded";

export interface PaymentTransaction extends AuditInfo {
  targetId: string; // the ID of the subscription, service, or plan
  targetType: PaymentTargetType;
  amount: number;
  currency: string;
  date: string;
  status: PaymentStatus;
  method: PaymentMethod;
  referenceId?: string; // external processor reference
  notes?: string;
}

export interface Invoice extends AuditInfo {
  targetId: string; // the ID of the plan/subscription/service
  targetType: PaymentTargetType;
  invoiceNumber: string;
  issuedAt: string;
  dueDate?: string;
  totalAmount: number;
  currency: string;
  payments: PaymentTransaction[];
  status: "unpaid" | "partially_paid" | "paid" | "refunded";
}

export type PaymentMethod = "cash" | "ccp" | "dahabia" | "card" | "paypal";
