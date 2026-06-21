import { Check, Cloud } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AutoSaveIndicatorProps {
  isAutoSaving?: boolean;
  showSavedIndicator?: boolean;
  className?: string;
}

export const AutoSaveIndicator = ({
  isAutoSaving = false,
  showSavedIndicator = false,
  className = "",
}: AutoSaveIndicatorProps) => {
  const { t } = useTranslation();

  if (!isAutoSaving && !showSavedIndicator) return null;

  return (
    <>
      <div
        className={`flex sm:hidden items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
          isAutoSaving
            ? "bg-primary/10 text-primary"
            : "bg-success/10 text-success"
        } ${className}`}
        aria-live="polite"
      >
        {isAutoSaving ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            {t("training.logSession.autoSaving")}
          </>
        ) : (
          <>
            <Check size={14} strokeWidth={3} />
            {t("training.logSession.autoSaved")}
          </>
        )}
      </div>

      <div
        className={`hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-300 ${
          isAutoSaving
            ? "bg-primary/10 text-primary"
            : "bg-success/10 text-success"
        } ${className}`}
        aria-live="polite"
      >
        {isAutoSaving ? (
          <>
            <Cloud size={13} className="animate-pulse" />
            {t("training.logSession.autoSaving")}
          </>
        ) : (
          <>
            <Check size={13} strokeWidth={3} />
            {t("training.logSession.autoSaved")}
          </>
        )}
      </div>
    </>
  );
};
