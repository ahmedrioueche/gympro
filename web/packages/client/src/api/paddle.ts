import {
  CreatePaddleCheckoutDto,
  PaddleCheckoutResponse,
  PaddleTransactionStatus,
} from "../dto/paddle";
import { ApiResponse } from "../types/api";
import { AppSubscriptionBillingCycle } from "../types/appSubscription";
import { apiClient, handleApiError } from "./helper";

export const paddleCheckoutApi = {
  /**
   * Create a new checkout session
   */
  createCheckout: async (
    checkoutData: CreatePaddleCheckoutDto
  ): Promise<ApiResponse<PaddleCheckoutResponse>> => {
    try {
      const res = await apiClient.post<ApiResponse<PaddleCheckoutResponse>>(
        "/paddle/checkout",
        checkoutData
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get transaction status by ID
   */
  getTransactionStatus: async (
    transactionId: string
  ): Promise<ApiResponse<PaddleTransactionStatus>> => {
    try {
      const res = await apiClient.get<ApiResponse<PaddleTransactionStatus>>(
        `/paddle/transaction/${transactionId}`
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
  ): Promise<ApiResponse<PaddleCheckoutResponse>> => {
    try {
      const res = await apiClient.post<ApiResponse<PaddleCheckoutResponse>>(
        "/paddle/checkout/subscription",
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
