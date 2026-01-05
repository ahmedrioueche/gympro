import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const [localSearchValue, setLocalSearchValue] = useState(searchQuery);
  const debounceTimerRef = useRef<number | undefined>(undefined);

  // Sync local value with prop
  useEffect(() => {
    setLocalSearchValue(searchQuery);
  }, [searchQuery]);

  // Handle clearing search
  const handleClearSearch = () => {
    onSearchChange("");
    setLocalSearchValue("");
  };

  // Debounced search handler
  const handleSearchInput = (value: string) => {
    setLocalSearchValue(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 500);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-surface border border-border rounded-xl md:rounded-2xl p-3 md:p-5 w-full">
      {/* Unified Layout - All Screens */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search Input - Flex Grow */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t("subscriptions.search", "Search members...")}
            value={localSearchValue}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 md:pl-11 pr-10 focus:ring-1 focus:ring-primary bg-background border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none transition-all text-sm md:text-base"
          />
          <span className="absolute left-3 md:left-3.5 top-1/2 -translate-y-1/2 text-base md:text-lg">
            🔍
          </span>
          {localSearchValue && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-danger w-6 h-6 flex items-center justify-center rounded-full hover:bg-danger/10 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter */}
        <StatusFilterDropdown
          current={filterStatus}
          onChange={onFilterStatusChange}
          t={t}
        />
      </div>
    </div>
  );
}

function StatusFilterDropdown({
  current,
  onChange,
  t,
}: {
  current: "all" | "active" | "expired" | "expiring";
  onChange: (status: "all" | "active" | "expired" | "expiring") => void;
  t: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const statuses: ("all" | "active" | "expired" | "expiring")[] = [
    "all",
    "active",
    "expired",
    "expiring",
  ];

  const getStatusLabel = (status: typeof current) => {
    switch (status) {
      case "all":
        return t("common.all", "All");
      case "active":
        return t("subscriptions.active", "Active");
      case "expired":
        return t("subscriptions.expired", "Expired");
      case "expiring":
        return t("subscriptions.expiringSoon", "Expiring Soon");
    }
  };

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-2.5 bg-background border border-border rounded-xl text-sm transition-all ${
          isOpen
            ? "border-primary ring-1 ring-primary/20"
            : "hover:border-primary"
        }`}
      >
        <Filter
          className={`w-4 h-4 md:h-6 ${
            current !== "all" ? "text-primary" : "text-text-secondary"
          }`}
        />
        <span className="hidden sm:inline capitalize font-medium text-text-primary">
          {getStatusLabel(current)}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 md:w-4 md:h-4 text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="p-1">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => {
                  onChange(status);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${
                  current === status
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-secondary hover:bg-muted hover:text-text-primary"
                }`}
              >
                {getStatusLabel(status)}
                {current === status && (
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

export default SubscriptionsControls;
