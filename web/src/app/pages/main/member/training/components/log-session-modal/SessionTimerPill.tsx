import { useTranslation } from "react-i18next";

interface SessionTimerPillProps {
  formattedElapsed: string;
  isRunning: boolean;
  className?: string;
}

export const SessionTimerPill = ({
  formattedElapsed,
  isRunning,
  className = "",
}: SessionTimerPillProps) => {
  const { t } = useTranslation();

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
