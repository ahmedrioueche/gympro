import { type AppPaymentStatus } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import { SearchFilterBar } from "../../../../../../components/ui/SearchFilterBar";

interface PaymentsControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: AppPaymentStatus | "all";
  onFilterStatusChange: (status: AppPaymentStatus | "all") => void;
}

function PaymentsControls({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
}: PaymentsControlsProps) {
  const { t } = useTranslation();

  const filterOptions = [
    { value: "all" as const, label: t("payments.filters.all") },
    { value: "completed" as const, label: t("payments.status.completed") },
    { value: "pending" as const, label: t("payments.status.pending") },
    { value: "failed" as const, label: t("payments.status.failed") },
    { value: "refunded" as const, label: t("payments.status.refunded") },
  ];

  return (
    <SearchFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={t("payments.filters.search")}
      filterValue={filterStatus}
      onFilterChange={onFilterStatusChange}
      filterOptions={filterOptions}
    />
  );
}

export default PaymentsControls;
