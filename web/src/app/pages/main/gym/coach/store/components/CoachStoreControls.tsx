import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@ahmedrioueche/gympro-client";
import { ChevronDown, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import Dropdown from "../../../../../../../components/ui/Dropdown";
import { SearchInput } from "../../../../../../../components/ui/SearchInput";

interface CoachStoreControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: ProductCategory | "all";
  onCategoryChange: (category: ProductCategory | "all") => void;
}

export function CoachStoreControls({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: CoachStoreControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 bg-surface border border-border rounded-xl md:rounded-2xl p-3 md:p-4 w-full">
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
  return (
    <Dropdown
      trigger={
        <button
          className={`flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-xl text-sm transition-all whitespace-nowrap hover:border-primary hover:bg-primary/5`}
        >
          <Filter
            className={`w-4 h-4 ${current !== "all" ? "text-primary" : "text-text-secondary"}`}
          />
          <span className="font-medium text-text-primary">
            {current === "all"
              ? t("common.filters.all")
              : t(`store.categories.${current}`)}
          </span>
          <ChevronDown className="w-4 h-4 text-text-secondary" />
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
                close();
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
      )}
    </Dropdown>
  );
}
