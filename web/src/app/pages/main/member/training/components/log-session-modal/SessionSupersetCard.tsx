import {
  type ExerciseProgress,
  type ExerciseSet,
  type TrainingProgram,
} from "@ahmedrioueche/gympro-client";
import { Check, Split, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTimerStore } from "../../../../../../../store/timer";
import { useUserStore } from "../../../../../../../store/user";

interface SessionSupersetCardProps {
  block: TrainingProgram["days"][0]["blocks"][0];
  exercises: ExerciseProgress[];
  exIndices: number[]; // Global indices of exercises in this block
  onUpdateSet: (
    exIndex: number,
    setIndex: number,
    field: keyof ExerciseSet,
    value: any,
  ) => void;
  onAddSet: (exIndex: number) => void; // Uses first exercise to trigger add for all?
  onRemoveSet: (exIndex: number, setIndex: number) => void; // Removes from all?
  onToggleSplit: () => void;
  originalFormattedExercises: any[]; // For video/rest info
  onToggleSupersetCompletion: (
    exerciseIndices: number[],
    setIndex: number,
    completed: boolean,
  ) => void;
}

export const SessionSupersetCard = ({
  block,
  exercises,
  exIndices,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  onToggleSplit,
  originalFormattedExercises,
  onToggleSupersetCompletion,
}: SessionSupersetCardProps) => {
  const { t } = useTranslation();

  // Assume all exercises in superset have same number of sets (or we take max)
  const maxSets = Math.max(...exercises.map((e) => e.sets.length));

  // Helper to check if a row (setIndex) is completed for ALL exercises
  const isRowCompleted = (setIndex: number) => {
    return exercises.every((ex) => ex.sets[setIndex]?.completed);
  };

  const handleRowComplete = (setIndex: number) => {
    const iscurrentlyDone = isRowCompleted(setIndex);
    const newStatus = !iscurrentlyDone;

    // Use atomic update
    onToggleSupersetCompletion(exIndices, setIndex, newStatus);

    // Trigger Timer if marking as DONE
    // Use the Rest Time of the LAST exercise in the sequence (which should be synced)
    if (newStatus) {
      const { startTimer } = useTimerStore.getState();
      const { user } = useUserStore.getState();

      const defaultRest = user?.appSettings?.timer?.defaultRestTime || 90;

      // Fix: Use local index, not global exIndices
      // originalFormattedExercises corresponds to the block's exercises array
      const lastExerciseOfBlock =
        originalFormattedExercises[originalFormattedExercises.length - 1];
      const restTime = lastExerciseOfBlock?.restTime || defaultRest;

      const names = exercises.map((e) => e.exerciseId).join(" + ");
      startTimer(restTime, `Superset: ${names}`);
    }
  };

  const handleRowAdd = () => {
    // Add set to all exercises
    exIndices.forEach((idx) => onAddSet(idx));
  };

  const handleRowRemove = (setIndex: number) => {
    exIndices.forEach((idx) => onRemoveSet(idx, setIndex));
  };

  return (
    <div className="bg-surface border-2 border-primary/20 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-primary/5 p-3 flex justify-between items-center border-b border-primary/10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary text-sm uppercase tracking-wider">
            {block.type === "superset" ? "Superset" : "Circuit"}
          </span>
          <span className="text-text-secondary text-sm hidden sm:inline">
            {exercises.map((e) => e.exerciseId).join(" + ")}
          </span>
        </div>
        <button
          onClick={onToggleSplit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-background-secondary text-xs font-medium text-text-secondary transition-all"
        >
          <Split size={14} />
          {t("training.logSession.splitView", "Split View")}
        </button>
      </div>

      {/* Combined Table */}
      <div className="p-4 space-y-4">
        {Array.from({ length: maxSets }).map((_, setIndex) => {
          const isDone = isRowCompleted(setIndex);
          return (
            <div
              key={setIndex}
              className={`rounded-xl border transition-all overflow-hidden ${
                isDone
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-surface-secondary/30 border-border"
              }`}
            >
              {/* Set Header */}
              <div className="flex items-center justify-between px-3 py-2 bg-background-secondary/50 border-b border-border/50">
                <span className="font-bold text-text-secondary text-sm">
                  {t("training.logSession.set")} {setIndex + 1}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRowRemove(setIndex)}
                    disabled={isDone}
                    className={`p-1.5 rounded-lg transition-all ${
                      isDone
                        ? "text-text-secondary/30 cursor-not-allowed opacity-50"
                        : "text-text-secondary hover:text-red-500 hover:bg-red-500/10"
                    }`}
                    title={
                      isDone
                        ? t(
                            "training.logSession.uncheckToDelete",
                            "Uncheck to delete",
                          )
                        : "Remove Set"
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => handleRowComplete(setIndex)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isDone
                        ? "bg-green-500 text-white border border-green-500"
                        : "bg-surface border border-border hover:border-primary text-text-primary hover:bg-background-secondary"
                    }`}
                  >
                    {isDone ? (
                      <Check size={14} />
                    ) : (
                      <div className="w-3.5 h-3.5 border-2 border-text-secondary rounded-sm" />
                    )}
                    {isDone ? t("common.done") : t("common.markAsDone")}
                  </button>
                </div>
              </div>

              {/* Exercises Stack */}
              <div className="p-3 space-y-3">
                {exercises.map((ex, i) => {
                  const set = ex.sets[setIndex];
                  if (!set) return null;

                  return (
                    <div key={i} className="flex items-center gap-3">
                      {/* Exercise Name (Small) */}
                      <div className="w-24 sm:w-32 text-xs font-medium text-text-primary truncate">
                        {ex.exerciseId}
                      </div>

                      {/* Inputs */}
                      <div className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={set.weight || ""}
                            onChange={(e) =>
                              onUpdateSet(
                                exIndices[i],
                                setIndex,
                                "weight",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-2 py-1.5 bg-background-secondary border border-border rounded-lg text-center text-text-primary focus:outline-none focus:border-primary text-sm"
                            placeholder="kg"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary pointer-events-none">
                            kg
                          </span>
                        </div>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={set.reps || ""}
                            onChange={(e) =>
                              onUpdateSet(
                                exIndices[i],
                                setIndex,
                                "reps",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-2 py-1.5 bg-background-secondary border border-border rounded-lg text-center text-text-primary focus:outline-none focus:border-primary text-sm"
                            placeholder="reps"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary pointer-events-none">
                            reps
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button
          onClick={handleRowAdd}
          className="w-full py-3 flex items-center justify-center gap-2 text-primary font-medium bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-all text-sm"
        >
          {t("training.logSession.addSet")}
        </button>
      </div>
    </div>
  );
};
