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
import { AuditInfo, PaymentMethod } from './common';

// Export constants
export const PAYMENT_STATUSES = ['pending', 'completed', 'failed', 'refunded', 'partial'] as const;
export const PAYMENT_TARGET_TYPES = ['app_subscription', 'gym_subscription', 'service'] as const;
export const INVOICE_STATUSES = ['unpaid', 'partially_paid', 'paid', 'refunded'] as const;

// Derive types from constants
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type PaymentTargetType = (typeof PAYMENT_TARGET_TYPES)[number];
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export interface PaymentTransaction extends AuditInfo {
  targetId: string; // the ID of the subscription, service, or plan
  targetType: PaymentTargetType;
  amount: number;
  currency: string;
  date: string;
  status: PaymentStatus;
  method: PaymentMethod;
  referenceId?: string;
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
  status: InvoiceStatus;
}
