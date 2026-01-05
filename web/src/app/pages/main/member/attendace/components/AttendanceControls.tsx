import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AttendanceControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: "all" | "checked_in" | "denied";
  onFilterStatusChange: (status: "all" | "checked_in" | "denied") => void;
}

export const AttendanceControls = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
}: AttendanceControlsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          placeholder={t("attendance.search", "Search by gym name...")}
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
          {t("attendance.filter.all", "All")}
        </button>
        <button
          onClick={() => onFilterStatusChange("checked_in")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            filterStatus === "checked_in"
              ? "bg-success text-white shadow-md"
              : "bg-surface border border-border text-text-primary hover:bg-surface-hover"
          }`}
        >
          {t("attendance.filter.checked_in", "Checked In")}
        </button>
        <button
          onClick={() => onFilterStatusChange("denied")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            filterStatus === "denied"
              ? "bg-danger text-white shadow-md"
              : "bg-surface border border-border text-text-primary hover:bg-surface-hover"
          }`}
        >
          {t("attendance.filter.denied", "Denied")}
        </button>
      </div>
    </div>
  );
};

export default AttendanceControls;
