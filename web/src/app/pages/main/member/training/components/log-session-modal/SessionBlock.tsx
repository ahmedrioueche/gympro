import {
  type ExerciseProgress,
  type ExerciseSet,
  type TrainingProgram,
} from "@ahmedrioueche/gympro-client";
import { SessionExerciseCard } from "./SessionExerciseCard";
import { SessionSupersetCard } from "./SessionSupersetCard";

interface SessionBlockProps {
  block: TrainingProgram["days"][0]["blocks"][0];
  exercises: ExerciseProgress[];
  exerciseIndices: number[];
  isSplit: boolean;
  onToggleSplit: () => void;
  onUpdateSet: (
    exIndex: number,
    setIndex: number,
    field: keyof ExerciseSet,
    value: any,
    options?: { propagate?: boolean; commit?: boolean },
  ) => void;
  onCommitSetWeight: (exIndex: number, setIndex: number, weight: number) => void;
  onCommitSetReps: (exIndex: number, setIndex: number, reps: number) => void;
  onAddSet: (exIndex: number) => void;
  onRemoveSet: (exIndex: number, setIndex: number) => void;
  onAddDropSet: (exIndex: number, setIndex: number) => void;
  onUpdateDropSet: (
    exIndex: number,
    setIndex: number,
    dropIndex: number,
    field: "weight" | "reps",
    value: number,
  ) => void;
  onRemoveDropSet: (
    exIndex: number,
    setIndex: number,
    dropIndex: number,
  ) => void;
  onViewVideo: (exercise: any) => void;
  onToggleSupersetCompletion: (
    exerciseIndices: number[],
    setIndex: number,
    completed: boolean,
  ) => void;
  onReplaceExercise: (exIndex: number) => void;
  onRemoveExercise: (exIndex: number) => void;
  getExerciseDisplay?: (
    exIndex: number,
  ) => { name?: string; videoUrl?: string } | null;
}

export const SessionBlock = ({
  block,
  exercises,
  exerciseIndices,
  isSplit,
  onToggleSplit,
  onUpdateSet,
  onCommitSetWeight,
  onCommitSetReps,
  onAddSet,
  onRemoveSet,
  onAddDropSet,
  onUpdateDropSet,
  onRemoveDropSet,
  onViewVideo,
  onToggleSupersetCompletion,
  onReplaceExercise,
  onRemoveExercise,
  getExerciseDisplay,
}: SessionBlockProps) => {
  const isSuperset = block.type === "superset" || block.type === "circuit";

  const resolveProgramExercise = (exercise: ExerciseProgress) =>
    block.exercises.find(
      (progEx) =>
        progEx._id === exercise.exerciseId ||
        progEx.name === exercise.exerciseId,
    );

  const resolveDisplay = (ex: ExerciseProgress, exIndex: number) => {
    const display = getExerciseDisplay?.(exIndex);
    if (display?.name) return display;
    return resolveProgramExercise(ex) ?? { name: ex.exerciseId };
  };

  // Case 1: Standard Single Block OR Superset opted-out to Split View
  if (!isSuperset || isSplit) {
    return (
      <div
        className={`space-y-4 ${isSuperset && isSplit ? "pl-4 border-l-2 border-primary/20" : ""}`}
      >
        {isSuperset && isSplit && (
          <div className="flex justify-between items-center -mb-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {block.type === "superset"
                ? "Superset (Split)"
                : "Circuit (Split)"}
            </span>
            <button
              onClick={onToggleSplit}
              className="text-xs text-primary hover:underline"
            >
              Merge View
            </button>
          </div>
        )}

        {exercises.map((ex, i) => (
          <SessionExerciseCard
            key={exerciseIndices[i]}
            exercise={ex}
            exerciseIndex={exerciseIndices[i]}
            originalExercise={resolveDisplay(ex, exerciseIndices[i])}
            onUpdateSet={onUpdateSet}
            onCommitSetWeight={onCommitSetWeight}
            onCommitSetReps={onCommitSetReps}
            onAddSet={onAddSet}
            onRemoveSet={onRemoveSet}
            onAddDropSet={onAddDropSet}
            onUpdateDropSet={onUpdateDropSet}
            onRemoveDropSet={onRemoveDropSet}
            onViewVideo={onViewVideo}
            onReplaceExercise={() => onReplaceExercise(exerciseIndices[i])}
            onRemoveExercise={() => onRemoveExercise(exerciseIndices[i])}
          />
        ))}
      </div>
    );
  }

  // Case 2: Merged Superset View
  return (
    <SessionSupersetCard
      block={block}
      exercises={exercises}
      exIndices={exerciseIndices}
      onUpdateSet={onUpdateSet}
      onCommitSetWeight={onCommitSetWeight}
      onCommitSetReps={onCommitSetReps}
      onAddSet={onAddSet}
      onRemoveSet={onRemoveSet}
      onToggleSplit={onToggleSplit}
      originalFormattedExercises={exercises.map((ex, i) =>
        resolveDisplay(ex, exerciseIndices[i]),
      )}
      onToggleSupersetCompletion={onToggleSupersetCompletion}
      onRemoveExercise={onRemoveExercise}
    />
  );
};
