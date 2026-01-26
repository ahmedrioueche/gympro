import { type AppNotification } from "@ahmedrioueche/gympro-client";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import Dropdown, {
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "../../../../components/ui/Dropdown";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useMyNotifications,
  useUnreadNotificationsCount,
} from "../../../../hooks/queries/useNotifications";
import { useNotificationAction } from "../../../../hooks/useNotificationAction";
import { useGymStore } from "../../../../store/gym";
import { useUserStore } from "../../../../store/user";
import { getRoleBasedPage } from "../../../../utils/roles";

export default function NotificationsDropdown() {
  const { t, i18n } = useTranslation();
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
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const notifications = notificationsData?.data?.data || [];
  const unreadCount = unreadData?.data?.count || 0;

  // Icons mapping
  const getIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "payment":
        return "💰";
      case "subscription":
        return "🔄";
      case "alert":
        return "⚠️";
      case "reminder":
        return "⏰";
      case "program":
        return "💪";
      default:
        return "📢";
    }
  };

  const { executeAction, hasValidAction } = useNotificationAction();

  const handleItemClick = (
    notification: AppNotification,
    closeDropdown: () => void,
  ) => {
    closeDropdown();

    // Try to execute the action
    const executed = executeAction(notification);

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

  return (
    <Dropdown
      trigger={
        <div className="relative p-2 rounded-lg transition-colors hover:bg-border/50 text-text-secondary cursor-pointer">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-surface animate-pulse" />
          )}
        </div>
      }
      align="right"
      className="w-80 max-w-[calc(100vw-2rem)] right-0"
      onOpen={handleDropdownOpen}
    >
      {(closeDropdown) => (
        <>
          <DropdownHeader className="flex items-center justify-between">
            <span className="font-semibold">{t("notifications.title")}</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-primary hover:text-primary-hover flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                {t("notifications.markAllRead")}
              </button>
            )}
          </DropdownHeader>

          <DropdownDivider />

          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownItem
                  key={notification._id}
                  icon={getIcon(notification.type)}
                  label={notification.title}
                  description={
                    <div className="flex flex-col gap-1">
                      <span>{notification.message}</span>
                      <span className="text-xs text-text-secondary">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale:
                            i18n.language === "fr" ? undefined : undefined,
                        })}
                      </span>
                    </div>
                  }
                  rightContent={
                    notification.status === "unread" && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )
                  }
                  onClick={() => handleItemClick(notification, closeDropdown)}
                  className={
                    notification.status === "unread" ? "bg-primary/5" : ""
                  }
                />
              ))
            ) : (
              <div className="px-4 py-8 text-center text-text-secondary text-sm">
                {t("notifications.empty")}
              </div>
            )}
          </div>

          <DropdownDivider />

          <DropdownItem
            label={t("notifications.viewAll")}
            onClick={() => handleViewAllClick(closeDropdown)}
            className="text-center justify-center font-medium text-primary hover:text-primary-hover py-3"
          />
        </>
      )}
    </Dropdown>
  );
}
