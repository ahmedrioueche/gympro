import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRestTimer } from "../../../../../../components/timer/rest-timer/useRestTimer";

interface CompactRestTimerProps {
  variant?: "inline" | "floating";
}

export const CompactRestTimer = ({
  variant = "inline",
}: CompactRestTimerProps) => {
  const { t } = useTranslation();
  const {
    remaining,
    progress,
    isWarning,
    isCompleted,
    isActive,
    exerciseName,
    stopTimer,
    addTime,
    subtractTime,
    warningAudioRef,
    completionAudioRef,
    soundTrack,
    warningSoundTrack,
    formatTime,
  } = useRestTimer();

  if (!isActive) return null;

  const stateColor = isCompleted ? "success" : isWarning ? "warning" : "primary";

  const borderClass =
    stateColor === "success"
      ? "border-success/40"
      : stateColor === "warning"
        ? "border-warning/40"
        : "border-primary/30";

  const progressClass =
    stateColor === "success"
      ? "bg-success"
      : stateColor === "warning"
        ? "bg-warning"
        : "bg-primary";

  const timeClass =
    stateColor === "success"
      ? "text-success"
      : stateColor === "warning"
        ? "text-warning"
        : "text-text-primary";

  const containerClass =
    variant === "floating"
      ? "fixed bottom-20 right-4 left-4 sm:left-auto z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 sm:min-w-[280px]"
      : "flex-1 min-w-0";

  const statusLabel = isCompleted
    ? t("timer.go", "Go!")
    : isWarning
      ? t("timer.getReady", "!")
      : t("timer.rest", "Rest");

  return (
    <div className={containerClass}>
      <audio
        ref={warningAudioRef}
        src={`/sounds/timer/${warningSoundTrack}.mp3`}
        preload="auto"
      />
      <audio
        ref={completionAudioRef}
        src={`/sounds/timer/${soundTrack}.mp3`}
        preload="auto"
      />

      <div
        className={`relative flex items-center gap-1.5 h-8 px-2 rounded-lg border bg-surface overflow-hidden ${
          variant === "inline" ? "w-full" : ""
        } ${borderClass} ${variant === "floating" ? "p-2 gap-2 h-auto min-h-8" : ""}`}
        title={exerciseName}
      >
        <div className="absolute top-0 left-0 h-0.5 bg-surface-secondary w-full" />
        <div
          className={`absolute top-0 left-0 h-0.5 transition-all duration-100 ease-linear ${progressClass}`}
          style={{ width: `${progress}%` }}
        />

        <span className="text-[10px] font-bold uppercase text-text-secondary shrink-0">
          {statusLabel}
        </span>
        <span
          className={`text-sm font-mono font-bold tabular-nums leading-none shrink-0 ${timeClass}`}
        >
          {formatTime(remaining)}
        </span>

        <div className="flex items-center gap-0.5 ml-auto shrink-0">
          <button
            type="button"
            onClick={() => subtractTime(10)}
            className="w-7 h-7 rounded-md bg-background-secondary hover:bg-surface-secondary text-text-primary flex items-center justify-center font-bold text-[9px] border border-border transition-colors"
          >
            -10
          </button>
          <button
            type="button"
            onClick={() => addTime(30)}
            className="w-7 h-7 rounded-md bg-background-secondary hover:bg-surface-secondary text-text-primary flex items-center justify-center font-bold text-[9px] border border-border transition-colors"
          >
            +30
          </button>
          <button
            type="button"
            onClick={stopTimer}
            className="w-7 h-7 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/30 transition-colors"
            aria-label={t("common.close")}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
