import { Calendar, ChevronRight, Pause } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProgressSectionProps {
  progressPercent: number;
  completedSets: number;
  totalSets: number;
  gradient: string;
  isPaused: boolean;
  onPause: () => void;
  onLogSession: () => void;
}

export const ProgressSection = ({
  progressPercent,
  completedSets,
  totalSets,
  gradient,
  isPaused,
  onPause,
  onLogSession,
}: ProgressSectionProps) => {
  const { t } = useTranslation();

  return (
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
            <span className="font-bold text-text-primary">{completedSets}</span>
            <span className="text-text-secondary text-xs">
              {" / "}
              {totalSets}{" "}
              {t("training.activeProgram.setsComplete", "sets complete")}
            </span>
          </div>
        </div>
        <div className="h-3 bg-background-secondary rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500 relative`}
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
            onClick={onPause}
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
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};
