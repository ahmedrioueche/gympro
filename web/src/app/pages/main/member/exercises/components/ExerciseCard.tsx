import { type Exercise } from "@ahmedrioueche/gympro-client";
import { Menu, Transition } from "@headlessui/react";
import {
  Activity,
  BarChart,
  Clock,
  Dumbbell,
  Edit2,
  MoreVertical,
  Repeat,
  Trash2,
  Video,
} from "lucide-react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

interface ExerciseCardProps {
  exercise: Exercise;
  currentUserId: string;
  onEdit: (exercise: Exercise) => void;
  onDelete: (exercise: Exercise) => void;
  onClick: (exercise: Exercise) => void;
}

export const ExerciseCard = ({
  exercise,
  currentUserId,
  onEdit,
  onDelete,
  onClick,
}: ExerciseCardProps) => {
  const { t } = useTranslation();
  const isOwner = exercise.createdBy === currentUserId;

  // Helper to extract YouTube ID
  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYouTubeId(exercise.videoUrl);
  const thumbnailUrl = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
    : null;

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "expert":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <div
      onClick={() => onClick(exercise)}
      className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer flex flex-col h-full"
    >
      {/* Media Section */}
      <div className="relative h-48 bg-surface-secondary overflow-hidden group-hover:shadow-inner transition-all">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={exercise.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : exercise.imageUrl ? (
          <img
            src={exercise.imageUrl}
            alt={exercise.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center group-hover:from-primary/10 group-hover:to-secondary/10 transition-colors">
            <Dumbbell className="w-12 h-12 text-primary/30 group-hover:text-primary/50 transition-colors" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {exercise.type && (
            <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-white/10 uppercase tracking-wide flex items-center gap-1.5">
              <Activity size={12} className="text-primary" />
              {t(`training.exercises.types.${exercise.type}`, exercise.type)}
            </span>
          )}
        </div>

        {/* Video Indicator */}
        {exercise.videoUrl && (
          <div className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md text-white rounded-full hover:bg-primary hover:text-white transition-all transform group-hover:scale-110 shadow-lg border border-white/10">
            <Video size={16} />
          </div>
        )}

        {/* Creator Badge (Bottom Right of Image) */}
        {!isOwner && (
          <div className="absolute bottom-3 right-3">
            <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-lg border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              User
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
              {exercise.name}
            </h3>
            {isOwner && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative -mr-2"
              >
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-secondary transition-colors">
                    <MoreVertical size={16} />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-20 focus:outline-none divide-y divide-border">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onEdit(exercise)}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 ${
                              active
                                ? "bg-surface-secondary text-primary"
                                : "text-text-primary"
                            }`}
                          >
                            <Edit2 size={14} />
                            {t("common.edit")}
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onDelete(exercise)}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 ${
                              active
                                ? "bg-red-500/10 text-red-500"
                                : "text-red-500"
                            }`}
                          >
                            <Trash2 size={14} />
                            {t("common.delete")}
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {exercise.difficulty && (
              <span
                className={`px-2.5 py-0.5 text-xs font-medium rounded-md border capitalize flex items-center gap-1.5 ${getDifficultyColor(
                  exercise.difficulty
                )}`}
              >
                <BarChart size={12} />
                {t(
                  `training.exercises.difficulty.${exercise.difficulty}`,
                  exercise.difficulty
                )}
              </span>
            )}
            {exercise.targetMuscles?.slice(0, 2).map((muscle) => (
              <span
                key={muscle}
                className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-surface-secondary text-text-secondary border border-border capitalize"
              >
                {t(`training.muscles.${muscle}`, muscle)}
              </span>
            ))}
            {(exercise.targetMuscles?.length || 0) > 2 && (
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-surface-secondary text-text-secondary border border-border">
                +{exercise.targetMuscles!.length - 2}
              </span>
            )}
          </div>

          {exercise.description && (
            <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
              {exercise.description}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="mt-auto pt-4 border-t border-border grid grid-cols-2 gap-3">
          <div className="bg-background-secondary/50 rounded-lg p-2 text-center border border-border/50">
            <div className="flex items-center justify-center gap-1.5 text-xs text-text-secondary mb-0.5">
              <Repeat size={12} className="text-primary" />
              {t("training.exercises.form.recommendedSets")}
            </div>
            <span className="font-bold text-text-primary">
              {exercise.recommendedSets || "-"}
              <span className="text-xs text-text-secondary font-normal">
                {" "}
                x{" "}
              </span>
              {exercise.recommendedReps || "-"}
            </span>
          </div>
          <div className="bg-background-secondary/50 rounded-lg p-2 text-center border border-border/50">
            <div className="flex items-center justify-center gap-1.5 text-xs text-text-secondary mb-0.5">
              <Clock size={12} className="text-primary" />
              {t("training.exercises.form.duration")}
            </div>
            <span className="font-bold text-text-primary">
              {exercise.durationMinutes ? `${exercise.durationMinutes}m` : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
