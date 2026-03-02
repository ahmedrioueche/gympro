import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@ahmedrioueche/gympro-client";
import { ArrowUpDown, ChevronDown, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SearchInput } from "../../../../../../../components/ui/SearchInput";

import Dropdown from "../../../../../../../components/ui/Dropdown";
import {
  ListActionRow,
  ViewModeToggle,
} from "../../../../../../../components/ui/ListViewControls";
import type { ViewMode } from "../../../../../../../types/common";

export type SortBy = "name" | "price" | "quantity" | "createdAt";

interface StoreControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: ProductCategory | "all";
  onCategoryChange: (category: ProductCategory | "all") => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function StoreControls({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: StoreControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-xl mb-6 md:rounded-2xl p-3 md:p-5 w-full max-w-full relative z-0">
      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Search Input */}
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={t("store.searchPlaceholder")}
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
        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          showText
          className="ml-auto"
        />
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-3">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={t("store.searchPlaceholder")}
          className="w-full"
        />

        <ListActionRow viewMode={viewMode} onViewModeChange={onViewModeChange}>
          <CategoryDropdown
            current={selectedCategory}
            onChange={onCategoryChange}
            t={t}
          />
          <SortDropdown current={sortBy} onChange={onSortChange} t={t} />
        </ListActionRow>
      </div>
    </div>
  );
}

function CategoryDropdown({
  current,
  onChange,
  t,
}: {
  current: ProductCategory | "all";
  onChange: (cat: ProductCategory | "all") => void;
  t: any;
}) {
  return (
    <Dropdown
      trigger={
        <button
          className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-background border border-border rounded-xl text-xs md:text-sm transition-all whitespace-nowrap hover:border-primary`}
        >
          <Filter
            className={`w-3.5 h-3.5 md:w-4 md:h-4 ${current !== "all" ? "text-primary" : "text-text-secondary"}`}
          />
          <span className="capitalize font-medium text-text-primary hidden sm:inline-block">
            {current === "all"
              ? t("common.filters.all")
              : t(`store.categories.${current}`)}
          </span>
          <span className="capitalize font-medium text-text-primary sm:hidden">
            {t("common.filters.label")}
          </span>
          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-text-secondary" />
        </button>
      }
      className="!w-56"
    >
      {(close) => (
        <div className="p-1 max-h-[60vh] overflow-y-auto custom-scrollbar-thin">
          <button
            onClick={() => {
              onChange("all");
              close();
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${
              current === "all"
                ? "bg-primary/10 text-primary font-medium"
                : "text-text-secondary hover:bg-muted hover:text-text-primary"
            }`}
          >
            {t("common.filters.all")}
            {current === "all" && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </button>
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onChange(cat);
                close();
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${
                current === cat
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text-secondary hover:bg-muted hover:text-text-primary"
              }`}
            >
              {t(`store.categories.${cat}`)}
              {current === cat && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
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
  const options: { label: string; value: SortBy }[] = [
    { label: "store.form.name", value: "name" },
    { label: "store.form.price", value: "price" },
    { label: "store.form.quantity", value: "quantity" },
    { label: "common.date", value: "createdAt" },
  ];

  return (
    <Dropdown
      trigger={
        <button
          className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-background border border-border rounded-xl text-xs md:text-sm transition-all whitespace-nowrap hover:border-primary`}
        >
          <ArrowUpDown
            className={`w-3.5 h-3.5 md:w-4 md:h-4 ${current !== "name" ? "text-primary" : "text-text-secondary"}`}
          />
          <span className="capitalize font-medium text-text-primary hidden sm:inline-block">
            {t(options.find((o) => o.value === current)?.label || current)}
          </span>
          <span className="capitalize font-medium text-text-primary sm:hidden">
            {t("common.sort")}
          </span>
          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-text-secondary" />
        </button>
      }
      className="!w-48"
    >
      {(close) => (
        <div className="p-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                close();
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${
                current === opt.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text-secondary hover:bg-muted hover:text-text-primary"
              }`}
            >
              {t(opt.label)}
              {current === opt.value && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
