import {
  Activity,
  BarChart,
  Clock,
  Dumbbell,
  PlayCircle,
  Repeat,
  Target,
  Timer,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import { useModalStore } from "../../../store/modal";
import { useModalLayer } from "../../../hooks/useModalLayer";
import { getEmbedUrl } from "../../../utils/helper";

const StatChip = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Repeat;
  label: string;
  value: string;
}) => (
  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface min-w-0">
    <Icon size={14} className="text-primary shrink-0" />
    <div className="min-w-0">
      <p className="text-[10px] uppercase font-semibold text-text-secondary truncate">
        {label}
      </p>
      <p className="text-sm font-bold text-text-primary leading-tight">{value}</p>
    </div>
  </div>
);

export default function ExerciseDetailModal() {
  const { t } = useTranslation();
  const { closeModal, exerciseModalProps } = useModalStore();
  const { isOpen, zIndex } = useModalLayer("exercise_detail");

  const embedUrl = getEmbedUrl(exerciseModalProps?.exercise.videoUrl);

  if (!exerciseModalProps) return null;

  const { exercise } = exerciseModalProps;

  const hasSetsReps = Boolean(
    exercise.recommendedSets || exercise.recommendedReps,
  );
  const setsRepsLabel = [
    exercise.recommendedSets ? `${exercise.recommendedSets}` : null,
    exercise.recommendedReps ? `${exercise.recommendedReps}` : null,
  ]
    .filter(Boolean)
    .join(" × ");
  const hasStats =
    hasSetsReps ||
    Boolean(exercise.durationMinutes) ||
    Boolean(exercise.restTime);
  const hasBadges = Boolean(exercise.type || exercise.difficulty);
  const hasMuscles = (exercise.targetMuscles?.length ?? 0) > 0;
  const hasEquipment = (exercise.equipment?.length ?? 0) > 0;
  const hasMetaRow = hasBadges || hasStats;
  const hasTagsRow = hasMuscles || hasEquipment;

  return (
    <BaseModal
      isOpen={isOpen}
      zIndex={zIndex}
      onClose={closeModal}
      title={exercise.name}
      icon={Dumbbell}
      maxWidth="max-w-4xl"
      showSecondaryButton={true}
      secondaryButton={{
        label: t("common.close"),
        onClick: closeModal,
        icon: X,
      }}
    >
      <div className="space-y-4">
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
              <span className="text-sm">{t("training.exercise.noVideo")}</span>
            </div>
          </div>
        )}

        {hasMetaRow && (
          <div className="flex flex-col md:flex-row md:flex-wrap md:items-start gap-3">
            {hasBadges && (
              <div className="flex flex-wrap gap-2 md:shrink-0">
                {exercise.type && (
                  <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-lg border border-primary/10 uppercase tracking-wide inline-flex items-center gap-1.5">
                    <Activity size={14} />
                    {t(`training.exercises.types.${exercise.type}`, exercise.type)}
                  </span>
                )}
                {exercise.difficulty && (
                  <span className="px-2.5 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-lg border border-secondary/10 uppercase tracking-wide inline-flex items-center gap-1.5">
                    <BarChart size={14} />
                    {t(
                      `training.exercises.difficulty.${exercise.difficulty}`,
                      exercise.difficulty,
                    )}
                  </span>
                )}
              </div>
            )}

            {hasStats && (
              <div className="flex flex-wrap gap-2 flex-1 min-w-0">
                {hasSetsReps && (
                  <StatChip
                    icon={Repeat}
                    label={t("training.exercises.form.recommendedSets")}
                    value={setsRepsLabel}
                  />
                )}
                {exercise.durationMinutes ? (
                  <StatChip
                    icon={Clock}
                    label={t("training.exercises.form.duration")}
                    value={`${exercise.durationMinutes}m`}
                  />
                ) : null}
                {exercise.restTime ? (
                  <StatChip
                    icon={Timer}
                    label={t("training.exercises.form.restTime", "Rest (s)")}
                    value={`${exercise.restTime}s`}
                  />
                ) : null}
              </div>
            )}
          </div>
        )}

        {hasTagsRow && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hasMuscles && (
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-2">
                  <Target size={16} className="text-primary shrink-0" />
                  {t("training.exercises.form.targetMuscles")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {exercise.targetMuscles!.map((muscle) => (
                    <span
                      key={muscle}
                      className="px-3 py-1 bg-surface-secondary text-text-secondary text-sm rounded-lg border border-border capitalize"
                    >
                      {t(`training.muscles.${muscle}`, muscle)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hasEquipment && (
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-2">
                  <Dumbbell size={16} className="text-secondary shrink-0" />
                  {t("training.exercises.form.equipment")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {exercise.equipment!.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 bg-surface-secondary text-text-secondary text-sm rounded-lg border border-border capitalize"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {exercise.description && (
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              {t("training.exercises.form.description")}
            </h4>
            <div className="text-sm text-text-secondary leading-relaxed p-4 bg-surface-secondary/50 rounded-xl border border-border">
              {exercise.description}
            </div>
          </div>
        )}

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
    </BaseModal>
  );
}
