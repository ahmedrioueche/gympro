import { AppSubscriptionBillingCycle } from "../types/appSubscription";

// Checkout item
export interface PaddleCheckoutItem {
  priceId: string;
  quantity: number;
}

// Create checkout DTOs
export interface CreatePaddleCheckoutDto {
  items: PaddleCheckoutItem[];
  customerId?: string;
  customData?: Record<string, any>;
}

export interface CreateSubscriptionCheckoutDto {
  planId: string;
  billingCycle?: AppSubscriptionBillingCycle;
}

// Checkout response
export interface PaddleCheckoutResponse {
  checkout_url: string;
  transaction_id: string;
  upgrade_applied?: boolean; // For direct upgrades without checkout
}

// Transaction status
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

// Upgrade preview types
export interface PaddleUpgradePreviewData {
  immediate_transaction?: {
    details: {
      totals: {
        total: string;
        subtotal: string;
        credit: string;
        balance: string;
      };
      line_items: Array<{
        totals: {
          total: string;
          subtotal: string;
        };
        proration?: {
          rate: string;
        };
      }>;
    };
  };
  credit?: string;
  update_summary?: {
    credit: {
      used: string;
    };
    charge: {
      total: string;
    };
  };
  next_transaction?: any;
}

export interface PaddleUpgradePreviewResponse {
  preview: PaddleUpgradePreviewData;
  target_plan: {
    planId: string;
    name: string;
    level: string;
  };
  billing_cycle: string;
}
