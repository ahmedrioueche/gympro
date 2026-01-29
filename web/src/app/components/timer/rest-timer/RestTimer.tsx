import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRestTimer } from "./useRestTimer";

export const RestTimer = () => {
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

  // Determine display state
  const getStatusText = () => {
    if (isCompleted) return t("timer.go", "Go!");
    if (isWarning) return t("timer.getReady", "Get Ready!");
    return t("timer.resting", "Resting");
  };

  const getStateColor = () => {
    if (isCompleted) return "success";
    if (isWarning) return "warning";
    return "primary";
  };

  const stateColor = getStateColor();

  return (
    <div className="fixed bottom-20 right-4 left-4 sm:left-auto z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Audio Elements */}
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
        className={`bg-background border rounded-2xl shadow-xl overflow-hidden p-4 relative w-full sm:w-auto sm:min-w-[320px] transition-colors ${
          stateColor === "success"
            ? "border-success"
            : stateColor === "warning"
              ? "border-warning"
              : "border-border"
        }`}
      >
        {/* Progress Bar Background */}
        <div className="absolute top-0 left-0 h-1 bg-surface-secondary w-full" />
        <div
          className={`absolute top-0 left-0 h-1 w-full transition-all duration-100 ease-linear ${
            stateColor === "success"
              ? "bg-success"
              : stateColor === "warning"
                ? "bg-warning"
                : "bg-primary"
          }`}
          style={{ width: `${progress}%` }}
        />

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-0.5 truncate">
              {getStatusText()} {exerciseName ? `• ${exerciseName}` : ""}
            </p>
            <h2
              className={`text-3xl font-mono font-bold tabular-nums transition-colors ${
                stateColor === "success"
                  ? "text-success"
                  : stateColor === "warning"
                    ? "text-warning"
                    : "text-text-primary"
              }`}
            >
              {formatTime(remaining)}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => subtractTime(10)}
              className="w-10 h-10 rounded-xl bg-background-secondary hover:bg-surface-secondary text-text-primary flex items-center justify-center font-bold text-xs border border-border transition-colors"
            >
              -10
            </button>
            <button
              onClick={() => addTime(30)}
              className="w-10 h-10 rounded-xl bg-background-secondary hover:bg-surface-secondary text-text-primary flex items-center justify-center font-bold text-xs border border-border transition-colors"
            >
              +30
            </button>
            <button
              onClick={stopTimer}
              className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/30 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
