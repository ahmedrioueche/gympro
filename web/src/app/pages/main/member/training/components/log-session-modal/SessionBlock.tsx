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
  startIndex: number; // Global start index for numbering
  isSplit: boolean;
  onToggleSplit: () => void;
  onUpdateSet: (
    exIndex: number,
    setIndex: number,
    field: keyof ExerciseSet,
    value: any,
  ) => void;
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
}

export const SessionBlock = ({
  block,
  exercises,
  startIndex,
  isSplit,
  onToggleSplit,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  onAddDropSet,
  onUpdateDropSet,
  onRemoveDropSet,
  onViewVideo,
  onToggleSupersetCompletion,
}: SessionBlockProps) => {
  const isSuperset = block.type === "superset" || block.type === "circuit";

  // Case 1: Standard Single Block OR Superset opted-out to Split View
  if (!isSuperset || isSplit) {
    return (
      <div
        className={`space-y-4 ${isSuperset && isSplit ? "pl-4 border-l-2 border-primary/20" : ""}`}
      >
        {/* If split, maybe show a header? Or just the cards? 
            Let's show a small "Superset Split" header to allow re-merging */}
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
            key={i}
            exercise={ex}
            exerciseIndex={startIndex + i}
            originalExercise={block.exercises[i]}
            onUpdateSet={onUpdateSet}
            onAddSet={onAddSet}
            onRemoveSet={onRemoveSet}
            onAddDropSet={onAddDropSet}
            onUpdateDropSet={onUpdateDropSet}
            onRemoveDropSet={onRemoveDropSet}
            onViewVideo={onViewVideo}
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
      exIndices={exercises.map((_, i) => startIndex + i)}
      onUpdateSet={onUpdateSet}
      onAddSet={onAddSet}
      onRemoveSet={onRemoveSet}
      onToggleSplit={onToggleSplit}
      originalFormattedExercises={block.exercises}
      onToggleSupersetCompletion={onToggleSupersetCompletion}
    />
  );
};
