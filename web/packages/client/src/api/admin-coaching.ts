import { ApiResponse } from "../types/api";
import { User } from "../types/user";
import { apiClient, handleApiError } from "./helper";

export const adminCoachingApi = {
  /**
   * Get all pending coach requests
   */
  getCoachRequests: async (): Promise<ApiResponse<User[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<User[]>>(
        "/admin/coach-requests",
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Approve a coach request
   */
  approveCoachRequest: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.post<ApiResponse<void>>(
        `/admin/coach-requests/${userId}/approve`,
        {},
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Reject a coach request
   */
  rejectCoachRequest: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.post<ApiResponse<void>>(
        `/admin/coach-requests/${userId}/reject`,
        {},
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
