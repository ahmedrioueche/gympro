import {
  type ApiResponse,
  type GetNotificationsResponseDto,
  notificationsApi,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (page: number, limit: number, status?: string, search?: string) =>
    [...notificationKeys.lists(), { page, limit, status, search }] as const,
  unreadCount: () => [...notificationKeys.all, "unread"] as const,
};

/**
 * Hook to fetch notifications
 */
export function useMyNotifications(
  page = 1,
  limit = 20,
  status?: string,
  search?: string,
  options: any = {}
) {
  return useQuery<ApiResponse<GetNotificationsResponseDto>, Error>({
    queryKey: notificationKeys.list(page, limit, status, search),
    queryFn: () =>
      notificationsApi.getMyNotifications(page, limit, status, search),
    staleTime: 1000 * 30, // 30 seconds
    ...options,
  });
}

/**
 * Hook to fetch unread count
 */
export function useUnreadNotificationsCount() {
  return useQuery<ApiResponse<{ count: number }>, Error>({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationsApi.getUnreadCount(),
    // Poll every minute
    refetchInterval: 1000 * 60,
  });
}

/**
 * Hook to mark notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
