import { type ProgramHistory } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, ChevronRight, Pause, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useActiveProgram,
  usePauseProgram,
  useResumeProgram,
} from "../../../../../../hooks/queries/useTraining";
import { useModalStore } from "../../../../../../store/modal";

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
  const pauseProgram = usePauseProgram();
  const resumeProgram = useResumeProgram();
  const { openModal } = useModalStore();
  const { data: activeProgram } = useActiveProgram();

  if (
    !history ||
    (history.status !== "active" && history.status !== "paused")
  ) {
    return (
      <div className="bg-gradient-to-br from-background-secondary to-background-secondary rounded-2xl p-6 border border-border text-center space-y-4">
        <div className="inline-flex p-3 bg-background rounded-full mb-2">
          <Trophy size={32} className="text-text-secondary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-text-primary">
            {t("training.activeProgram.noActive")}
          </h3>
          <p className="text-text-secondary">
            {t("training.activeProgram.noActiveDesc")}
          </p>
        </div>
        <button
          onClick={() => navigate({ to: "/member/programs" })}
          className="px-6 py-2 bg-primary text-white rounded-xl font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all inline-flex items-center gap-2"
        >
          {t("training.activeProgram.browse")} <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  const { program, progress } = history;
  const isPaused = history.status === "paused";
  const progressPercent = Math.round(
    (progress.daysCompleted / progress.totalDays) * 100
  );

  const getSourceConfig = () => {
    switch (program.creationType) {
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
  };

  const sourceConfig = getSourceConfig();
  const totalExercises = program.days.reduce(
    (acc, day) => acc + day.exercises.length,
    0
  );

  return (
    <div className="bg-surface border border-border rounded-2xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
      {/* Gradient accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${sourceConfig.gradient}`}
      />

      {isPaused && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="bg-surface border border-border rounded-xl p-4 shadow-xl text-center max-w-xs mx-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-3">
              <Pause size={24} />
            </div>
            <h3 className="font-bold text-text-primary mb-1">
              {t("training.programs.card.paused")}
            </h3>
            <p className="text-xs text-text-secondary mb-4">
              {t("training.programs.card.pausedDesc")}
            </p>
            <button
              onClick={() => {
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
              }}
              className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {t("training.programs.card.resume")}
            </button>
          </div>
        </div>
      )}

      <div className="p-5 md:p-6 flex flex-col gap-6">
        {/* Top Section: Info & Stats */}
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          {/* Left: Program Info */}
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

          {/* Right: Stats (Days/Exercises) */}
          <div className="flex gap-3 md:self-start">
            <div className="bg-background-secondary/50 rounded-xl p-3 text-center border border-border/50 min-w-[80px]">
              <span className="text-lg font-bold text-text-primary">
                {program.daysPerWeek}
              </span>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary mt-0.5">
                {t("training.programs.card.days")}
              </p>
            </div>
            <div className="bg-background-secondary/50 rounded-xl p-3 text-center border border-border/50 min-w-[80px]">
              <span className="text-lg font-bold text-text-primary">
                {totalExercises}
              </span>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary mt-0.5">
                {t("training.programs.card.exercises")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Progress & Action */}
        <div className="flex flex-col md:flex-row items-end gap-4 bg-background-secondary/30 rounded-xl p-4 border border-border/50">
          {/* Progress Bar */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-2xl font-bold text-primary">
                  {progressPercent}%
                </span>
                <span className="text-text-secondary text-sm ml-1">
                  {t("training.activeProgram.progress")}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-text-primary">
                  {progress.daysCompleted}
                </span>
                <span className="text-text-secondary text-xs">
                  {" / "}
                  {progress.totalDays}{" "}
                  {t("training.activeProgram.workoutsComplete")}
                </span>
              </div>
            </div>
            <div className="h-3 bg-background-secondary rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${sourceConfig.gradient} transition-all duration-500 relative`}
                style={{ width: `${progressPercent}%` }}
              >
                {!isPaused && (
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isPaused && (
              <button
                onClick={() =>
                  openModal("confirm", {
                    title: t("training.page.pause.title"),
                    text: t("training.page.pause.desc"),
                    confirmVariant: "danger",
                    confirmText: t("training.page.pause.confirm"),
                    onConfirm: () => pauseProgram.mutate(),
                  })
                }
                className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors"
                title={t("training.programs.card.pause")}
              >
                <Pause size={20} />
              </button>
            )}

            <button
              onClick={onLogSession}
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-[42px] text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPaused}
            >
              <Calendar size={18} />
              {t("training.activeProgram.logWorkout")}
              <ChevronRight
                size={18}
                className="group-hover/btn:translate-x-0.5 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
