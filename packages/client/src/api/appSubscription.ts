import { GetSubscriptionDto } from "../dto/appSubscription";
import { ApiResponse } from "../types/api";
import { AppPlan, AppSubscriptionBillingCycle } from "../types/appSubscription";
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
   * Subscribe / upgrade to a plan. Backend should handle creating/updating subscription.
   */
  subscribeToPlan: async (
    planId: string,
    options?: { billingCycle?: AppSubscriptionBillingCycle }
  ) => {
    try {
      const res = await apiClient.post<any>(`/app-subscriptions/subscribe`, {
        planId,
        ...options,
      });
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
