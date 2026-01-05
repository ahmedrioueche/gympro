import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SubscriptionsControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: "all" | "active" | "expired";
  onFilterStatusChange: (status: "all" | "active" | "expired") => void;
}

export const SubscriptionsControls = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
}: SubscriptionsControlsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          placeholder={t("mySubscriptions.search", "Search by gym name...")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => onFilterStatusChange("all")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            filterStatus === "all"
              ? "bg-primary text-white shadow-md"
              : "bg-surface border border-border text-text-primary hover:bg-surface-hover"
          }`}
        >
          {t("mySubscriptions.filter.all", "All")}
        </button>
        <button
          onClick={() => onFilterStatusChange("active")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            filterStatus === "active"
              ? "bg-success text-white shadow-md"
              : "bg-surface border border-border text-text-primary hover:bg-surface-hover"
          }`}
        >
          {t("mySubscriptions.filter.active", "Active")}
        </button>
        <button
          onClick={() => onFilterStatusChange("expired")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            filterStatus === "expired"
              ? "bg-danger text-white shadow-md"
              : "bg-surface border border-border text-text-primary hover:bg-surface-hover"
          }`}
        >
          {t("mySubscriptions.filter.expired", "Expired")}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionsControls;
