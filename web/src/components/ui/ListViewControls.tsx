import React from "react";
import { useTranslation } from "react-i18next";

export type ViewMode = "cards" | "table";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showText?: boolean;
  className?: string;
}

/**
 * Reusable toggle for switching between List (Table) and Grid (Cards) views.
 * Uses emojis as requested and supports optional text labels.
 */
export function ViewModeToggle({
  viewMode,
  onViewModeChange,
  showText = false,
  className = "",
}: ViewModeToggleProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex gap-1 bg-background border border-border rounded-xl p-1 flex-shrink-0 ${className}`}
    >
      <button
        onClick={() => onViewModeChange("cards")}
        className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-1.5 text-sm ${
          viewMode === "cards"
            ? "bg-primary text-white shadow-md"
            : "text-text-secondary hover:text-primary"
        }`}
        title={t("common.viewMode.cards", "Cards")}
      >
        <span className={showText ? "text-base" : "text-lg"}>📇</span>
        {showText && (
          <span className="hidden sm:inline">
            {t("common.viewMode.cards", "Cards")}
          </span>
        )}
      </button>
      <button
        onClick={() => onViewModeChange("table")}
        className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-1.5 text-sm ${
          viewMode === "table"
            ? "bg-primary text-white shadow-md"
            : "text-text-secondary hover:text-primary"
        }`}
        title={t("common.viewMode.table", "Table")}
      >
        <span className={showText ? "text-base" : "text-lg"}>📊</span>
        {showText && (
          <span className="hidden sm:inline">
            {t("common.viewMode.table", "Table")}
          </span>
        )}
      </button>
    </div>
  );
}

interface ListActionRowProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  children: React.ReactNode;
}

/**
 * A responsive row container typically used for mobile controls.
 * Places the view toggle on the left and filter/sort dropdowns on the right.
 */
export function ListActionRow({
  viewMode,
  onViewModeChange,
  children,
}: ListActionRowProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {children}
      </div>
    </div>
  );
}
