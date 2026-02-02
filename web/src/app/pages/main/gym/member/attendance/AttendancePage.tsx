import { History } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../../../../store/gym";
import PageHeader from "../../../../../components/PageHeader";
import { AttendanceFilters } from "./components/AttendanceFilters";
import { AttendanceTable } from "./components/AttendanceTable";
import { useAttendance } from "./hooks/useAttendance";

const AttendancePage: React.FC = () => {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();

  const {
    logs,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  } = useAttendance(currentGym?._id);

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title={t("gymMember.attendance.title")}
        subtitle={t("gymMember.attendance.subtitle")}
        icon={History}
      />

      <div className="mt-8 space-y-6">
        <AttendanceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <AttendanceTable logs={logs} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AttendancePage;
