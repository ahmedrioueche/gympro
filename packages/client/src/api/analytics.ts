import { GlobalAnalytics, GymAnalytics } from "../types/analytics";
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

  /** Get statistics for a specific gym */
  getGymStats: async (gymId: string): Promise<ApiResponse<GymAnalytics>> => {
    try {
      const res = await apiClient.get<ApiResponse<GymAnalytics>>(
        `/analytics/${gymId}`
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
