import {
  type Exercise,
  type ExerciseFilters,
} from "@ahmedrioueche/gympro-client";
import { Dumbbell, Info, Plus, Search, Video, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../../components/ui/InputField";
import { useExercises } from "../../../hooks/queries/useExercises";
import { useModalStore } from "../../../store/modal";

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  onCancel?: () => void;
  className?: string;
}

export const ExerciseSelector = ({
  onSelect,
  onCancel,
  className = "",
}: ExerciseSelectorProps) => {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const [search, setSearch] = useState("");

  const filters: ExerciseFilters = {
    search,
  };

  const { data: exercisesResponse, isLoading } = useExercises(filters);
  const exercises = exercisesResponse?.data || [];

  // Helper to extract YouTube ID (reused logic)
  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getThumbnail = (exercise: Exercise) => {
    const youtubeId = getYouTubeId(exercise.videoUrl);
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
    }
    return exercise.imageUrl;
  };

  return (
    <div
      className={`bg-surface border border-border rounded-xl flex flex-col h-full max-h-[400px] overflow-hidden ${className}`}
    >
      {/* Header / Search */}
      <div className="p-3 border-b border-border bg-background-secondary sticky top-0 z-10 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-text-primary">
            {t("training.exercises.selector.title")}
          </span>
          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                onClick={onCancel}
                className="p-1 hover:bg-background-secondary rounded-lg text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        <div className="relative">
          <InputField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("training.exercises.selector.searchPlaceholder")}
            autoFocus
            leftIcon={<Search size={16} />}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-8 text-text-secondary text-sm">
            {t("training.exercise.noResults")}
          </div>
        ) : (
          exercises.map((exercise) => {
            const thumbnail = getThumbnail(exercise);

            return (
              <div
                key={exercise._id}
                className="group flex items-center gap-3 p-2 rounded-lg hover:bg-surface-secondary border border-transparent hover:border-border transition-all cursor-pointer"
                onClick={() => onSelect(exercise)}
              >
                {/* Media Preview */}
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-background-secondary flex-shrink-0 border border-border/50">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary">
                      <Dumbbell size={20} />
                    </div>
                  )}
                  {exercise.videoUrl && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Video size={14} className="text-white drop-shadow-md" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-text-primary truncate">
                    {exercise.name}
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {exercise.targetMuscles?.slice(0, 2).map((muscle) => (
                      <span
                        key={muscle}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-background-secondary text-text-secondary border border-border capitalize truncate max-w-[80px]"
                      >
                        {t(`training.muscles.${muscle}`)}
                      </span>
                    ))}
                    {(exercise.targetMuscles?.length || 0) > 2 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-background-secondary text-text-secondary border border-border">
                        +{exercise.targetMuscles!.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal("exercise_detail", { exercise });
                    }}
                    className="p-1.5 text-primary  hover:bg-primary/10 rounded-md transition-colors"
                    title={t("training.exercises.card.viewDetails")}
                  >
                    <Info size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(exercise);
                    }}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
