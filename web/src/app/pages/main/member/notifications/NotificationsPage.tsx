import { Bell, CheckCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import NoData from "../../../../../components/ui/NoData";
import NotificationsControls from "../../../../components/notifications/NotificationsControls";
import NotificationsTable from "../../../../components/notifications/NotificationsTable";
import PageHeader from "../../../../components/PageHeader";
import { useNotificationsPage } from "./hooks/useNotificationsPage";

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { notifications, isLoading, pagination, controls, actions } =
    useNotificationsPage();

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={t("notifications.pageTitle", "Notifications")}
        subtitle={t(
          "notifications.pageSubtitle",
          "Stay updated with important events",
        )}
        icon={Bell}
        actionButton={{
          label: t("notifications.markAllRead", "Mark all as read"),
          icon: CheckCheck,
          onClick: actions.markAllAsRead,
          loading: actions.isMarkingAllAsRead,
          disabled: actions.isAllRead,
        }}
      />

      {/* Controls */}
      <NotificationsControls
        searchQuery={controls.searchQuery}
        onSearchChange={controls.onSearchChange}
        filterStatus={controls.filter}
        onFilterStatusChange={controls.onFilterStatusChange}
      />

      {/* Content */}
      {isLoading ? (
        <Loading className="py-22" />
      ) : notifications.length === 0 ? (
        <NoData
          emoji="🔕"
          title={t("notifications.empty", "No notifications found")}
          description={t("notifications.emptyDesc", "You're all caught up!")}
        />
      ) : (
        <NotificationsTable
          notifications={notifications}
          pagination={pagination}
        />
      )}
    </div>
  );
}
