import type { ExerciseProgress } from "@ahmedrioueche/gympro-client";
import { Check, CheckCircle2, Cloud } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface SessionProgressFooterProps {
  exercises: ExerciseProgress[];
  onDone: () => void;
  isSaving: boolean;
  isAutoSaving?: boolean;
  showSavedIndicator?: boolean;
}

export const SessionProgressFooter = ({
  exercises,
  onDone,
  isSaving,
  isAutoSaving = false,
  showSavedIndicator = false,
}: SessionProgressFooterProps) => {
  const { t } = useTranslation();

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
    <div className="flex flex-col gap-3 w-full">
      {showAutoSaveStatus && (
        <div
          className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 sm:hidden ${
            isAutoSaving
              ? "bg-primary/10 text-primary"
              : "bg-success/10 text-success"
          }`}
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
      )}

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {progressPercent}%
              </span>
              <span className="text-text-secondary text-xs sm:text-sm truncate">
                {t("training.logSession.sessionProgress")}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {showAutoSaveStatus && (
                <div
                  className={`hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-300 ${
                    isAutoSaving
                      ? "bg-primary/10 text-primary"
                      : "bg-success/10 text-success"
                  }`}
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
              )}

              <div className="flex items-center gap-1.5">
                {allComplete && (
                  <CheckCircle2 size={16} className="text-success" />
                )}
                <span className="font-bold text-text-primary text-sm sm:text-base">
                  {completedSets}
                </span>
                <span className="text-text-secondary text-xs sm:text-sm">
                  / {totalSets} {t("training.logSession.setsComplete")}
                </span>
              </div>
            </div>
          </div>

          <div className="h-2 sm:h-2.5 bg-background-secondary rounded-full overflow-hidden">
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
          className={`flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
            allComplete
              ? "bg-success hover:bg-success/90"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          }`}
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="hidden sm:inline">{t("common.saving")}</span>
            </>
          ) : (
            <>
              <Check size={20} />
              {t("training.logSession.done")}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
