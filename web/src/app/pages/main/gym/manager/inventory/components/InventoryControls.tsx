import {
  EQUIPMENT_CATEGORIES,
  type EquipmentCategory,
} from "@ahmedrioueche/gympro-client";
import { ArrowUpDown, ChevronDown, Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchInput } from "../../../../../../../components/ui/SearchInput";

export type ViewMode = "cards" | "table";
export type SortBy = "name" | "quantity" | "condition" | "createdAt";

interface InventoryControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: EquipmentCategory | "all";
  onCategoryChange: (category: EquipmentCategory | "all") => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function InventoryControls({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: InventoryControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-xl md:rounded-2xl p-3 md:p-5 w-full max-w-full relative z-0">
      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Search Input */}
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={t("inventory.searchPlaceholder", {
            defaultValue: "Search equipment...",
          })}
          className="w-80"
        />

        {/* Filters and Sort */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <CategoryDropdown
            current={selectedCategory}
            onChange={onCategoryChange}
            t={t}
          />
          <SortDropdown current={sortBy} onChange={onSortChange} t={t} />
        </div>

        {/* View Toggle */}
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
            <span>{t("common.viewMode.cards", { defaultValue: "Cards" })}</span>
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
            <span>{t("common.viewMode.table", { defaultValue: "Table" })}</span>
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-3">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={t("inventory.searchPlaceholder", {
            defaultValue: "Search equipment...",
          })}
          className="w-full"
        />

        <div className="flex items-center justify-between gap-2">
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

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <CategoryDropdown
              current={selectedCategory}
              onChange={onCategoryChange}
              t={t}
            />
            <SortDropdown current={sortBy} onChange={onSortChange} t={t} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryDropdown({
  current,
  onChange,
  t,
}: {
  current: EquipmentCategory | "all";
  onChange: (cat: EquipmentCategory | "all") => void;
  t: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl text-sm transition-all whitespace-nowrap ${
          isOpen
            ? "border-primary ring-1 ring-primary/20"
            : "hover:border-primary"
        }`}
      >
        <Filter
          className={`w-4 h-4 ${current !== "all" ? "text-primary" : "text-text-secondary"}`}
        />
        <span className="capitalize font-medium text-text-primary hidden sm:inline-block">
          {current === "all"
            ? t("common.filters.all", { defaultValue: "All" })
            : t(`inventory.categories.${current}`, { defaultValue: current })}
        </span>
        <span className="capitalize font-medium text-text-primary sm:hidden">
          {t("common.filters.label", { defaultValue: "Filter" })}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 max-h-[60vh] overflow-y-auto custom-scrollbar-thin bg-surface border border-border rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-1">
            <button
              onClick={() => {
                onChange("all");
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${
                current === "all"
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text-secondary hover:bg-muted hover:text-text-primary"
              }`}
            >
              {t("common.filters.all", { defaultValue: "All" })}
              {current === "all" && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
            {EQUIPMENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onChange(cat);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${
                  current === cat
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-secondary hover:bg-muted hover:text-text-primary"
                }`}
              >
                {t(`inventory.categories.${cat}`, { defaultValue: cat })}
                {current === cat && (
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
      if (ref.current && !ref.current.contains(event.target as Node))
        setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const options: SortBy[] = ["name", "quantity", "condition", "createdAt"];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl text-sm transition-all whitespace-nowrap ${
          isOpen
            ? "border-primary ring-1 ring-primary/20"
            : "hover:border-primary"
        }`}
      >
        <ArrowUpDown
          className={`w-4 h-4 ${current !== "name" ? "text-primary" : "text-text-secondary"}`}
        />
        <span className="capitalize font-medium text-text-primary hidden sm:inline-block">
          {t(`inventory.sort.${current}`, { defaultValue: current })}
        </span>
        <span className="capitalize font-medium text-text-primary sm:hidden">
          {t("common.sort", { defaultValue: "Sort" })}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-1">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${
                  current === opt
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-secondary hover:bg-muted hover:text-text-primary"
                }`}
              >
                {t(`inventory.sort.${opt}`, { defaultValue: opt })}
                {current === opt && (
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
