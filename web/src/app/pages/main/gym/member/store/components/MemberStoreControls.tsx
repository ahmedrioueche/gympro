import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import { SearchFilterBar } from "../../../../../../../components/ui/SearchFilterBar";

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

  const categoryOptions = [
    { value: "all", label: t("common.filters.all") },
    ...PRODUCT_CATEGORIES.map((cat) => ({
      value: cat,
      label: t(`store.categories.${cat}`),
    })),
  ];

  return (
    <div className="mb-6">
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder={t("store.searchPlaceholder")}
        filterValue={selectedCategory}
        onFilterChange={onCategoryChange as any}
        filterOptions={categoryOptions}
      />
    </div>
  );
}
