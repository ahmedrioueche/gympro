import { CheckCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import Dropdown, {
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "../../../../components/ui/Dropdown";
import { NotificationItem } from "./NotificationItem";
import { NotificationTrigger } from "./NotificationTrigger";
import { useNotificationsDropdown } from "./useNotificationsDropdown";

export default function NotificationsDropdown() {
  const { t } = useTranslation();

  const {
    notifications,
    unreadCount,
    handleItemClick,
    handleMarkAllRead,
    handleDropdownOpen,
    handleViewAllClick,
  } = useNotificationsDropdown();

  const hasUnread = unreadCount > 0 && notifications.length > 0;

  return (
    <Dropdown
      trigger={<NotificationTrigger hasUnread={hasUnread} />}
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
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onClick={() => handleItemClick(notification, closeDropdown)}
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
