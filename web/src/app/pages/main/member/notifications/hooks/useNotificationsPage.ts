import { useState } from "react";
import {
  useMarkAllNotificationsAsRead,
  useMyNotifications,
  useUnreadNotificationsCount,
} from "../../../../../../hooks/queries/useNotifications";

const ITEMS_PER_PAGE = 20;

export function useNotificationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useMyNotifications(
    currentPage,
    ITEMS_PER_PAGE,
    filter === "unread" ? "unread" : undefined,
    searchQuery
  );

  const { data: unreadCountData } = useUnreadNotificationsCount();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const notifications = data?.data?.data || [];
  const totalNotifications = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;
  const unreadCount = unreadCountData?.data?.count || 0;

  // Handlers
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

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

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
      getPageNumbers,
    },
    controls: {
      searchQuery,
      filter,
      onSearchChange: handleSearchChange,
      onFilterStatusChange: handleFilterStatusChange,
    },
    actions: {
      markAllAsRead,
      isMarkingAllAsRead: markAllAsReadMutation.isPending,
      isAllRead: unreadCount === 0,
    },
  };
}
