import { Bell, CheckCheck, ChevronLeft, ChevronRight } from "lucide-react";
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

  const {
    currentPage,
    totalPages,
    totalNotifications,
    startIndex,
    endIndex,
    onPageChange,
    getPageNumbers,
  } = pagination;

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={t("notifications.pageTitle", "Notifications")}
        subtitle={t(
          "notifications.pageSubtitle",
          "Stay updated with important events"
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
        <NotificationsTable notifications={notifications} />
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <p className="text-sm text-text-secondary">
            {t("common.pagination.showing", {
              start: startIndex + 1,
              end: endIndex,
              total: totalNotifications,
              defaultValue: `Showing ${
                startIndex + 1
              }-${endIndex} of ${totalNotifications}`,
            })}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border bg-surface text-text-primary hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((page, index) =>
              typeof page === "string" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-text-secondary"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`min-w-[36px] h-9 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? "bg-primary text-white shadow-md"
                      : "border border-border bg-surface text-text-primary hover:bg-surface-hover"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border bg-surface text-text-primary hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
