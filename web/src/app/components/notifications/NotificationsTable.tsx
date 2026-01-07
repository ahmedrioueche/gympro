import { type AppNotification } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns";
import { CheckCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Table, type TableColumn } from "../../../components/ui/Table";
import { useMarkNotificationAsRead } from "../../../hooks/queries/useNotifications";

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

  const columns: TableColumn<AppNotification>[] = [
    {
      key: "type",
      header: t("notifications.table.type", "Type"),
      width: "w-16",
      render: (notification) => (
        <span className="text-xl" role="img" aria-label={notification.type}>
          {getIcon(notification.type)}
        </span>
      ),
    },
    {
      key: "content",
      header: t("notifications.table.message", "Content"),
      render: (notification) => (
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
      ),
    },
    {
      key: "date",
      header: t("notifications.table.date", "Date"),
      width: "w-40",
      render: (notification) => (
        <span className="text-sm text-text-secondary whitespace-nowrap">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </span>
      ),
    },
    {
      key: "status",
      header: t("notifications.table.status", "Status"),
      width: "w-32",
      render: (notification) => (
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
      ),
    },
    {
      key: "actions",
      header: t("common.actions", "Actions"),
      width: "w-24",
      align: "right",
      render: (notification) =>
        notification.status === "unread" ? (
          <button
            onClick={(e) => handleMarkAsRead(notification._id, e)}
            className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors"
            title={t("notifications.markAsRead", "Mark as read")}
          >
            <CheckCheck className="w-4 h-4" />
          </button>
        ) : null,
    },
  ];

  const renderMobileCard = (notification: AppNotification) => (
    <div
      className={`p-4 transition-colors duration-200 ${
        notification.status === "unread" ? "bg-primary/5" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span
          className="text-2xl flex-shrink-0"
          role="img"
          aria-label={notification.type}
        >
          {getIcon(notification.type)}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Status Row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <span
              className={`font-semibold text-sm ${
                notification.status === "unread"
                  ? "text-text-primary"
                  : "text-text-secondary"
              }`}
            >
              {notification.title}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${
                notification.status === "unread"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-muted text-text-secondary border-border"
              }`}
            >
              {notification.status === "unread"
                ? t("notifications.unread", "Unread")
                : t("notifications.read", "Read")}
            </span>
          </div>

          {/* Message */}
          <p className="text-sm text-text-secondary mb-2">
            {notification.message}
          </p>

          {/* Date and Action Row */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>
            {notification.status === "unread" && (
              <button
                onClick={(e) => handleMarkAsRead(notification._id, e)}
                className="p-1.5 hover:bg-primary/10 rounded-full text-primary transition-colors"
                title={t("notifications.markAsRead", "Mark as read")}
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Table
      columns={columns}
      data={notifications}
      keyExtractor={(n) => n._id}
      rowClassName={(n) =>
        n.status === "unread"
          ? "bg-primary/5 hover:bg-primary/10"
          : "hover:bg-muted/50"
      }
      renderMobileCard={renderMobileCard}
    />
  );
}

export default NotificationsTable;
