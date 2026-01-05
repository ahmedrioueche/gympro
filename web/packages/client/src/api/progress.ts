import { ApiResponse } from "../types/api";
import { ProgressHistory, ProgressStats } from "../types/progress";
import { apiClient, handleApiError } from "./helper";

export const progressApi = {
  getStats: async (): Promise<ApiResponse<ProgressStats>> => {
    try {
      const res = await apiClient.get<ApiResponse<ProgressStats>>(
        "/progress/stats"
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getHistory: async (): Promise<ApiResponse<ProgressHistory[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<ProgressHistory[]>>(
        "/progress/history"
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
