import { type TrainingProgram } from "@ahmedrioueche/gympro-client";
import {
  Calendar,
  Check,
  ChevronRight,
  Dumbbell,
  Target,
  User,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProgramCardProps {
  program: TrainingProgram;
  isActive?: boolean;
  onUse?: (programId: string) => void;
  onViewDetails?: (program: TrainingProgram) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (program: TrainingProgram) => void;
}

export const ProgramCard = ({
  program,
  isActive,
  onUse,
  onViewDetails,
  selectable,
  selected,
  onSelect,
}: ProgramCardProps) => {
  const { t } = useTranslation();

  const getSourceConfig = () => {
    switch (program.creationType) {
      case "coach":
        return {
          icon: User,
          label: t("training.programs.card.source.coach"),
          colors: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          gradient: "from-blue-500 to-cyan-500",
        };
      case "template":
        return {
          icon: Zap,
          label: t("training.programs.card.source.template"),
          colors: "bg-purple-500/10 text-purple-500 border-purple-500/20",
          gradient: "from-purple-500 to-pink-500",
        };
      default:
        return {
          icon: User,
          label: t("training.programs.card.source.member"),
          colors: "bg-gray-500/10 text-gray-400 border-gray-500/20",
          gradient: "from-purple-500 to-cyan-500",
        };
    }
  };

  const sourceConfig = getSourceConfig();
  const SourceIcon = sourceConfig.icon;

  const totalExercises = program.days.reduce(
    (acc, day) =>
      acc +
      day.blocks.reduce(
        (blockAcc, block) => blockAcc + block.exercises.length,
        0,
      ),
    0,
  );

  return (
    <div
      onClick={() => {
        if (selectable && onSelect) {
          onSelect(program);
        } else if (onViewDetails) {
          onViewDetails(program);
        }
      }}
      className={`group cursor-pointer relative bg-surface border transition-all duration-300 rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl ${
        selected
          ? "border-primary ring-1 ring-primary"
          : "border-border hover:border-primary/40"
      }`}
    >
      {/* Gradient accent line */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${sourceConfig.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
      />

      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${sourceConfig.gradient} flex items-center justify-center shadow-lg flex-shrink-0 transition-transform duration-300`}
            >
              <Dumbbell className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>

            {/* Title & Badges */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1 mb-2">
                {program.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border flex items-center gap-1.5 ${sourceConfig.colors}`}
                >
                  <SourceIcon size={12} /> {sourceConfig.label}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium bg-background-secondary text-text-secondary rounded-lg border border-border capitalize">
                  {program.experience}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg border border-primary/20 capitalize line-clamp-1">
                  {program.purpose.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Active Badge */}
          {isActive && (
            <span className="px-3 py-1.5 text-xs font-bold bg-green-500/15 text-green-500 rounded-full border border-green-500/30 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {t("training.programs.card.active")}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary line-clamp-2 mb-5 leading-relaxed">
          {program.description || t("training.programs.card.noDescription")}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-5">
          <div className="bg-background-secondary/40 rounded-xl p-2 md:p-3 text-center border border-border/50 hover:border-primary/20 transition-colors">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1">
              <Calendar size={14} className="text-primary md:w-4 md:h-4" />
            </div>
            <span className="text-base md:text-lg font-bold text-text-primary">
              {program.daysPerWeek}
            </span>
            <p className="text-[10px] md:text-xs text-text-secondary mt-0.5">
              {t("training.programs.card.days")}
            </p>
          </div>
          <div className="bg-background-secondary/40 rounded-xl p-2 md:p-3 text-center border border-border/50 hover:border-primary/20 transition-colors">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1">
              <Target size={14} className="text-primary md:w-4 md:h-4" />
            </div>
            <span className="text-base md:text-lg font-bold text-text-primary">
              {program.days.length}
            </span>
            <p className="text-[10px] md:text-xs text-text-secondary mt-0.5">
              {t("training.programs.card.sessions")}
            </p>
          </div>
          <div className="bg-background-secondary/40 rounded-xl p-2 md:p-3 text-center border border-border/50 hover:border-primary/20 transition-colors">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1">
              <Dumbbell size={14} className="text-primary md:w-4 md:h-4" />
            </div>
            <span className="text-base md:text-lg font-bold text-text-primary">
              {totalExercises}
            </span>
            <p className="text-[10px] md:text-xs text-text-secondary mt-0.5">
              {t("training.programs.card.exercises")}
            </p>
          </div>
        </div>

        {/* Actions */}
        {/* Actions */}
        {!selectable ? (
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.(program);
              }}
              className="flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-xl text-xs md:text-sm font-semibold bg-background-secondary text-text-primary hover:bg-background-secondary transition-all border border-border hover:border-primary/30"
            >
              {t("training.programs.card.view")}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isActive && onUse) onUse(program._id!);
              }}
              disabled={isActive}
              className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-xl text-xs md:text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 group/btn ${
                isActive
                  ? "bg-green-500/10 text-green-500 border border-green-500/30 cursor-not-allowed shadow-none"
                  : "text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-primary/20 hover:shadow-xl"
              }`}
            >
              {isActive ? (
                <>
                  <Check size={18} />
                  {t("training.programs.card.selected")}
                </>
              ) : (
                <>
                  {t("training.programs.card.start")}
                  <ChevronRight
                    size={18}
                    className="group-hover/btn:translate-x-0.5 transition-transform"
                  />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selected
                  ? "bg-primary border-primary"
                  : "border-border group-hover:border-primary"
              }`}
            >
              {selected && <Check size={14} className="text-white" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
