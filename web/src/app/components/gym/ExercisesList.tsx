import { type Exercise } from "@ahmedrioueche/gympro-client";
import { Dumbbell, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ExerciseCard } from "./ExerciseCard";

interface ExercisesListProps {
  exercises: Exercise[];
  isLoading: boolean;
  currentUserId: string;
  onEdit: (exercise: Exercise) => void;
  onDelete: (exercise: Exercise) => void;
  onClick: (exercise: Exercise) => void;
  onCreateClick: () => void;
}

export const ExercisesList = ({
  exercises,
  isLoading,
  currentUserId,
  onEdit,
  onDelete,
  onClick,
  onCreateClick,
}: ExercisesListProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-2xl overflow-hidden h-80 animate-pulse"
          >
            <div className="h-48 bg-surface-secondary" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-surface-secondary rounded w-3/4" />
              <div className="flex gap-2">
                <div className="h-5 bg-surface-secondary rounded w-16" />
                <div className="h-5 bg-surface-secondary rounded w-16" />
              </div>
              <div className="h-10 bg-surface-secondary rounded w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mb-4">
          <Dumbbell className="text-text-secondary w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">
          {t("exercises.empty.title")}
        </h3>
        <p className="text-text-secondary max-w-sm mb-6">
          {t("exercises.empty.description")}
        </p>
        <button
          onClick={onCreateClick}
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus size={20} />
          {t("exercises.empty.action")}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise._id}
          exercise={exercise}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}
    </div>
  );
};
