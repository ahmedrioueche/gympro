import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../../../components/PageHeader";
import { AttendanceFilters } from "./components/AttendanceFilters";
import { AttendancePagination } from "./components/AttendancePagination";
import { AttendanceTable } from "./components/AttendanceTable";
import { useAttendanceLogic } from "./hooks/useAttendanceLogic";

function AttendancePage() {
  const { t } = useTranslation();
  const {
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
    startIndex,
    endIndex,
  } = useAttendanceLogic();

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={t("attendance.title", "Attendance History")}
        subtitle={t("attendance.subtitle", "View your gym check-in records")}
        icon={Calendar}
      />

      <AttendanceFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filterStatus={filterStatus}
        onFilterChange={handleFilterStatusChange}
      />

      <AttendanceTable records={paginatedRecords} isLoading={isLoading} />

      <AttendancePagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        getPageNumbers={getPageNumbers}
      />
    </div>
  );
}

export default AttendancePage;
