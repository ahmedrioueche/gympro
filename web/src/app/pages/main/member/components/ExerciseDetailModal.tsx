import { type Exercise } from "@ahmedrioueche/gympro-client";
import { Dumbbell, PlayCircle, Target, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getEmbedUrl } from "../../../../../utils/helper";

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseDetailModal = ({
  exercise,
  isOpen,
  onClose,
}: ExerciseDetailModalProps) => {
  const { t } = useTranslation();

  if (!isOpen || !exercise) return null;

  const embedUrl = getEmbedUrl(exercise.videoUrl);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl shadow-2xl max-w-lg w-full border-2 border-primary/30 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Dumbbell className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {exercise.name}
                </h2>
                {(exercise.recommendedSets || exercise.recommendedReps) && (
                  <p className="text-white/80 text-sm">
                    {exercise.recommendedSets} {t("training.logSession.sets")} ×{" "}
                    {exercise.recommendedReps} {t("training.logSession.reps")}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Video Section */}
          {embedUrl ? (
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                title={exercise.name}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center aspect-video bg-surface-secondary rounded-xl text-text-secondary border border-border">
              <PlayCircle size={48} className="opacity-50 mb-2" />
              <span className="text-sm">{t("training.exercise.noVideo")}</span>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
              {t("training.exercise.description")}
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed bg-surface-secondary p-3 rounded-lg border border-border">
              {exercise.description || t("training.exercise.noDescription")}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-primary" />
                <span className="text-xs font-medium text-primary">
                  {t("training.exercise.targetMuscles")}
                </span>
              </div>
              <span className="text-sm font-medium capitalize text-text-primary">
                {exercise.targetMuscles?.join(", ") || "-"}
              </span>
            </div>
            <div className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell size={16} className="text-secondary" />
                <span className="text-xs font-medium text-secondary">
                  {t("training.exercise.equipment")}
                </span>
              </div>
              <span className="text-sm font-medium capitalize text-text-primary">
                {exercise.equipment?.join(", ") || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-secondary border-t border-border flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};
