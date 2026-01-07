import { Logs } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { SearchFilterBar } from "../../../../../../components/ui/SearchFilterBar";
import PageHeader from "../../../../../components/PageHeader";
import { ScanResultModal } from "../../../../../components/ScanResultModal";
import { AttendanceTable } from "./components/AttendanceTable";
import {
  type StatusFilter,
  useAttendanceLogs,
} from "./hooks/useAttendanceLogs";
import { useRealTimeAttendance } from "./hooks/useRealTimeAttendance";

const AttendancePage: React.FC = () => {
  const { t } = useTranslation();

  // Real-time access monitoring
  const { lastResult, clearResult } = useRealTimeAttendance();

  // Data and Filtering
  const {
    logs,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  } = useAttendanceLogs();

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title={t("access.logs.title", "Attendance Logs")}
        subtitle={t("access.logs.subtitle", "Monitor access and entry history")}
        icon={Logs}
      />

      <ScanResultModal result={lastResult} onClose={clearResult} />

      <div className="mt-8 space-y-6">
        {/* Controls */}
        <SearchFilterBar<StatusFilter>
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={t(
            "access.logs.search_placeholder",
            "Search logs..."
          )}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={[
            { value: "all", label: t("access.logs.filter_all", "All Events") },
            {
              value: "granted",
              label: t("access.logs.filter_granted", "Access Granted"),
            },
            {
              value: "denied",
              label: t("access.logs.filter_denied", "Access Denied"),
            },
          ]}
        />

        {/* Table */}
        <AttendanceTable logs={logs} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AttendancePage;
