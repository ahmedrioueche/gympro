import { type AppNotification } from "@ahmedrioueche/gympro-client";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  useMarkAllNotificationsAsRead,
  useMyNotifications,
  useUnreadNotificationsCount,
} from "../../../../hooks/queries/useNotifications";
import { useNotificationAction } from "../../../../hooks/useNotificationAction";
import { useGymStore } from "../../../../store/gym";
import { useUserStore } from "../../../../store/user";
import { getRoleBasedPage } from "../../../../utils/roles";

export function useNotificationsDropdown() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { user } = useUserStore();
  const { currentGym } = useGymStore();

  // Determine if we're in gym context
  const isOnGymDashboard = routerState.location.pathname.startsWith("/gym");
  const gymId = isOnGymDashboard ? currentGym?._id : undefined;

  // Data Fetching - pass gymId for gym-specific notifications
  const { data: notificationsData } = useMyNotifications(
    1,
    5,
    undefined,
    undefined,
    gymId,
  );
  const { data: unreadData } = useUnreadNotificationsCount();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const notifications = notificationsData?.data?.data || [];
  const unreadCount = unreadData?.data?.count || 0;

  const { executeAction } = useNotificationAction();

  const handleItemClick = async (
    notification: AppNotification,
    closeDropdown: () => void,
  ) => {
    closeDropdown();

    // Try to execute the action (await to ensure gym switch completes)
    const executed = await executeAction(notification);

    // If no action or action failed, navigate to notifications page
    if (!executed) {
      const notificationsPath = getRoleBasedPage(user.role, "notifications");
      if (routerState.location.pathname !== notificationsPath) {
        navigate({ to: notificationsPath });
      }
    }
  };

  const handleMarkAllRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDropdownOpen = () => {
    // Mark all unread notifications as read when dropdown opens
    if (unreadCount > 0 && notifications.length > 0) {
      markAllAsReadMutation.mutate();
    }
  };

  const handleViewAllClick = (closeDropdown: () => void) => {
    closeDropdown();
    navigate({ to: getRoleBasedPage(user.role, "notifications") });
  };

  return {
    notifications,
    unreadCount,
    handleItemClick,
    handleMarkAllRead,
    handleDropdownOpen,
    handleViewAllClick,
  };
}
