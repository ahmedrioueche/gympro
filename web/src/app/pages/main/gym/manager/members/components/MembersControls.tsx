import { ArrowUpDown, ChevronDown, Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchInput } from "../../../../../../../components/ui/SearchInput";

type ViewMode = "cards" | "table";
type FilterStatus = "all" | "active" | "pending" | "expired" | "banned";
type SortBy = "name" | "joinDate" | "status";

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
              )
            )}
          </div>

          {/* Sort */}
          <SortDropdown current={sortBy} onChange={onSortChange} t={t} />
        </div>

        {/* View Toggle - Always visible, far right */}
        <div className="flex gap-1.5 bg-background border border-border rounded-xl p-1 flex-shrink-0 ml-auto">
          <button
            onClick={() => onViewModeChange("cards")}
            className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1.5 text-sm ${
              viewMode === "cards"
                ? "bg-primary text-white shadow-md"
                : "text-text-secondary hover:text-primary"
            }`}
          >
            <span>📇</span>
            <span>{t("members.viewMode.cards")}</span>
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1.5 text-sm ${
              viewMode === "table"
                ? "bg-primary text-white shadow-md"
                : "text-text-secondary hover:text-primary"
            }`}
          >
            <span>📊</span>
            <span>{t("members.viewMode.table")}</span>
          </button>
        </div>
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
        <div className="flex items-center justify-between gap-2">
          {/* View Toggles (Left) */}
          <div className="flex gap-1 bg-background border border-border rounded-xl p-1 flex-shrink-0">
            <button
              onClick={() => onViewModeChange("cards")}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center text-sm ${
                viewMode === "cards"
                  ? "bg-primary text-white shadow-md"
                  : "text-text-secondary hover:text-primary"
              }`}
            >
              <span className="text-lg">📇</span>
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center text-sm ${
                viewMode === "table"
                  ? "bg-primary text-white shadow-md"
                  : "text-text-secondary hover:text-primary"
              }`}
            >
              <span className="text-lg">📊</span>
            </button>
          </div>

          {/* Filters & Sort (Right) */}
          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <div className="relative">
              <FilterDropdown
                current={filterStatus}
                onChange={onFilterChange}
                t={t}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <SortDropdown current={sortBy} onChange={onSortChange} t={t} />
            </div>
          </div>
        </div>
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
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl text-sm transition-all ${
          isOpen
            ? "border-primary ring-1 ring-primary/20"
            : "hover:border-primary"
        }`}
      >
        <Filter
          className={`w-4 h-4 ${
            current !== "all" ? "text-primary" : "text-text-secondary"
          }`}
        />
        <span className="capitalize font-medium text-text-primary">
          {t(`members.filters.${current}`)}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-1">
            {(["all", "active", "pending", "expired", "banned"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => {
                    onChange(status);
                    setIsOpen(false);
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
              )
            )}
          </div>
        </div>
      )}
    </div>
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
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl text-sm transition-all ${
          isOpen
            ? "border-primary ring-1 ring-primary/20"
            : "hover:border-primary"
        }`}
      >
        <ArrowUpDown
          className={`w-4 h-4 ${
            current !== "name" ? "text-primary" : "text-text-secondary"
          }`}
        />
        <span className="capitalize font-medium text-text-primary">
          {t(`members.sort.${current}`)}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-1">
            {(["name", "joinDate", "status"] as const).map((sortOption) => (
              <button
                key={sortOption}
                onClick={() => {
                  onChange(sortOption);
                  setIsOpen(false);
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
        </div>
      )}
    </div>
  );
}

export type { FilterStatus, SortBy, ViewMode };
