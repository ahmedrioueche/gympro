import type { ExerciseProgress } from "@ahmedrioueche/gympro-client";
import { Check, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface SessionProgressFooterProps {
  exercises: ExerciseProgress[];
  onDone: () => void;
  isSaving: boolean;
}

export const SessionProgressFooter = ({
  exercises,
  onDone,
  isSaving,
}: SessionProgressFooterProps) => {
  const { t } = useTranslation();

  // Calculate progress based on completed sets
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

  return (
    <div className="flex items-center gap-4">
      {/* Progress Section */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              {progressPercent}%
            </span>
            <span className="text-text-secondary text-sm">
              {t("training.logSession.sessionProgress", "Session Progress")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {allComplete && <CheckCircle2 size={16} className="text-success" />}
            <span className="font-bold text-text-primary">{completedSets}</span>
            <span className="text-text-secondary text-sm">
              / {totalSets} {t("training.logSession.setsComplete", "sets")}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 bg-background-secondary rounded-full overflow-hidden">
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

      {/* Done Button */}
      <button
        onClick={onDone}
        disabled={isSaving}
        className={`px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          allComplete
            ? "bg-success hover:bg-success/90"
            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        }`}
      >
        {isSaving ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t("common.saving", "Saving...")}
          </>
        ) : (
          <>
            <Check size={20} />
            {t("training.logSession.done", "Done")}
          </>
        )}
      </button>
    </div>
  );
};
