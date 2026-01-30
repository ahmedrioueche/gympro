import { ApiResponse, PaginatedResponse } from "../types/api";
import { GymCoachPayment, GymCoachStats } from "../types/gym-coach-payment";
import { getApiClient } from "./config";

export const gymCoachPaymentApi = {
  getMyPayments: async (
    gymId?: string,
    page = 1,
    limit = 20,
    status?: string,
  ): Promise<ApiResponse<PaginatedResponse<GymCoachPayment>>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (gymId) params.append("gymId", gymId);
      if (status) params.append("status", status);

      const response = await getApiClient().get(
        `/gym-coach-payments/my-payments?${params.toString()}`,
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "PAYMENT_FETCH_FAILED",
        message: error.response?.data?.message || "Failed to fetch payments",
      };
    }
  },

  getMyStats: async (gymId?: string): Promise<ApiResponse<GymCoachStats>> => {
    try {
      const url = gymId
        ? `/gym-coach-payments/my-stats?gymId=${gymId}`
        : `/gym-coach-payments/my-stats`;

      const response = await getApiClient().get(url);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "STATS_FETCH_FAILED",
        message: error.response?.data?.message || "Failed to fetch stats",
      };
    }
  },
};
