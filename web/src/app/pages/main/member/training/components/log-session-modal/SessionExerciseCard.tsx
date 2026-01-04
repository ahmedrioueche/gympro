import {
  type ExerciseProgress,
  type ExerciseSet,
  type TrainingProgram,
} from "@ahmedrioueche/gympro-client";
import { Check, PlayCircle, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SessionExerciseCardProps {
  exercise: ExerciseProgress;
  exerciseIndex: number;
  originalExercise: TrainingProgram["days"][0]["exercises"][0] | undefined;
  onUpdateSet: (
    exIndex: number,
    setIndex: number,
    field: keyof ExerciseSet,
    value: any
  ) => void;
  onAddSet: (exIndex: number) => void;
  onRemoveSet: (exIndex: number, setIndex: number) => void;
  onViewVideo: (exercise: any) => void;
}

export const SessionExerciseCard = ({
  exercise,
  exerciseIndex,
  originalExercise,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  onViewVideo,
}: SessionExerciseCardProps) => {
  const { t } = useTranslation();

  const exerciseName =
    originalExercise?.name || t("training.logSession.unknownExercise");
  const hasVideo = !!originalExercise?.videoUrl;

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Exercise Header */}
      <div className="bg-background-secondary p-4 flex justify-between items-center border-b border-border">
        <div className="flex items-center gap-3">
          <h5 className="font-bold text-text-primary text-lg">
            {exerciseName}
          </h5>
          {hasVideo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewVideo(originalExercise);
              }}
              className="text-primary hover:text-primary/80 transition-colors"
              title={t("training.exercise.watchVideo", "Watch Video")}
            >
              <PlayCircle size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Sets List */}
      <div className="p-4 space-y-2">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 px-1">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-4 text-center">
            {t("training.logSession.kg")}
          </div>
          <div className="col-span-4 text-center">
            {t("training.logSession.reps")}
          </div>
          <div className="col-span-3 text-center">
            {t("training.logSession.done")}
          </div>
        </div>

        {exercise.sets.map((set, setIndex) => (
          <div
            key={setIndex}
            className={`grid grid-cols-12 gap-2 items-center p-2 rounded-lg transition-colors ${
              set.completed
                ? "bg-green-500/10 border border-green-500/20"
                : "bg-background-tertiary/30 border border-transparent"
            }`}
          >
            <div className="col-span-1 text-center font-bold text-text-secondary">
              {setIndex + 1}
            </div>
            <div className="col-span-4">
              <input
                type="number"
                className="w-full bg-background text-center text-text-primary font-medium p-2 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="0"
                value={set.weight || ""}
                onChange={(e) =>
                  onUpdateSet(
                    exerciseIndex,
                    setIndex,
                    "weight",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>
            <div className="col-span-4">
              <input
                type="number"
                className="w-full bg-background text-center text-text-primary font-medium p-2 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="0"
                value={set.reps || ""}
                onChange={(e) =>
                  onUpdateSet(
                    exerciseIndex,
                    setIndex,
                    "reps",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>
            <div className="col-span-3 flex justify-center items-center gap-2">
              <button
                onClick={() =>
                  onUpdateSet(
                    exerciseIndex,
                    setIndex,
                    "completed",
                    !set.completed
                  )
                }
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  set.completed
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                    : "bg-background-tertiary text-text-secondary hover:bg-background-secondary border border-border"
                }`}
              >
                <Check size={16} strokeWidth={3} />
              </button>
              {exercise.sets.length > 1 && (
                <button
                  onClick={() => onRemoveSet(exerciseIndex, setIndex)}
                  className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={() => onAddSet(exerciseIndex)}
          className="w-full py-2 mt-2 flex items-center justify-center gap-2 text-primary font-medium bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-all"
        >
          <Plus size={16} />
          <span>{t("training.logSession.addSet")}</span>
        </button>
      </div>
    </div>
  );
};
