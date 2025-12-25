export interface ChargilyCheckoutItem {
  price: string;
  quantity: number;
}

export interface CreateChargilyCheckoutDto {
  items: ChargilyCheckoutItem[];
  payment_method?: "edahabia" | "cib";
  locale?: "ar" | "en" | "fr";
  pass_fees_to_customer?: boolean;
  customer_id?: string;
  metadata?: Record<string, any>;
}

export interface ChargilyCheckoutResponse {
  success: boolean;
  checkout_url: string;
  checkout_id: string;
}

export interface ChargilyCheckoutStatus {
  id: string;
  entity: string;
  livemode: boolean;
  amount: number;
  currency: string;
  fees: number;
  pass_fees_to_customer: boolean;
  status: "pending" | "processing" | "paid" | "failed" | "canceled";
  locale: "ar" | "en" | "fr";
  description: string;
  success_url: string;
  failure_url: string;
  webhook_endpoint: string;
  payment_method: string | null;
  invoice_id: string | null;
  customer_id: string | null;
  payment_link_id: string | null;
  metadata: Record<string, any>;
  created_at: number;
  updated_at: number;
  checkout_url: string;
}

// Upgrade preview types
export interface ChargilyUpgradePreviewData {
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

export interface ChargilyUpgradePreviewResponse {
  preview: ChargilyUpgradePreviewData;
  target_plan: {
    planId: string;
    name: string;
    level: string;
  };
  billing_cycle: string;
}
