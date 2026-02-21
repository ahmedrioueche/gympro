import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@ahmedrioueche/gympro-client";
import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchInput } from "../../../../../../../components/ui/SearchInput";

interface MemberStoreControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: ProductCategory | "all";
  onCategoryChange: (category: ProductCategory | "all") => void;
}

export function MemberStoreControls({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: MemberStoreControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface mb-6 border border-border rounded-xl md:rounded-2xl p-3 md:p-5 w-full">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={t("store.searchPlaceholder")}
          className="w-80"
        />
        <div className="flex-1" />
        <CategoryDropdown
          current={selectedCategory}
          onChange={onCategoryChange}
        />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-3">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={t("store.searchPlaceholder")}
          className="w-full"
        />
        <CategoryDropdown
          current={selectedCategory}
          onChange={onCategoryChange}
        />
      </div>
    </div>
  );
}

function CategoryDropdown({
  current,
  onChange,
}: {
  current: ProductCategory | "all";
  onChange: (cat: ProductCategory | "all") => void;
}) {
  const { t } = useTranslation();
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
        className={`flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-xl text-sm transition-all whitespace-nowrap ${
          isOpen
            ? "border-primary ring-2 ring-primary/20"
            : "hover:border-primary hover:bg-primary/5"
        }`}
      >
        <Filter
          className={`w-4 h-4 ${current !== "all" ? "text-primary" : "text-text-secondary"}`}
        />
        <span className="font-medium text-text-primary">
          {current === "all"
            ? t("common.filters.all")
            : t(`store.categories.${current}`)}
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
              className={`w-full text-left px-3 py-2.5 text-sm rounded-lg flex items-center justify-between transition-colors ${
                current === "all"
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text-secondary hover:bg-muted hover:text-text-primary"
              }`}
            >
              {t("common.filters.all")}
              {current === "all" && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onChange(cat);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-sm rounded-lg flex items-center justify-between transition-colors ${
                  current === cat
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-secondary hover:bg-muted hover:text-text-primary"
                }`}
              >
                {t(`store.categories.${cat}`)}
                {current === cat && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
