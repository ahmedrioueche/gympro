import {
  Activity,
  BarChart,
  Clock,
  Dumbbell,
  PlayCircle,
  Repeat,
  Target,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import { useModalStore } from "../../../store/modal";
import { getEmbedUrl } from "../../../utils/helper";

export default function ExerciseDetailModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, exerciseModalProps } = useModalStore();

  const embedUrl = getEmbedUrl(exerciseModalProps?.exercise.videoUrl);

  if (!exerciseModalProps) return null;

  const { exercise } = exerciseModalProps;

  return (
    <BaseModal
      isOpen={currentModal === "exercise_detail"}
      onClose={closeModal}
      title={exercise.name}
      icon={Dumbbell}
      maxWidth="max-w-4xl"
      showSecondaryButton={true}
      secondaryButton={{
        label: t("common.close"),
        onClick: closeModal,
      }}
    >
      <div className="space-y-6">
        {/* Badges - Moved from header to content top for better compatibility with BaseModal */}
        <div className="flex flex-wrap gap-2">
          {exercise.type && (
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-lg border border-primary/10 uppercase tracking-wide flex items-center gap-1.5">
              <Activity size={14} />
              {t(`training.exercises.types.${exercise.type}`, exercise.type)}
            </span>
          )}
          {exercise.difficulty && (
            <span className="px-2.5 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-lg border border-secondary/10 uppercase tracking-wide flex items-center gap-1.5">
              <BarChart size={14} />
              {t(
                `training.exercises.difficulty.${exercise.difficulty}`,
                exercise.difficulty,
              )}
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-0 -mx-4 md:-mx-6 border-t border-border">
          {/* Visual Media Column */}
          <div className="w-full md:w-1/2 p-6 space-y-4 border-b md:border-b-0 md:border-r border-border bg-surface-secondary/30">
            {embedUrl ? (
              <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-border">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={exercise.name}
                />
              </div>
            ) : exercise.imageUrl ? (
              <div className="aspect-video bg-surface-secondary rounded-xl overflow-hidden shadow-lg border border-border">
                <img
                  src={exercise.imageUrl}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video bg-surface-secondary rounded-xl flex items-center justify-center border border-border text-text-secondary">
                <div className="flex flex-col items-center gap-2">
                  <PlayCircle size={48} className="opacity-50" />
                  <span className="text-sm">
                    {t("training.exercise.noVideo")}
                  </span>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface rounded-xl border border-border text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-text-secondary mb-1">
                  <Repeat size={14} className="text-primary" />
                  {t("training.exercises.form.recommendedSets")}
                </div>
                <span className="text-lg font-bold text-text-primary">
                  {exercise.recommendedSets || "-"}{" "}
                  <span className="text-sm font-normal text-text-secondary">
                    x
                  </span>{" "}
                  {exercise.recommendedReps || "-"}
                </span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-border text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-text-secondary mb-1">
                  <Clock size={14} className="text-primary" />
                  {t("training.exercises.form.duration")}
                </div>
                <span className="text-lg font-bold text-text-primary">
                  {exercise.durationMinutes
                    ? `${exercise.durationMinutes}m`
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="w-full md:w-1/2 p-6 space-y-6">
            {/* Target Muscles */}
            <div>
              <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-2">
                <Target size={16} className="text-primary" />
                {t("training.exercises.form.targetMuscles")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.targetMuscles?.length ? (
                  exercise.targetMuscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="px-3 py-1 bg-surface-secondary text-text-secondary text-sm rounded-lg border border-border capitalize"
                    >
                      {t(`training.muscles.${muscle}`, muscle)}
                    </span>
                  ))
                ) : (
                  <span className="text-text-secondary text-sm">-</span>
                )}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-2">
                <Dumbbell size={16} className="text-secondary" />
                {t("training.exercises.form.equipment")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.equipment?.length ? (
                  exercise.equipment.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 bg-surface-secondary text-text-secondary text-sm rounded-lg border border-border capitalize"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-text-secondary text-sm">-</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2">
                {t("training.exercises.form.description")}
              </h4>
              <div className="text-sm text-text-secondary leading-relaxed p-4 bg-surface-secondary/50 rounded-xl border border-border">
                {exercise.description || t("training.exercise.noDescription")}
              </div>
            </div>

            {/* Instructions */}
            {exercise.instructions && (
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">
                  {t("training.exercises.form.instructions")}
                </h4>
                <div className="text-sm text-text-secondary leading-relaxed p-4 bg-surface-secondary/50 rounded-xl border border-border whitespace-pre-line">
                  {exercise.instructions}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
