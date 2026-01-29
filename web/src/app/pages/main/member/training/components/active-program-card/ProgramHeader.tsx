import type { TrainingProgram } from "@ahmedrioueche/gympro-client";
import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProgramHeaderProps {
  program: TrainingProgram;
  isPaused: boolean;
  sourceConfig: {
    label: string;
    colors: string;
    gradient: string;
  };
}

export const ProgramHeader = ({
  program,
  isPaused,
  sourceConfig,
}: ProgramHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-4">
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${sourceConfig.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
      >
        <Trophy className="w-8 h-8 text-white" />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold tracking-wider text-primary uppercase">
            {t("training.activeProgram.title")}
          </span>
          <StatusBadge isPaused={isPaused} />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2 line-clamp-1">
          {program.name}
        </h2>
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border flex items-center gap-1.5 ${sourceConfig.colors}`}
          >
            {sourceConfig.label}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium bg-background-secondary text-text-secondary rounded-lg border border-border capitalize">
            {program.experience}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg border border-primary/20 capitalize">
            {program.purpose.replace(/_/g, " ")}
          </span>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ isPaused }: { isPaused: boolean }) => {
  const { t } = useTranslation();

  return (
    <span
      className={`px-2 py-0.5 text-[10px] font-bold rounded-full border flex items-center gap-1 ${
        isPaused
          ? "bg-orange-500/15 text-orange-500 border-orange-500/30"
          : "bg-green-500/15 text-green-500 border-green-500/30 animate-pulse"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isPaused ? "bg-orange-500" : "bg-green-500"
        }`}
      />
      {isPaused
        ? t("training.programs.card.paused")
        : t("training.programs.card.active")}
    </span>
  );
};
