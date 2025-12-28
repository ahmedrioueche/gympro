import { GlobalAnalytics } from "../types/analytics";
import { ApiResponse } from "../types/api";
import { apiClient, handleApiError } from "./helper";

export const analyticsApi = {
  /** Get global business statistics */
  getGlobalStats: async (): Promise<ApiResponse<GlobalAnalytics>> => {
    try {
      const res = await apiClient.get<ApiResponse<GlobalAnalytics>>(
        "/analytics/global"
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
