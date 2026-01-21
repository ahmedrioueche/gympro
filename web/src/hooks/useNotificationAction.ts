import type { AppNotification } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../store/modal";
import { useMarkNotificationAsRead } from "./queries/useNotifications";

/**
 * Hook for executing notification actions.
 * Handles modal opening, navigation, expiration checking, and marking as read.
 */
export function useNotificationAction() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const markAsRead = useMarkNotificationAsRead();

  /**
   * Execute the action associated with a notification.
   * @param notification The notification to execute action for
   * @returns true if action was executed, false if no action or expired
   */
  const executeAction = (notification: AppNotification): boolean => {
    const { action } = notification;

    // Mark as read if unread
    if (notification.status === "unread") {
      markAsRead.mutate(notification._id);
    }

    // No action defined
    if (!action) {
      return false;
    }

    // Check if action has expired
    if (action.expiresAt) {
      const expirationDate = new Date(action.expiresAt);
      if (expirationDate < new Date()) {
        toast.error(
          t("notifications.actionExpired", "This action has expired")
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
      navigate({ to: action.payload });
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
