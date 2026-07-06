import { Timer } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SessionTimerPillProps {
  formattedElapsed: string;
  isRunning: boolean;
  className?: string;
  variant?: "pill" | "inline";
}

export const SessionTimerPill = ({
  formattedElapsed,
  isRunning,
  className = "",
  variant = "pill",
}: SessionTimerPillProps) => {
  const { t } = useTranslation();

  if (variant === "inline") {
    return (
      <div
        className={`flex items-center gap-1 shrink-0 ${className}`}
        aria-live="polite"
        aria-label={t(
          "training.logSession.sessionTimerRunning",
          "Session timer running",
        )}
      >
        <Timer
          size={14}
          className="text-text-secondary shrink-0 sm:hidden"
          aria-hidden
        />
        <span className="hidden sm:inline text-[10px] sm:text-xs text-text-secondary shrink-0">
          {t("training.logSession.timeElapsed", "Time elapsed")}
        </span>
        {isRunning && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shrink-0"
            aria-hidden
          />
        )}
        <span className="text-xs sm:text-sm font-mono font-bold tabular-nums text-text-primary leading-none shrink-0">
          {formattedElapsed}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center gap-1.5 h-8 px-2 rounded-lg border border-border bg-background-secondary/50 overflow-hidden ${className}`}
      aria-live="polite"
      aria-label={t(
        "training.logSession.sessionTimerRunning",
        "Session timer running",
      )}
    >
      {isRunning && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shrink-0"
          aria-hidden
        />
      )}
      <span className="text-[10px] font-bold uppercase text-text-secondary shrink-0">
        {t("training.logSession.sessionTimer", "Session")}
      </span>
      <span className="text-sm font-mono font-bold tabular-nums text-text-primary leading-none shrink-0">
        {formattedElapsed}
      </span>
    </div>
  );
};
