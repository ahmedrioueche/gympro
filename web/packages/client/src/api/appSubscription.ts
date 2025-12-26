import { GetSubscriptionDto } from "../dto/appSubscription";
import { ApiResponse } from "../types/api";
import {
  AppPlan,
  AppSubscriptionBillingCycle,
  BlockerModalConfig,
} from "../types/appSubscription";
import { apiClient, handleApiError } from "./helper";

export const appSubscriptionsApi = {
  getSubscriptionPlans: async (): Promise<ApiResponse<AppPlan[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<AppPlan[]>>(
        "/app-plans/subscription"
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAllPlans: async (): Promise<ApiResponse<AppPlan[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<AppPlan[]>>("/app-plans");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get current user's app subscription
   * NOTE: backend endpoint should return the subscription for the current user
   */
  getMySubscription: async (): Promise<
    ApiResponse<GetSubscriptionDto | null>
  > => {
    try {
      const res = await apiClient.get<ApiResponse<GetSubscriptionDto | null>>(
        "/app-subscriptions/me"
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Schedule a downgrade to a lower-tier plan - takes effect at end of current period
   */
  downgradeSubscription: async (
    planId: string,
    billingCycle?: AppSubscriptionBillingCycle
  ) => {
    try {
      const res = await apiClient.post<ApiResponse<GetSubscriptionDto>>(
        `/app-subscriptions/downgrade`,
        { planId, billingCycle }
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Cancel current subscription - user keeps access until period end
   */
  cancelSubscription: async (reason?: string) => {
    try {
      const res = await apiClient.delete<ApiResponse<GetSubscriptionDto>>(
        `/app-subscriptions/cancel`,
        { data: { reason } }
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  validateCancellationReason: async (reason: string) => {
    try {
      const res = await apiClient.post<ApiResponse<"true" | "false">>(
        `/app-subscriptions/validate-cancel-reason`,
        { reason }
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Reactivate a cancelled subscription
   */
  reactivateSubscription: async () => {
    try {
      const res = await apiClient.post<ApiResponse<GetSubscriptionDto>>(
        `/app-subscriptions/reactivate`
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Cancel pending plan change
   */
  cancelPendingChange: async () => {
    try {
      const res = await apiClient.post<ApiResponse<GetSubscriptionDto>>(
        `/app-subscriptions/cancel-pending-change`
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getBlockConfig: async (): Promise<ApiResponse<BlockerModalConfig>> => {
    try {
      const res = await apiClient.get<ApiResponse<BlockerModalConfig>>(
        "/app-subscriptions/blocker-config"
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
