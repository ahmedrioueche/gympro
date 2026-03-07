import { type ProgramHistory } from "@ahmedrioueche/gympro-client";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAbandonProgram } from "../../../../../../../hooks/queries/useTraining";
import { useModalStore } from "../../../../../../../store/modal";

interface SourceConfig {
  label: string;
  colors: string;
  gradient: string;
}

export interface UseActiveProgramCardReturn {
  // State
  program: ProgramHistory["program"] | null;
  progress: ProgramHistory["progress"] | null;
  isPaused: boolean;
  isActive: boolean;
  progressPercent: number;
  completedSets: number;
  totalSets: number;
  totalExercises: number;
  sourceConfig: SourceConfig;

  // Actions
  handleAbandon: () => void;
  isArchiving: boolean;
}

export const useActiveProgramCard = (
  history: ProgramHistory | null | undefined,
): UseActiveProgramCardReturn => {
  const { t } = useTranslation();
  const abandonProgram = useAbandonProgram();
  const { openModal } = useModalStore();

  const isActive =
    !!history && (history.status === "active" || history.status === "paused");

  const program = history?.program ?? null;
  const progress = history?.progress ?? null;
  const isPaused = history?.status === "paused";

  // Calculate expected sets per workout (average across all program days)
  const setsPerWorkout = useMemo(() => {
    if (!program) return 0;
    let totalSets = 0;
    program.days.forEach((day) => {
      day.blocks.forEach((block) => {
        block.exercises.forEach((ex) => {
          totalSets += ex.recommendedSets || 3; // Default to 3 sets if not specified
        });
      });
    });
    // Average sets per day
    return program.days.length > 0 ? totalSets / program.days.length : 0;
  }, [program]);

  // Calculate set-aware progress
  const { progressPercent, completedSets, totalSets } = useMemo(() => {
    if (!progress || !program) {
      return { progressPercent: 0, completedSets: 0, totalSets: 0 };
    }

    // Calculate total workouts based on current program settings
    const durationWeeks = program.durationWeeks || 12;
    const totalWorkouts = program.daysPerWeek * durationWeeks;

    // Total expected sets for the entire program
    const expectedTotalSets = Math.round(setsPerWorkout * totalWorkouts);

    // Count completed sets across all logged sessions (includes extra sets)
    let completed = 0;
    progress.dayLogs?.forEach((dayLog) => {
      dayLog.exercises?.forEach((ex) => {
        ex.sets?.forEach((set) => {
          if (set.completed) {
            completed++;
          }
        });
      });
    });

    // Progress % is capped - extra sets don't inflate the percentage
    const setsForProgress = Math.min(completed, expectedTotalSets);
    const percent =
      expectedTotalSets > 0
        ? Math.round((setsForProgress / expectedTotalSets) * 100)
        : 0;

    return {
      progressPercent: percent,
      completedSets: completed, // Actual count (can exceed total)
      totalSets: expectedTotalSets,
    };
  }, [progress, program, setsPerWorkout]);

  // Count total exercises across all days
  const totalExercises = useMemo(() => {
    if (!program) return 0;
    return program.days.reduce(
      (acc, day) =>
        acc +
        day.blocks.reduce(
          (blockAcc, block) => blockAcc + block.exercises.length,
          0,
        ),
      0,
    );
  }, [program]);

  // Get source styling config
  const sourceConfig = useMemo((): SourceConfig => {
    switch (program?.creationType) {
      case "coach":
        return {
          label: t("training.programs.card.source.coach"),
          colors: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          gradient: "from-blue-500 to-cyan-500",
        };
      case "template":
        return {
          label: t("training.programs.card.source.template"),
          colors: "bg-purple-500/10 text-purple-500 border-purple-500/20",
          gradient: "from-purple-500 to-pink-500",
        };
      default:
        return {
          label: t("training.programs.card.source.member"),
          colors: "bg-gray-500/10 text-gray-400 border-gray-500/20",
          gradient: "from-purple-500 to-cyan-500",
        };
    }
  }, [program?.creationType, t]);

  const handleAbandon = () => {
    openModal("confirm", {
      title: t("training.page.archive.title"),
      text: t("training.page.archive.desc"),
      confirmVariant: "danger",
      confirmText: t("training.page.archive.confirm"),
      onConfirm: () => abandonProgram.mutate(),
    });
  };

  return {
    program,
    progress,
    isPaused,
    isActive,
    progressPercent,
    completedSets,
    totalSets,
    totalExercises,
    sourceConfig,
    handleAbandon,
    isArchiving: abandonProgram.isPending,
  };
};
