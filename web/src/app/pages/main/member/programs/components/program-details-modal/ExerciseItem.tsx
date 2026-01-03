import { ChevronRight, PlayCircle } from "lucide-react";

interface ExerciseItemProps {
  exercise: any;
  index: number;
  onClick: () => void;
}

export const ExerciseItem = ({
  exercise,
  index,
  onClick,
}: ExerciseItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center justify-between p-3 hover:bg-surface-hover rounded-lg group transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-text-secondary font-mono text-sm w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {index + 1}
        </span>
        <div>
          <span className="font-medium text-text-primary group-hover:text-primary transition-colors block">
            {exercise.name}
          </span>
          {(exercise.recommendedSets || exercise.recommendedReps) && (
            <span className="text-xs text-text-secondary">
              {exercise.recommendedSets} sets × {exercise.recommendedReps} reps
            </span>
          )}
        </div>
      </div>
      {exercise.videoUrl ? (
        <PlayCircle
          size={18}
          className="text-text-secondary group-hover:text-primary"
        />
      ) : (
        <ChevronRight
          size={18}
          className="text-text-secondary group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
        />
      )}
    </button>
  );
};
