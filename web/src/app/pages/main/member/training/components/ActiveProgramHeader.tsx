import { type ProgramHistory } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, ChevronRight, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ActiveProgramHeaderProps {
  history: ProgramHistory | null | undefined;
  onLogSession: () => void;
}

export const ActiveProgramHeader = ({
  history,
  onLogSession,
}: ActiveProgramHeaderProps) => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  if (!history || history.status !== "active") {
    return (
      <div className="bg-gradient-to-br from-background-secondary to-background-tertiary rounded-2xl p-6 border border-border text-center space-y-4">
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
  const progressPercent = Math.round(
    (progress.daysCompleted / progress.totalDays) * 100
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Trophy size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-bold tracking-wider text-primary uppercase mb-1 block">
              {t("training.activeProgram.title")}
            </span>
            <h2 className="text-2xl font-bold text-text-primary">
              {program.name}
            </h2>
            <p className="text-text-secondary capitalize">
              {program.experience} •{" "}
              {t("training.activeProgram.daysPerWeek", {
                count: program.daysPerWeek,
              })}
            </p>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-3xl font-bold text-primary">
              {progress.daysCompleted}
            </span>
            <span className="text-text-secondary text-sm block">
              {t("training.activeProgram.workoutsComplete")}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">
              {t("training.activeProgram.progress")}
            </span>
            <span className="font-medium text-text-primary">
              {progressPercent}%
            </span>
          </div>
          <div className="h-3 bg-background-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onLogSession}
            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <Calendar size={18} />
            {t("training.activeProgram.logWorkout")}
          </button>
          <button
            onClick={() => {}} // TODO: View Schedule/Edit
            className="px-4 py-3 bg-background-secondary text-text-primary rounded-xl font-medium border border-border hover:bg-background-tertiary transition-all"
          >
            {t("training.activeProgram.schedule")}
          </button>
        </div>
      </div>
    </div>
  );
};
