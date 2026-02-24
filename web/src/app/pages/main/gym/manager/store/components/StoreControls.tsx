import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@ahmedrioueche/gympro-client";
import { ArrowUpDown, ChevronDown, Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchInput } from "../../../../../../../components/ui/SearchInput";

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
    <div className="bg-surface border border-border rounded-xl mb-6 md:rounded-2xl p-3 md:p-5 w-full max-w-full overflow-hidden relative z-0">
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
        className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-background border border-border rounded-xl text-xs md:text-sm transition-all whitespace-nowrap ${
          isOpen
            ? "border-primary ring-1 ring-primary/20"
            : "hover:border-primary"
        }`}
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
        <ChevronDown
          className={`w-3 h-3 md:w-4 md:h-4 text-text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] max-h-[60vh] overflow-y-auto custom-scrollbar-thin bg-surface border border-border rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
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
                  setIsOpen(false);
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

  const options: { label: string; value: SortBy }[] = [
    { label: "store.form.name", value: "name" },
    { label: "store.form.price", value: "price" },
    { label: "store.form.quantity", value: "quantity" },
    { label: "common.date", value: "createdAt" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-background border border-border rounded-xl text-xs md:text-sm transition-all whitespace-nowrap ${
          isOpen
            ? "border-primary ring-1 ring-primary/20"
            : "hover:border-primary"
        }`}
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
        <ChevronDown
          className={`w-3 h-3 md:w-4 md:h-4 text-text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 max-w-[calc(100vw-2rem)] bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
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
        </div>
      )}
    </div>
  );
}
