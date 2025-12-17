import { AppSubscriptionBillingCycle } from "../types/appSubscription";

export interface PaddleCheckoutItem {
  priceId: string;
  quantity: number;
}

export interface CreatePaddleCheckoutDto {
  items: PaddleCheckoutItem[];
  customerId?: string;
  customData?: Record<string, any>;
}

export interface CreateSubscriptionCheckoutDto {
  planId: string;
  billingCycle?: AppSubscriptionBillingCycle;
}

export interface PaddleCheckoutResponse {
  success: boolean;
  checkout_url: string;
  transaction_id: string;
}

export interface PaddleTransactionStatus {
  id: string;
  status:
    | "draft"
    | "ready"
    | "billed"
    | "paid"
    | "completed"
    | "canceled"
    | "past_due";
  customer_id: string;
  currency_code: string;
  billing_period: {
    starts_at: string;
    ends_at: string;
  } | null;
  items: Array<{
    price_id: string;
    quantity: number;
  }>;
  created_at: string;
  updated_at: string;
}
