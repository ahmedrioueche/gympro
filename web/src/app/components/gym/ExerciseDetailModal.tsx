import {
  Activity,
  BarChart,
  Clock,
  Dumbbell,
  PlayCircle,
  Repeat,
  Target,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../store/modal";
import { getEmbedUrl } from "../../../utils/helper";

export const ExerciseDetailModal = ({}) => {
  const { t } = useTranslation();
  const { currentModal, closeModal, exerciseModalProps } = useModalStore();

  const embedUrl = getEmbedUrl(exerciseModalProps?.exercise.videoUrl);

  if (
    !currentModal ||
    currentModal !== "exercise_detail" ||
    !exerciseModalProps
  )
    return null;

  return (
    <div
      onClick={() => closeModal()}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl shadow-2xl max-w-4xl w-full border-2 border-primary/30 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Dumbbell className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {exerciseModalProps.exercise.name}
                </h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  {exerciseModalProps.exercise.type && (
                    <span className="px-2 py-0.5 bg-black/30 text-white text-xs font-medium rounded-lg border border-white/10 uppercase tracking-wide flex items-center gap-1">
                      <Activity size={12} />
                      {t(
                        `training.exercises.types.${exerciseModalProps.exercise.type}`,
                        exerciseModalProps.exercise.type
                      )}
                    </span>
                  )}
                  {exerciseModalProps?.exercise.difficulty && (
                    <span className="px-2 py-0.5 bg-black/30 text-white text-xs font-medium rounded-lg border border-white/10 uppercase tracking-wide flex items-center gap-1">
                      <BarChart size={12} />
                      {t(
                        `training.exercises.difficulty.${exerciseModalProps?.exercise.difficulty}`,
                        exerciseModalProps?.exercise.difficulty
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => closeModal()}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
          <div className="flex flex-col md:flex-row">
            {/* Visual Media Column */}
            <div className="w-full md:w-1/2 p-6 space-y-4 border-b md:border-b-0 md:border-r border-border bg-surface-secondary/30">
              {embedUrl ? (
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-border">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={exerciseModalProps?.exercise.name}
                  />
                </div>
              ) : exerciseModalProps.exercise.imageUrl ? (
                <div className="aspect-video bg-surface-secondary rounded-xl overflow-hidden shadow-lg border border-border">
                  <img
                    src={exerciseModalProps.exercise.imageUrl}
                    alt={exerciseModalProps.exercise.name}
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
                    {exerciseModalProps.exercise.recommendedSets || "-"}{" "}
                    <span className="text-sm font-normal text-text-secondary">
                      x
                    </span>{" "}
                    {exerciseModalProps.exercise.recommendedReps || "-"}
                  </span>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-border text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-text-secondary mb-1">
                    <Clock size={14} className="text-primary" />
                    {t("training.exercises.form.duration")}
                  </div>
                  <span className="text-lg font-bold text-text-primary">
                    {exerciseModalProps.exercise.durationMinutes
                      ? `${exerciseModalProps.exercise.durationMinutes}m`
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
                  {exerciseModalProps.exercise.targetMuscles?.length ? (
                    exerciseModalProps.exercise.targetMuscles.map((muscle) => (
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
                  {exerciseModalProps.exercise.equipment?.length ? (
                    exerciseModalProps.exercise.equipment.map((item) => (
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
                <p className="text-sm text-text-secondary leading-relaxed p-4 bg-surface-secondary/50 rounded-xl border border-border">
                  {exerciseModalProps.exercise.description ||
                    t("training.exercise.noDescription")}
                </p>
              </div>

              {/* Instructions */}
              {exerciseModalProps.exercise.instructions && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">
                    {t("training.exercises.form.instructions")}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed p-4 bg-surface-secondary/50 rounded-xl border border-border whitespace-pre-line">
                    {exerciseModalProps.exercise.instructions}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-4 bg-surface-s0.
        0.
        .
        econdary border-t border-border flex-shrink-0 flex justify-end"
        >
          <button
            onClick={() => closeModal()}
            className="px-8 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};
