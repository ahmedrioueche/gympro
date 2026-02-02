import { type MemberAttendanceRecord } from "@ahmedrioueche/gympro-client";
import { useMemo, useState } from "react";
import { useMyAttendance } from "./useMyAttendance";

export type StatusFilter = "all" | "checked_in" | "denied";
export const ITEMS_PER_PAGE = 20;

export const useAttendanceLogic = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useMyAttendance();

  const allRecords = useMemo(
    () => (data?.data || []) as MemberAttendanceRecord[],
    [data],
  );

  // Filter records
  const filteredRecords = useMemo(() => {
    let records = [...allRecords];

    // Filter by status
    if (filterStatus !== "all") {
      records = records.filter((r) => r.status === filterStatus);
    }

    // Filter by search query (gym name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      records = records.filter((r) =>
        r.gymId?.name?.toLowerCase().includes(query),
      );
    }

    return records;
  }, [allRecords, filterStatus, searchQuery]);

  // Pagination
  const totalRecords = filteredRecords.length;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE) || 1;
  const paginatedRecords = useMemo(
    () =>
      filteredRecords.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [filteredRecords, currentPage],
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterStatusChange = (status: StatusFilter) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Page numbers for pagination
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

  return {
    isLoading,
    paginatedRecords,
    totalRecords,
    totalPages,
    currentPage,
    filterStatus,
    searchQuery,
    handleSearchChange,
    handleFilterStatusChange,
    handlePageChange,
    getPageNumbers,
    startIndex: (currentPage - 1) * ITEMS_PER_PAGE,
    endIndex: Math.min(
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
      totalRecords,
    ),
  };
};
