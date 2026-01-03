import { ApiResponse } from "../types/api";
import { GetNotificationsResponseDto } from "../types/notification";
import { apiClient, handleApiError } from "./helper";

export const notificationsApi = {
  /**
   * Get user's notifications
   */
  getMyNotifications: async (
    page = 1,
    limit = 20,
    status?: string,
    search?: string,
    gymId?: string
  ): Promise<ApiResponse<GetNotificationsResponseDto>> => {
    try {
      const response = await apiClient.get<
        ApiResponse<GetNotificationsResponseDto>
      >("/notifications", {
        params: { page, limit, status, search, gymId },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get unread count
   */
  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    try {
      const response = await apiClient.get<ApiResponse<{ count: number }>>(
        "/notifications/unread-count"
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (id: string): Promise<ApiResponse<{ success: true }>> => {
    try {
      const response = await apiClient.patch<ApiResponse<{ success: true }>>(
        `/notifications/${id}/read`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Mark all as read
   */
  markAllAsRead: async (): Promise<ApiResponse<{ success: true }>> => {
    try {
      const response = await apiClient.patch<ApiResponse<{ success: true }>>(
        "/notifications/read-all"
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
