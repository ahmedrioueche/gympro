import {
  EQUIPMENT_CATEGORIES,
  type EquipmentCategory,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import { SearchFilterBar } from "../../../../../../../components/ui/SearchFilterBar";

interface MemberInventoryControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: EquipmentCategory | "all";
  onCategoryChange: (category: EquipmentCategory | "all") => void;
}

export function MemberInventoryControls({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: MemberInventoryControlsProps) {
  const { t } = useTranslation();

  const categoryOptions = [
    { value: "all", label: t("common.filters.all", { defaultValue: "All" }) },
    ...EQUIPMENT_CATEGORIES.map((cat) => ({
      value: cat,
      label: t(`inventory.categories.${cat}`, { defaultValue: cat }),
    })),
  ];

  return (
    <div className="mb-6">
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder={t("inventory.searchPlaceholder", {
          defaultValue: "Search equipment...",
        })}
        filterValue={selectedCategory}
        onFilterChange={onCategoryChange as any}
        filterOptions={categoryOptions}
      />
    </div>
  );
}
