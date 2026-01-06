import { useState } from "react";
import {
  useMarkAllNotificationsAsRead,
  useMyNotifications,
} from "../../../../../../../hooks/queries/useNotifications";
import { useGymStore } from "../../../../../../../store/gym";

const ITEMS_PER_PAGE = 20;

export function useNotificationsPage() {
  const { currentGym } = useGymStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useMyNotifications(
    currentPage,
    ITEMS_PER_PAGE,
    filter === "unread" ? "unread" : undefined,
    searchQuery,
    currentGym?._id
  );

  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const notifications = data?.data?.data || [];
  const totalNotifications = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;

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
    totalNotifications,
    totalPages,
    currentPage,
    filter,
    searchQuery,
    isLoading,
    markAllAsReadMutation,
    handleSearchChange,
    handleFilterStatusChange,
    handlePageChange,
    startIndex,
    endIndex,
    currentGym,
  };
}
