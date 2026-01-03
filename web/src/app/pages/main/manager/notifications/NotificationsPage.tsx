import { Bell, CheckCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import {
  useMarkAllNotificationsAsRead,
  useMyNotifications,
} from "../../../../../hooks/queries/useNotifications";
import PageHeader from "../../../../components/PageHeader";
import NotificationsControls from "../../../../components/notifications/NotificationsControls";
import NotificationsTable from "../../../../components/notifications/NotificationsTable";

const ITEMS_PER_PAGE = 20;

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useMyNotifications(
    currentPage,
    ITEMS_PER_PAGE,
    filter === "unread" ? "unread" : undefined,
    searchQuery
  );

  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const notifications = data?.data?.data || [];
  const totalNotifications = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;

  // Handle Search
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterStatusChange = (status: "all" | "unread") => {
    setFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalNotifications);

  return (
    <div className="min-h-screen p-3 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
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
            onClick: () => markAllAsReadMutation.mutate(),
            disabled: notifications.length === 0,
          }}
        />

        {/* Controls */}
        <NotificationsControls
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filterStatus={filter}
          onFilterStatusChange={handleFilterStatusChange}
        />

        {/* Content */}
        {isLoading ? (
          <Loading className="py-22" />
        ) : notifications.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔕</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {t("notifications.empty", "No notifications found")}
            </h3>
            <p className="text-text-secondary">
              {t("notifications.emptyDesc", "You're all caught up!")}
            </p>
          </div>
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
                onClick={() => handlePageChange(currentPage - 1)}
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
                    onClick={() => handlePageChange(page)}
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
                onClick={() => handlePageChange(currentPage + 1)}
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
    </div>
  );
}
