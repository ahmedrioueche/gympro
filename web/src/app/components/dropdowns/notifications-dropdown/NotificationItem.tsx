import { type AppNotification } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import { DropdownItem } from "../../../../components/ui/Dropdown";
import { getNotificationIcon } from "./notificationUtils";

interface NotificationItemProps {
  notification: AppNotification;
  onClick: () => void;
}

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const { i18n } = useTranslation();

  return (
    <DropdownItem
      icon={getNotificationIcon(notification.type)}
      label={notification.title}
      description={
        <div className="flex flex-col gap-1">
          <span>{notification.message}</span>
          <span className="text-xs text-text-secondary">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: i18n.language === "fr" ? undefined : undefined,
            })}
          </span>
        </div>
      }
      rightContent={
        notification.status === "unread" && (
          <div className="w-2 h-2 bg-primary rounded-full" />
        )
      }
      onClick={onClick}
      className={notification.status === "unread" ? "bg-primary/5" : ""}
    />
  );
}
