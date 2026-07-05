import { Timer, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRestTimer } from "../../../../../components/timer/rest-timer/useRestTimer";

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

  const getStatusText = () => {
    if (isCompleted) return t("timer.go", "Go!");
    if (isWarning) return t("timer.getReady", "Get Ready!");
    return t("timer.resting", "Resting");
  };

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
      ? "fixed bottom-20 right-4 left-4 sm:left-auto z-50 animate-in slide-in-from-bottom-10 fade-in duration-300"
      : "w-full";

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
        className={`relative bg-surface border rounded-xl overflow-hidden p-3 ${borderClass}`}
      >
        <div className="absolute top-0 left-0 h-0.5 bg-surface-secondary w-full" />
        <div
          className={`absolute top-0 left-0 h-0.5 transition-all duration-100 ease-linear ${progressClass}`}
          style={{ width: `${progress}%` }}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Timer size={16} className="text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold tracking-wider text-text-secondary truncate">
                {getStatusText()}
                {exerciseName ? ` · ${exerciseName}` : ""}
              </p>
              <p
                className={`text-xl font-mono font-bold tabular-nums leading-tight ${timeClass}`}
              >
                {formatTime(remaining)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => subtractTime(10)}
              className="w-9 h-9 rounded-lg bg-background-secondary hover:bg-surface-secondary text-text-primary flex items-center justify-center font-bold text-[10px] border border-border transition-colors"
            >
              -10
            </button>
            <button
              type="button"
              onClick={() => addTime(30)}
              className="w-9 h-9 rounded-lg bg-background-secondary hover:bg-surface-secondary text-text-primary flex items-center justify-center font-bold text-[10px] border border-border transition-colors"
            >
              +30
            </button>
            <button
              type="button"
              onClick={stopTimer}
              className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/30 transition-colors"
              aria-label={t("common.close")}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
