import { useTranslation } from "react-i18next";

interface ProgramStatsProps {
  daysPerWeek: number;
  totalExercises: number;
  durationWeeks?: number;
}

export const ProgramStats = ({
  daysPerWeek,
  totalExercises,
  durationWeeks,
}: ProgramStatsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 md:self-start">
      <StatCard value={daysPerWeek} label={t("training.programs.card.days")} />
      <StatCard
        value={totalExercises}
        label={t("training.programs.card.exercises")}
      />
      {durationWeeks && (
        <StatCard value={durationWeeks} label={t("common.weeks", "Weeks")} />
      )}
    </div>
  );
};

interface StatCardProps {
  value: number;
  label: string;
}

const StatCard = ({ value, label }: StatCardProps) => (
  <div className="bg-background-secondary/50 rounded-xl p-3 text-center border border-border/50 min-w-[80px]">
    <span className="text-lg font-bold text-text-primary">{value}</span>
    <p className="text-[10px] uppercase tracking-wider text-text-secondary mt-0.5">
      {label}
    </p>
  </div>
);
