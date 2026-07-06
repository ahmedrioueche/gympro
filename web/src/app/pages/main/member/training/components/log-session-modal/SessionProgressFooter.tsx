import type { ExerciseProgress } from "@ahmedrioueche/gympro-client";
import { Check, CheckCircle2, Cloud } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTimerStore } from "../../../../../../../store/timer";
import { CompactRestTimer } from "./CompactRestTimer";
import { SessionTimerPill } from "./SessionTimerPill";

interface SessionProgressFooterProps {
  exercises: ExerciseProgress[];
  onDone: () => void;
  isSaving: boolean;
  isAutoSaving?: boolean;
  showSavedIndicator?: boolean;
  sessionTimerFormattedElapsed: string;
  sessionTimerIsRunning: boolean;
}

export const SessionProgressFooter = ({
  exercises,
  onDone,
  isSaving,
  isAutoSaving = false,
  showSavedIndicator = false,
  sessionTimerFormattedElapsed,
  sessionTimerIsRunning,
}: SessionProgressFooterProps) => {
  const { t } = useTranslation();
  const isRestTimerActive = useTimerStore((s) => s.endTime !== null);

  const { completedSets, totalSets, progressPercent, allComplete } =
    useMemo(() => {
      let completed = 0;
      let total = 0;

      exercises.forEach((ex) => {
        ex.sets.forEach((set) => {
          total++;
          if (set.completed) {
            completed++;
          }
        });
      });

      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        completedSets: completed,
        totalSets: total,
        progressPercent: percent,
        allComplete: total > 0 && completed === total,
      };
    }, [exercises]);

  const showAutoSaveStatus = isAutoSaving || showSavedIndicator;

  return (
    <div className="flex flex-col gap-2 w-full">
      {isRestTimerActive && (
        <div className="flex items-center gap-2 w-full">
          <CompactRestTimer variant="inline" />
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-lg sm:text-xl font-bold text-primary leading-none">
                  {progressPercent}%
                </span>
                <span className="hidden sm:inline text-text-secondary text-xs truncate">
                  {t("training.logSession.sessionProgress")}
                </span>
              </div>

              <span
                className="hidden sm:inline text-text-secondary/40 text-xs leading-none"
                aria-hidden
              >
                ·
              </span>

              <SessionTimerPill
                variant="inline"
                formattedElapsed={sessionTimerFormattedElapsed}
                isRunning={sessionTimerIsRunning}
              />
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {showAutoSaveStatus && (
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all duration-300 ${
                    isAutoSaving
                      ? "bg-primary/10 text-primary"
                      : "bg-success/10 text-success"
                  }`}
                  aria-live="polite"
                >
                  {isAutoSaving ? (
                    <>
                      <Cloud size={11} className="animate-pulse" />
                      <span className="hidden sm:inline">
                        {t("training.logSession.autoSaving")}
                      </span>
                    </>
                  ) : (
                    <>
                      <Check size={11} strokeWidth={3} />
                      <span className="hidden sm:inline">
                        {t("training.logSession.autoSaved")}
                      </span>
                    </>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1">
                {allComplete && (
                  <CheckCircle2 size={14} className="text-success" />
                )}
                <span className="font-bold text-text-primary text-xs sm:text-sm leading-none">
                  {completedSets}
                </span>
                <span className="text-text-secondary text-[10px] sm:text-xs leading-none">
                  / {totalSets}
                </span>
              </div>
            </div>
          </div>

          <div className="h-1.5 bg-background-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                allComplete
                  ? "bg-success"
                  : "bg-gradient-to-r from-blue-500 to-purple-600"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      <button
        onClick={onDone}
        disabled={isSaving}
        className={`flex-shrink-0 px-3 sm:px-5 py-2 rounded-lg font-bold text-white transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
          allComplete
            ? "bg-success hover:bg-success/90"
            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        }`}
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="hidden sm:inline">{t("common.saving")}</span>
          </>
        ) : (
          <>
            <Check size={16} />
            {t("training.logSession.done")}
          </>
        )}
      </button>
      </div>
    </div>
  );
};
