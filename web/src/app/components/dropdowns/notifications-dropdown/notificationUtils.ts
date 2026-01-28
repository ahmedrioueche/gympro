import { type AppNotification } from "@ahmedrioueche/gympro-client";

/**
 * Get emoji icon for notification type
 */
export function getNotificationIcon(type: AppNotification["type"]): string {
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
}
