import {
  type AppPaymentProvider,
  type AppPaymentStatus,
} from "@ahmedrioueche/gympro-client";
import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface PaymentsControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: AppPaymentStatus | "all";
  onFilterStatusChange: (status: AppPaymentStatus | "all") => void;
  filterProvider: AppPaymentProvider | "all";
  onFilterProviderChange: (provider: AppPaymentProvider | "all") => void;
}

function PaymentsControls({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterProvider,
  onFilterProviderChange,
}: PaymentsControlsProps) {
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
      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Search Input */}
        <div className="relative w-80">
          <input
            type="text"
            placeholder={t("payments.filters.search")}
            value={localSearchValue}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="w-full px-4 py-2.5 pl-11 pr-10 focus:ring-1 focus:ring-primary bg-background border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none transition-all"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">
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

        {/* Filters */}
        <div className="flex items-center gap-3 flex-1">
          {/* Status Filter */}
          <StatusFilterDropdown
            current={filterStatus}
            onChange={onFilterStatusChange}
            t={t}
          />

          {/* Provider Filter */}
          <ProviderFilterDropdown
            current={filterProvider}
            onChange={onFilterProviderChange}
            t={t}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-3">
        {/* Search - Full Width */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder={t("payments.filters.search")}
            value={localSearchValue}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 pr-10 bg-background border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none text-sm"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">
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

        {/* Filters */}
        <div className="flex items-center gap-2">
          <StatusFilterDropdown
            current={filterStatus}
            onChange={onFilterStatusChange}
            t={t}
          />
          <ProviderFilterDropdown
            current={filterProvider}
            onChange={onFilterProviderChange}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}

function StatusFilterDropdown({
  current,
  onChange,
  t,
}: {
  current: AppPaymentStatus | "all";
  onChange: (status: AppPaymentStatus | "all") => void;
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

  const statuses: (AppPaymentStatus | "all")[] = [
    "all",
    "completed",
    "pending",
    "failed",
    "refunded",
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl text-sm transition-all ${
          isOpen
            ? "border-primary ring-1 ring-primary/20"
            : "hover:border-primary"
        }`}
      >
        <Filter
          className={`w-4 h-4 ${
            current !== "all" ? "text-primary" : "text-text-secondary"
          }`}
        />
        <span className="capitalize font-medium text-text-primary">
          {current === "all"
            ? t("payments.filters.all")
            : t(`payments.status.${current}`)}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50">
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
                {status === "all"
                  ? t("payments.filters.all")
                  : t(`payments.status.${status}`)}
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

function ProviderFilterDropdown({
  current,
  onChange,
  t,
}: {
  current: AppPaymentProvider | "all";
  onChange: (provider: AppPaymentProvider | "all") => void;
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

  const providers: (AppPaymentProvider | "all")[] = [
    "all",
    "paddle",
    "chargily",
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl text-sm transition-all ${
          isOpen
            ? "border-primary ring-1 ring-primary/20"
            : "hover:border-primary"
        }`}
      >
        <span className="capitalize font-medium text-text-primary">
          {current === "all"
            ? t("payments.filters.all")
            : t(`payments.provider.${current}`)}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="p-1">
            {providers.map((provider) => (
              <button
                key={provider}
                onClick={() => {
                  onChange(provider);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${
                  current === provider
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-secondary hover:bg-muted hover:text-text-primary"
                }`}
              >
                {provider === "all"
                  ? t("payments.filters.all")
                  : t(`payments.provider.${provider}`)}
                {current === provider && (
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

export default PaymentsControls;
