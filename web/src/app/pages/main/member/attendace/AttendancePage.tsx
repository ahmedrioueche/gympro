import { type MemberAttendanceRecord } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchFilterBar } from "../../../../../components/ui/SearchFilterBar";
import { Table, type TableColumn } from "../../../../../components/ui/Table";
import PageHeader from "../../../../components/PageHeader";
import { useMyAttendance } from "./hooks/useMyAttendance";

type StatusFilter = "all" | "checked_in" | "denied";

const ITEMS_PER_PAGE = 20;

function AttendancePage() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useMyAttendance();

  const allRecords = (data?.data || []) as MemberAttendanceRecord[];

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

  const getStatusIcon = (status: MemberAttendanceRecord["status"]) => {
    switch (status) {
      case "checked_in":
        return "✅";
      case "checked_out":
        return "🚪";
      case "denied":
        return "❌";
      case "missed":
        return "⏰";
      default:
        return "📋";
    }
  };

  const getStatusStyle = (status: MemberAttendanceRecord["status"]) => {
    switch (status) {
      case "checked_in":
        return "bg-success/10 text-success border-success/20";
      case "checked_out":
        return "bg-primary/10 text-primary border-primary/20";
      case "denied":
        return "bg-danger/10 text-danger border-danger/20";
      case "missed":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-text-secondary border-border";
    }
  };

  const columns: TableColumn<MemberAttendanceRecord>[] = [
    {
      key: "status",
      header: t("attendance.table.status", "Status"),
      render: (record) => (
        <span className="text-xl" role="img" aria-label={record.status}>
          {getStatusIcon(record.status)}
        </span>
      ),
      renderSkeleton: () => <div className="h-6 bg-muted rounded w-8" />,
    },
    {
      key: "gym",
      header: t("attendance.table.gym", "Gym"),
      render: (record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-text-primary">
            {record.gymId?.name || t("common.unknown", "Unknown Gym")}
          </span>
          {record.gymId?.location?.city && (
            <span className="text-sm text-text-secondary mt-0.5">
              {record.gymId.location.city}
            </span>
          )}
        </div>
      ),
      renderSkeleton: () => (
        <div className="space-y-1">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-3 bg-muted rounded w-20" />
        </div>
      ),
    },
    {
      key: "date",
      header: t("attendance.table.date", "Date & Time"),
      render: (record) => (
        <div className="flex flex-col">
          <span className="text-sm text-text-primary">
            {new Date(record.checkIn).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-xs text-text-secondary">
            {formatDistanceToNow(new Date(record.checkIn), {
              addSuffix: true,
            })}
          </span>
        </div>
      ),
      renderSkeleton: () => (
        <div className="space-y-1">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-16" />
        </div>
      ),
    },
    {
      key: "badge",
      header: t("attendance.table.badge", "Badge"),
      render: (record) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${getStatusStyle(
            record.status
          )}`}
        >
          {t(`attendance.status.${record.status}`, record.status)}
        </span>
      ),
      renderSkeleton: () => <div className="h-6 bg-muted rounded-full w-20" />,
    },
  ];

  const renderMobileCard = (record: MemberAttendanceRecord) => (
    <div className="p-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span
          className="text-2xl flex-shrink-0"
          role="img"
          aria-label={record.status}
        >
          {getStatusIcon(record.status)}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Gym Name and Status Row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="font-semibold text-sm text-text-primary">
              {record.gymId?.name || t("common.unknown", "Unknown Gym")}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${getStatusStyle(
                record.status
              )}`}
            >
              {t(`attendance.status.${record.status}`, record.status)}
            </span>
          </div>

          {/* Location */}
          {record.gymId?.location?.city && (
            <p className="text-sm text-text-secondary mb-2">
              {record.gymId.location.city}
            </p>
          )}

          {/* Date */}
          <span className="text-xs text-text-secondary">
            {new Date(record.checkIn).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            •{" "}
            {formatDistanceToNow(new Date(record.checkIn), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );

  const renderMobileLoadingSkeleton = () => (
    <div className="p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-muted rounded" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-3 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-40" />
        </div>
      </div>
    </div>
  );

  const emptyState = (
    <div className="p-12 text-center">
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
  );

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
      <SearchFilterBar<StatusFilter>
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder={t("attendance.search", "Search by gym name...")}
        filterValue={filterStatus}
        onFilterChange={handleFilterStatusChange}
        filterOptions={[
          { value: "all", label: t("attendance.filter.all", "All") },
          {
            value: "checked_in",
            label: t("attendance.filter.checked_in", "Checked In"),
          },
          { value: "denied", label: t("attendance.filter.denied", "Denied") },
        ]}
      />

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedRecords}
        keyExtractor={(record) => record._id || ""}
        isLoading={isLoading}
        skeletonRowCount={6}
        emptyState={emptyState}
        rowClassName={() => "transition-colors duration-200 hover:bg-muted/50"}
        renderMobileCard={renderMobileCard}
        renderMobileLoadingSkeleton={renderMobileLoadingSkeleton}
        wrapperClassName="bg-surface border border-border rounded-2xl overflow-hidden"
        headerClassName="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border"
      />

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
