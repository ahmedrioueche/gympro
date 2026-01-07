import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import PageHeader from "../../../../components/PageHeader";
import { AttendanceControls } from "./components/AttendanceControls";
import { AttendanceTable } from "./components/AttendanceTable";
import { useMyAttendance } from "./hooks/useMyAttendance";

const ITEMS_PER_PAGE = 20;

function AttendancePage() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "checked_in" | "denied"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useMyAttendance();

  const allRecords = data?.data || [];

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
        r.gymId?.name?.toLowerCase().includes(query)
      );
    }

    return records;
  }, [allRecords, filterStatus, searchQuery]);

  // Pagination
  const totalRecords = filteredRecords.length;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterStatusChange = (
    status: "all" | "checked_in" | "denied"
  ) => {
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

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalRecords);

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={t("attendance.title", "Attendance History")}
        subtitle={t("attendance.subtitle", "View your gym check-in records")}
        icon={Calendar}
      />

      {/* Controls */}
      <AttendanceControls
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filterStatus={filterStatus}
        onFilterStatusChange={handleFilterStatusChange}
      />

      {/* Content */}
      {isLoading ? (
        <Loading className="py-22" />
      ) : paginatedRecords.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {t("attendance.empty", "No attendance records")}
          </h3>
          <p className="text-text-secondary">
            {t(
              "attendance.emptyDesc",
              "Your check-in history will appear here once you visit a gym."
            )}
          </p>
        </div>
      ) : (
        <AttendanceTable records={paginatedRecords} />
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <p className="text-sm text-text-secondary">
            {t("common.pagination.showing", {
              start: startIndex + 1,
              end: endIndex,
              total: totalRecords,
              defaultValue: `Showing ${
                startIndex + 1
              }-${endIndex} of ${totalRecords}`,
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
  );
}

export default AttendancePage;
