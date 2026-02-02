import React from "react";
import { useTranslation } from "react-i18next";
import { SearchFilterBar } from "../../../../../../../components/ui/SearchFilterBar";
import { type StatusFilter } from "../hooks/useAttendance";

interface AttendanceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
}

export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const { t } = useTranslation();

  return (
    <SearchFilterBar<StatusFilter>
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={t("gymMember.attendance.search") as string}
      filterValue={statusFilter}
      onFilterChange={onStatusFilterChange}
      filterOptions={[
        { value: "all", label: t("gymMember.attendance.filter.all") as string },
        {
          value: "granted",
          label: t("gymMember.attendance.filter.granted") as string,
        },
        {
          value: "denied",
          label: t("gymMember.attendance.filter.denied") as string,
        },
      ]}
    />
  );
};
