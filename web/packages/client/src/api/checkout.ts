import { ApiResponse } from "../types/api";
import { AppSubscriptionBillingCycle } from "../types/appSubscription";
import { apiClient, handleApiError } from "./helper";

export interface CheckoutItem {
  price: string;
  quantity: number;
}

export interface CreateCheckoutDto {
  items: CheckoutItem[];
  payment_method?: "edahabia" | "cib";
  locale?: "ar" | "en" | "fr";
  pass_fees_to_customer?: boolean;
  customer_id?: string;
  metadata?: Record<string, any>;
}

export interface CheckoutResponse {
  success: boolean;
  checkout_url: string;
  checkout_id: string;
}

export interface CheckoutStatus {
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

export const checkoutApi = {
  /**
   * Create a new checkout session
   */
  createCheckout: async (
    checkoutData: CreateCheckoutDto
  ): Promise<ApiResponse<CheckoutResponse>> => {
    try {
      const res = await apiClient.post<ApiResponse<CheckoutResponse>>(
        "/chargily/checkout",
        checkoutData
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get checkout status by ID
   */
  getCheckoutStatus: async (
    checkoutId: string
  ): Promise<ApiResponse<CheckoutStatus>> => {
    try {
      const res = await apiClient.get<ApiResponse<CheckoutStatus>>(
        `/chargily/checkout/${checkoutId}`
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Initiate payment for a subscription plan
   */
  createSubscriptionCheckout: async (
    planId: string,
    billingCycle?: AppSubscriptionBillingCycle
  ): Promise<ApiResponse<CheckoutResponse>> => {
    try {
      const res = await apiClient.post<ApiResponse<CheckoutResponse>>(
        "/chargily/checkout/subscription",
        {
          planId,
          billingCycle,
        }
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Redirect user to checkout page
   */
  redirectToCheckout: (checkoutUrl: string): void => {
    window.location.href = checkoutUrl;
  },
};
