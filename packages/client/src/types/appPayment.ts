import { AppPaymentProvider } from "./appSubscription";
import { SupportedCurrency } from "./common";

// App Payment Statuses
export const APP_PAYMENT_STATUSES = [
  "pending",
  "completed",
  "failed",
  "refunded",
] as const;

export type AppPaymentStatus = (typeof APP_PAYMENT_STATUSES)[number];

// App Payment Interface
export interface AppPayment {
  _id: string;
  userId: string;
  subscriptionId: string;
  planId: string;
  amount: number;
  currency: SupportedCurrency;
  status: AppPaymentStatus;
  provider: AppPaymentProvider;
  providerTransactionId: string;
  providerCustomerId?: string;
  paymentMethod?: string;
  description?: string;
  metadata?: Record<string, any>;
  paidAt?: string | Date;
  refundedAt?: string | Date;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface AppPaymentWithPlan extends AppPayment {
  plan?: {
    _id: string;
    planId: string;
    name: string;
    level: string;
  };
}

export interface AdminPaymentView extends Omit<AppPayment, "userId"> {
  planName: string;
  userId: {
    _id: string;
    profile: {
      fullName: string;
      email: string;
      username: string;
    };
  };
}
