import { gymApi, type AppNotification } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../constants/navigation";
import { useGymStore } from "../store/gym";
import { useModalStore } from "../store/modal";
import { useUserStore } from "../store/user";
import { useMarkNotificationAsRead } from "./queries/useNotifications";

/**
 * Hook for executing notification actions.
 * Handles modal opening, navigation, expiration checking, and marking as read.
 */
export function useNotificationAction() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentGym, setGym } = useGymStore();
  const { activeDashboard } = useUserStore();
  const { openModal } = useModalStore();
  const markAsRead = useMarkNotificationAsRead();

  /**
   * Execute the action associated with a notification.
   * @param notification The notification to execute action for
   * @returns true if action was executed, false if no action or expired
   */
  const executeAction = async (
    notification: AppNotification,
  ): Promise<boolean> => {
    const { action } = notification;

    // Mark as read if unread
    if (notification.status === "unread") {
      markAsRead.mutate(notification._id);
    }

    // Ensure correct gym context if notification is gym-related
    if (notification.gymId && currentGym?._id !== notification.gymId) {
      try {
        const response = await gymApi.findOne(notification.gymId);
        if (response.success && response.data) {
          setGym(response.data);
        }
      } catch (error) {
        console.error("Failed to switch gym context", error);
        toast.error(t("errors.switchGymFailed", "Failed to switch gym"));
        return false;
      }
    }

    // No action defined
    if (!action) {
      if (notification.gymId) {
        // Navigate to dashboard-aware path based on activeDashboard
        let announcementsPath = APP_PAGES.gym.member.announcements.link;
        let notificationsPath = APP_PAGES.gym.member.notifications.link;

        if (activeDashboard === "coach") {
          announcementsPath = APP_PAGES.gym.coach.announcements.link;
          notificationsPath = APP_PAGES.gym.coach.notifications.link;
        } else if (activeDashboard === "manager") {
          announcementsPath = APP_PAGES.gym.manager.announcements.link;
          notificationsPath = APP_PAGES.gym.manager.notifications.link;
        }

        if (notification.type === "announcement") {
          navigate({ to: announcementsPath });
        } else {
          navigate({ to: notificationsPath });
        }
        return true;
      }
      return false;
    }

    // Check if action has expired
    if (action.expiresAt) {
      const expirationDate = new Date(action.expiresAt);
      if (expirationDate < new Date()) {
        toast.error(
          t("notifications.actionExpired", "This action has expired"),
        );
        return false;
      }
    }

    // Execute based on action type
    if (action.type === "modal") {
      openModal(action.payload as any, action.data);
      return true;
    }

    if (action.type === "link") {
      let targetPath = action.payload;

      // Transform hardcoded /gym/member/* paths to current dashboard
      if (notification.gymId && targetPath.startsWith("/gym/member/")) {
        const subPath = targetPath.replace("/gym/member/", "");
        if (activeDashboard === "coach") {
          targetPath = `/gym/coach/${subPath}`;
        } else if (activeDashboard === "manager") {
          targetPath = `/gym/manager/${subPath}`;
        }
      }

      navigate({ to: targetPath });
      return true;
    }

    return false;
  };

  /**
   * Check if a notification has an actionable (non-expired) action.
   */
  const hasValidAction = (notification: AppNotification): boolean => {
    const { action } = notification;
    if (!action) return false;

    if (action.expiresAt) {
      const expirationDate = new Date(action.expiresAt);
      if (expirationDate < new Date()) return false;
    }

    return true;
  };

  return { executeAction, hasValidAction };
}
