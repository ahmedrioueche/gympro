import { type ProgramHistory } from "@ahmedrioueche/gympro-client";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useActiveProgram,
  usePauseProgram,
  useResumeProgram,
} from "../../../../../../../hooks/queries/useTraining";
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
  handlePause: () => void;
  handleResume: () => void;
  isPausingOrResuming: boolean;
}

export const useActiveProgramCard = (
  history: ProgramHistory | null | undefined,
): UseActiveProgramCardReturn => {
  const { t } = useTranslation();
  const pauseProgram = usePauseProgram();
  const resumeProgram = useResumeProgram();
  const { openModal } = useModalStore();
  const { data: activeProgram } = useActiveProgram();

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

  const handlePause = () => {
    openModal("confirm", {
      title: t("training.page.pause.title"),
      text: t("training.page.pause.desc"),
      confirmVariant: "danger",
      confirmText: t("training.page.pause.confirm"),
      onConfirm: () => pauseProgram.mutate(),
    });
  };

  const handleResume = () => {
    if (activeProgram?.status === "active") {
      toast.error(t("training.page.resume.error"));
      return;
    }

    openModal("confirm", {
      title: t("training.page.resume.title"),
      text: t("training.page.resume.desc"),
      confirmVariant: "primary",
      confirmText: t("training.page.resume.confirm"),
      onConfirm: () => resumeProgram.mutate(),
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
    handlePause,
    handleResume,
    isPausingOrResuming: pauseProgram.isPending || resumeProgram.isPending,
  };
};
