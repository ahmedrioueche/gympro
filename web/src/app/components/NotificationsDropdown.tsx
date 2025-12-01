import { useTranslation } from "react-i18next";
import Dropdown, {
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "../../components/ui/Dropdown";

interface Notification {
  id: string;
  icon: string;
  label: string;
  description: string;
  isRead?: boolean;
}

interface NotificationsDropdownProps {
  notifications?: Notification[];
  unreadCount?: number;
  onNotificationClick?: (notificationId: string) => void;
  onViewAllClick?: () => void;
}

export default function NotificationsDropdown({
  notifications = [],
  unreadCount = 0,
  onNotificationClick,
  onViewAllClick,
}: NotificationsDropdownProps) {
  const { t } = useTranslation();

  // Default notifications for demo
  const defaultNotifications: Notification[] = [
    {
      id: "1",
      icon: "👤",
      label: t("notifications.demo.memberJoined.label"),
      description: t("notifications.demo.memberJoined.description"),
      isRead: false,
    },
    {
      id: "2",
      icon: "💰",
      label: t("notifications.demo.paymentReceived.label"),
      description: t("notifications.demo.paymentReceived.description"),
      isRead: false,
    },
    {
      id: "3",
      icon: "⚠️",
      label: t("notifications.demo.membershipExpiring.label"),
      description: t("notifications.demo.membershipExpiring.description"),
      isRead: true,
    },
  ];

  const displayNotifications =
    notifications.length > 0 ? notifications : defaultNotifications;
  const displayUnreadCount =
    unreadCount > 0
      ? unreadCount
      : displayNotifications.filter((n) => !n.isRead).length;

  return (
    <Dropdown
      trigger={
        <div className="relative p-2 rounded-lg transition-colors hover:bg-border/50 text-text-secondary">
          <span>🔔</span>
          {displayUnreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full animate-pulse" />
          )}
        </div>
      }
      align="right"
    >
      <DropdownHeader>
        {t("notifications.title")}
        {displayUnreadCount > 0 && (
          <span className="ml-2 text-danger">
            ({displayUnreadCount} {t("notifications.new")})
          </span>
        )}
      </DropdownHeader>

      {displayNotifications.length > 0 ? (
        <>
          {displayNotifications.map((notification) => (
            <DropdownItem
              key={notification.id}
              icon={notification.icon}
              label={notification.label}
              description={notification.description}
              onClick={() => onNotificationClick?.(notification.id)}
            />
          ))}

          <DropdownDivider />

          <DropdownItem
            label={t("notifications.viewAll")}
            onClick={onViewAllClick}
          />
        </>
      ) : (
        <div className="px-4 py-8 text-center text-text-secondary text-sm">
          {t("notifications.empty")}
        </div>
      )}
    </Dropdown>
  );
}
