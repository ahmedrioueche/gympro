import { type ProgramHistory } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../../../components/ui/NoData";
import { PausedOverlay } from "./PausedOverlay";
import { ProgramHeader } from "./ProgramHeader";
import { ProgramStats } from "./ProgramStats";
import { ProgressSection } from "./ProgressSection";
import { useActiveProgramCard } from "./useActiveProgramCard";

interface ActiveProgramCardProps {
  history: ProgramHistory | null | undefined;
  onLogSession: () => void;
}

export const ActiveProgramCard = ({
  history,
  onLogSession,
}: ActiveProgramCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    program,
    progress,
    isPaused,
    isActive,
    progressPercent,
    completedSets,
    totalSets,
    totalExercises,
    sourceConfig,
    handlePause,
    handleResume,
  } = useActiveProgramCard(history);

  // Show empty state if no active/paused program
  if (!isActive || !program || !progress) {
    return (
      <NoData
        emoji="🏋️"
        title={t("training.activeProgram.noActive")}
        description={t("training.activeProgram.noActiveDesc")}
        actionButton={{
          label: t("training.activeProgram.browse"),
          onClick: () => navigate({ to: "/member/programs" }),
        }}
      />
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
      {/* Gradient accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${sourceConfig.gradient}`}
      />

      {/* Paused overlay */}
      {isPaused && <PausedOverlay onResume={handleResume} />}

      <div className="p-5 md:p-6 flex flex-col gap-6">
        {/* Top Section: Info & Stats */}
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <ProgramHeader
            program={program}
            isPaused={isPaused}
            sourceConfig={sourceConfig}
          />
          <ProgramStats
            daysPerWeek={program.daysPerWeek}
            totalExercises={totalExercises}
            durationWeeks={program.durationWeeks}
          />
        </div>

        {/* Bottom Section: Progress & Action */}
        <ProgressSection
          progressPercent={progressPercent}
          completedSets={completedSets}
          totalSets={totalSets}
          gradient={sourceConfig.gradient}
          isPaused={isPaused}
          onPause={handlePause}
          onLogSession={onLogSession}
        />
      </div>
    </div>
  );
};
