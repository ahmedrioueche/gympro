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

        {/* Set Rows */}
        {exercise.sets.map((set, setIndex) => (
          <div
            key={setIndex}
            className={`grid grid-cols-12 gap-2 items-center p-2 rounded-lg transition-colors ${
              set.completed
                ? "bg-green-500/10 border border-green-500/30"
                : "bg-background-secondary/50"
            }`}
          >
            {/* Set Number */}
            <div className="col-span-1 text-center font-bold text-text-secondary">
              {setIndex + 1}
            </div>

            {/* Weight */}
            <div className="col-span-4">
              <input
                type="number"
                value={set.weight || ""}
                onChange={(e) =>
                  onUpdateSet(
                    exerciseIndex,
                    setIndex,
                    "weight",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-center text-text-primary focus:outline-none focus:border-primary"
                placeholder="0"
              />
            </div>

            {/* Reps */}
            <div className="col-span-4">
              <input
                type="number"
                value={set.reps || ""}
                onChange={(e) =>
                  onUpdateSet(
                    exerciseIndex,
                    setIndex,
                    "reps",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-center text-text-primary focus:outline-none focus:border-primary"
                placeholder="0"
              />
            </div>

            {/* Done + Delete */}
            <div className="col-span-3 flex items-center justify-center gap-1">
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
                    ? "bg-green-500 text-white"
                    : "bg-background-secondary border border-border hover:border-green-500/50"
                }`}
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => onRemoveSet(exerciseIndex, setIndex)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-background-secondary border border-border hover:border-red-500/50 hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* Add Set Button */}
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
