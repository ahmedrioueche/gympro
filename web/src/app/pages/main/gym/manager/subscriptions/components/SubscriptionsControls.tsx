import { useTranslation } from "react-i18next";
import { SearchFilterBar } from "../../../../../../../components/ui/SearchFilterBar";

interface SubscriptionsControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: "all" | "active" | "expired" | "expiring";
  onFilterStatusChange: (
    status: "all" | "active" | "expired" | "expiring"
  ) => void;
}

function SubscriptionsControls({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
}: SubscriptionsControlsProps) {
  const { t } = useTranslation();

  const filterOptions = [
    { value: "all" as const, label: t("common.all", "All") },
    { value: "active" as const, label: t("common.active", "Active") },
    { value: "expired" as const, label: t("common.expired", "Expired") },
    {
      value: "expiring" as const,
      label: t("common.expiringSoon", "Expiring Soon"),
    },
  ];

  return (
    <SearchFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={t("gymSubscriptions.search", "Search members...")}
      filterValue={filterStatus}
      onFilterChange={onFilterStatusChange}
      filterOptions={filterOptions}
    />
  );
}

export default SubscriptionsControls;
