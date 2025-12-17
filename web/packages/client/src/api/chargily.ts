import {
  ChargilyCheckoutResponse,
  ChargilyCheckoutStatus,
  CreateChargilyCheckoutDto,
} from "../dto/chargily";
import { ApiResponse } from "../types/api";
import { AppSubscriptionBillingCycle } from "../types/appSubscription";
import { apiClient, handleApiError } from "./helper";

export const chargilyCheckoutApi = {
  /**
   * Create a new checkout session
   */
  createCheckout: async (
    checkoutData: CreateChargilyCheckoutDto
  ): Promise<ApiResponse<ChargilyCheckoutResponse>> => {
    try {
      const res = await apiClient.post<ApiResponse<ChargilyCheckoutResponse>>(
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
  ): Promise<ApiResponse<ChargilyCheckoutStatus>> => {
    try {
      const res = await apiClient.get<ApiResponse<ChargilyCheckoutStatus>>(
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
  ): Promise<ApiResponse<ChargilyCheckoutResponse>> => {
    try {
      const res = await apiClient.post<ApiResponse<ChargilyCheckoutResponse>>(
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
