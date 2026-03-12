import { useTranslation } from "react-i18next";
import { ViewModeToggle } from "../../../../../../../components/ui/ListViewControls";
import SearchFilterBar from "../../../../../../../components/ui/SearchFilterBar";
import type { ViewMode } from "../../../../../../../types/common";

export type FilterStatus = "all" | "active" | "pending" | "expired" | "banned";
export type SortBy = "name" | "joinDate" | "status";

interface MembersControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function MembersControls({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: MembersControlsProps) {
  const { t } = useTranslation();

  const filterOptions = [
    { value: "all", label: t("members.filters.all") },
    { value: "active", label: t("members.filters.active") },
    { value: "pending", label: t("members.filters.pending") },
    { value: "expired", label: t("members.filters.expired") },
    { value: "banned", label: t("members.filters.banned") },
  ];

  const sortOptions = [
    { value: "name", label: t("members.sort.name") },
    { value: "joinDate", label: t("members.sort.joinDate") },
    { value: "status", label: t("members.sort.status") },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
      <div className="flex-1 min-w-0">
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          searchPlaceholder={t("members.searchPlaceholder")}
          filters={[
            {
              value: filterStatus,
              onChange: (v) => onFilterChange(v as FilterStatus),
              options: filterOptions,
              label: t("members.filters.status"),
            },
            {
              value: sortBy,
              onChange: (v) => onSortChange(v as SortBy),
              options: sortOptions,
              label: t("members.sort.title"),
            },
          ]}
        />
      </div>

      <div className="hidden md:flex bg-surface border border-border h-22 rounded-xl md:rounded-2xl p-2 md:p-3 items-center justify-center shadow-sm">
        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          showText
        />
      </div>
    </div>
  );
}
