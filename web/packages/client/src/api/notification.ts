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
    search?: string
  ) => {
    try {
      const response = await apiClient.get<GetNotificationsResponseDto>(
        "/notifications",
        {
          params: { page, limit, status, search },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get unread count
   */
  getUnreadCount: async () => {
    try {
      const response = await apiClient.get<{ count: number }>(
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
  markAsRead: async (id: string) => {
    try {
      const response = await apiClient.patch<{ success: true }>(
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
  markAllAsRead: async () => {
    try {
      const response = await apiClient.patch<{ success: true }>(
        "/notifications/read-all"
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
