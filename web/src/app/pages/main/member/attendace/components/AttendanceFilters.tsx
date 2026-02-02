import { useTranslation } from "react-i18next";
import { SearchFilterBar } from "../../../../../../components/ui/SearchFilterBar";
import { type StatusFilter } from "../hooks/useAttendanceLogic";

interface AttendanceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: StatusFilter;
  onFilterChange: (status: StatusFilter) => void;
}

export function AttendanceFilters({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
}: AttendanceFiltersProps) {
  const { t } = useTranslation();

  return (
    <SearchFilterBar<StatusFilter>
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={
        t("attendance.search", "Search by gym name...") as string
      }
      filterValue={filterStatus}
      onFilterChange={onFilterChange}
      filterOptions={[
        { value: "all", label: t("attendance.filter.all", "All") as string },
        {
          value: "checked_in",
          label: t("attendance.filter.checked_in", "Checked In") as string,
        },
        {
          value: "denied",
          label: t("attendance.filter.denied", "Denied") as string,
        },
      ]}
    />
  );
}
