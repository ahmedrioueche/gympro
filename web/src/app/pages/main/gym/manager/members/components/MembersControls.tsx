import { ArrowUpDown, ChevronDown, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import Dropdown from "../../../../../../../components/ui/Dropdown";
import { SearchInput } from "../../../../../../../components/ui/SearchInput";

import {
  ListActionRow,
  ViewModeToggle,
} from "../../../../../../../components/ui/ListViewControls";
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

  return (
    <div className="bg-surface border border-border rounded-xl md:rounded-2xl p-3 md:p-5 w-full max-w-full relative z-0">
      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Search Input */}
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={t("members.searchPlaceholder")}
          className="w-80"
        />

        {/* Filters */}
        <div className="flex items-center gap-3 flex-1">
          {/* Filter Status */}
          <div className="flex gap-2">
            {(["all", "active", "pending", "expired", "banned"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => onFilterChange(status)}
                  className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-300 text-sm ${
                    filterStatus === status
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-background text-text-secondary hover:bg-primary/10 hover:text-primary border border-border"
                  }`}
                >
                  {t(`members.filters.${status}`)}
                </button>
              ),
            )}
          </div>

          {/* Sort */}
          <SortDropdown current={sortBy} onChange={onSortChange} t={t} />
        </div>

        {/* View Toggle - Always visible, far right */}
        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          showText
          className="ml-auto"
        />
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden space-y-3">
        {/* Row 1: Search - Full Width */}
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={t("members.searchPlaceholder")}
          className="w-full"
        />

        {/* Row 2: View Toggles & Filters */}
        <ListActionRow viewMode={viewMode} onViewModeChange={onViewModeChange}>
          {/* Filter Dropdown */}
          <FilterDropdown
            current={filterStatus}
            onChange={onFilterChange}
            t={t}
          />

          {/* Sort Dropdown */}
          <SortDropdown current={sortBy} onChange={onSortChange} t={t} />
        </ListActionRow>
      </div>
    </div>
  );
}

function FilterDropdown({
  current,
  onChange,
  t,
}: {
  current: FilterStatus;
  onChange: (status: FilterStatus) => void;
  t: any;
}) {
  return (
    <Dropdown
      trigger={
        <button
          className={`flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl text-sm transition-all hover:border-primary`}
        >
          <Filter
            className={`w-4 h-4 ${
              current !== "all" ? "text-primary" : "text-text-secondary"
            }`}
          />
          <span className="capitalize font-medium text-text-primary">
            {t(`members.filters.${current}`)}
          </span>
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </button>
      }
      className="!w-48"
    >
      {(close) => (
        <div className="p-1">
          {(["all", "active", "pending", "expired", "banned"] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => {
                  onChange(status);
                  close();
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${
                  current === status
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-secondary hover:bg-muted hover:text-text-primary"
                }`}
              >
                {t(`members.filters.${status}`)}
                {current === status && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ),
          )}
        </div>
      )}
    </Dropdown>
  );
}

function SortDropdown({
  current,
  onChange,
  t,
}: {
  current: SortBy;
  onChange: (sort: SortBy) => void;
  t: any;
}) {
  return (
    <Dropdown
      trigger={
        <button
          className={`flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl text-sm transition-all hover:border-primary`}
        >
          <ArrowUpDown
            className={`w-4 h-4 ${
              current !== "name" ? "text-primary" : "text-text-secondary"
            }`}
          />
          <span className="capitalize font-medium text-text-primary">
            {t(`members.sort.${current}`)}
          </span>
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </button>
      }
      className="!w-48"
    >
      {(close) => (
        <div className="p-1">
          {(["name", "joinDate", "status"] as const).map((sortOption) => (
            <button
              key={sortOption}
              onClick={() => {
                onChange(sortOption);
                close();
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${
                current === sortOption
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text-secondary hover:bg-muted hover:text-text-primary"
              }`}
            >
              {t(`members.sort.${sortOption}`)}
              {current === sortOption && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
