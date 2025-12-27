import { type AppNotification } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns";
import { CheckCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMarkNotificationAsRead } from "../../../../../../hooks/queries/useNotifications";

interface NotificationsTableProps {
  notifications: AppNotification[];
}

function NotificationsTable({ notifications }: NotificationsTableProps) {
  const { t } = useTranslation();
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate(id);
  };

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

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary w-16">
                {t("notifications.table.type", "Type")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("notifications.table.message", "Content")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary w-40">
                {t("notifications.table.date", "Date")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary w-32">
                {t("notifications.table.status", "Status")}
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-text-primary w-24">
                {t("common.actions", "Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {notifications.map((notification) => (
              <tr
                key={notification._id}
                className={`transition-colors duration-200 ${
                  notification.status === "unread"
                    ? "bg-primary/5 hover:bg-primary/10"
                    : "hover:bg-muted/50"
                }`}
              >
                <td className="px-6 py-4">
                  <span
                    className="text-xl"
                    role="img"
                    aria-label={notification.type}
                  >
                    {getIcon(notification.type)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span
                      className={`font-semibold ${
                        notification.status === "unread"
                          ? "text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {notification.title}
                    </span>
                    <span className="text-sm text-text-secondary mt-0.5">
                      {notification.message}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary whitespace-nowrap">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${
                      notification.status === "unread"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-text-secondary border-border"
                    }`}
                  >
                    {notification.status === "unread"
                      ? t("notifications.unread", "Unread")
                      : t("notifications.read", "Read")}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {notification.status === "unread" && (
                    <button
                      onClick={(e) => handleMarkAsRead(notification._id, e)}
                      className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors tooltip"
                      title={t("notifications.markAsRead", "Mark as read")}
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NotificationsTable;
