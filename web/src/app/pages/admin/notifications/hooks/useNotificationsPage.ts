import { useState } from "react";
import {
  useMarkAllNotificationsAsRead,
  useMyNotifications,
  useUnreadNotificationsCount,
} from "../../../../../hooks/queries/useNotifications";

const ITEMS_PER_PAGE = 20;

export function useNotificationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useMyNotifications(
    currentPage,
    ITEMS_PER_PAGE,
    filter === "unread" ? "unread" : undefined,
    searchQuery,
    undefined, // No gymId for global admin notifications
  );

  const { data: unreadCountData } = useUnreadNotificationsCount(
    undefined, // No gymId for global admin notifications
  );
  const markAllAsReadMutation = useMarkAllNotificationsAsRead(undefined);

  const notifications = data?.data?.data || [];
  const totalNotifications = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;
  const unreadCount = unreadCountData?.data?.count || 0;

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

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalNotifications);

  return {
    notifications,
    isLoading,
    unreadCount,
    pagination: {
      currentPage,
      totalPages,
      totalNotifications,
      startIndex,
      endIndex,
      onPageChange: handlePageChange,
    },
    controls: {
      searchQuery,
      filter,
      onSearchChange: handleSearchChange,
      onFilterStatusChange: handleFilterStatusChange,
    },
    actions: {
      markAllAsRead: markAllAsReadMutation.mutate,
      isMarkingAllRead: markAllAsReadMutation.isPending,
      isAllRead: unreadCount === 0,
    },
  };
}
