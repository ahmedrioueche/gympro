import { Loader, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../utils/helper";

export interface ProfileModalAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "default" | "danger" | "ghost" | "success";
  loading?: boolean;
  disabled?: boolean;
}

interface ProfileModalFooterProps {
  onClose: () => void;
  actions?: ProfileModalAction[];
  closeLabel?: string;
}

export function ProfileModalFooter({
  onClose,
  actions = [],
  closeLabel,
}: ProfileModalFooterProps) {
  const { t } = useTranslation();

  const getButtonClasses = (
    variant: ProfileModalAction["variant"] = "default",
    disabled?: boolean,
    loading?: boolean,
    className?: string,
  ) => {
    const baseClasses =
      "px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm";

    if (disabled || loading) {
      return cn(
        baseClasses,
        "bg-gray-400 cursor-not-allowed opacity-50 shadow-none ring-0 text-white",
        className,
      );
    }

    switch (variant) {
      case "primary":
        return cn(
          baseClasses,
          "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white ring-1 ring-blue-500/30 hover:shadow-xl hover:shadow-purple-500/20",
          className,
        );
      case "danger":
        return cn(
          baseClasses,
          "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md",
          className,
        );
      case "success":
        return cn(
          baseClasses,
          "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-md",
          className,
        );
      case "ghost":
        return cn(
          baseClasses,
          "bg-transparent hover:bg-surface-hover text-text-secondary hover:text-text-primary",
          className,
        );
      case "default":
      default:
        return cn(
          baseClasses,
          "text-text-secondary bg-surface hover:bg-surface/50 border-2 border-border hover:border-primary/30",
          className,
        );
    }
  };

  return (
    <div className="flex justify-end items-center gap-3 w-full">
      <button
        type="button"
        onClick={onClose}
        className={getButtonClasses("default")}
      >
        {closeLabel || t("common.close")}
      </button>

      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={index}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
            className={getButtonClasses(
              action.variant || "primary",
              action.disabled,
              action.loading,
            )}
          >
            {action.loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              Icon && <Icon className="w-4 h-4" />
            )}
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
