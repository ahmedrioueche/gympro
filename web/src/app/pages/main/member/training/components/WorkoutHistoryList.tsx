import {
  type ExerciseProgress,
  type TrainingProgram,
} from "@ahmedrioueche/gympro-client";
import { Calendar, ChevronDown, Dumbbell, Edit2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface WorkoutSession {
  id: string;
  date: string;
  dayName: string;
  exercises: ExerciseProgress[];
  type: "program" | "custom";
  programName?: string;
  notes?: string;
}

interface WorkoutHistoryListProps {
  programSessions: any[];
  customWorkouts: any[];
  activeProgram?: TrainingProgram | null;
  onEditCustomWorkout: (workout: any) => void;
}

export const WorkoutHistoryList = ({
  programSessions,
  customWorkouts,
  activeProgram,
  onEditCustomWorkout,
}: WorkoutHistoryListProps) => {
  const { t } = useTranslation();

  // Combine and sort all workouts by date
  const allWorkouts: WorkoutSession[] = [
    ...programSessions.map((session) => ({
      id: `program-${session.date}-${session.dayName}`,
      date: session.date,
      dayName: session.dayName,
      exercises: session.exercises,
      type: "program" as const,
      programName: activeProgram?.name,
      notes: session.notes,
    })),
    ...customWorkouts.map((workout) => ({
      id: `custom-${workout.date}-${workout.dayName}`,
      date: workout.date,
      dayName: workout.dayName,
      exercises: workout.exercises,
      type: "custom" as const,
      notes: workout.notes,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (allWorkouts.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <Dumbbell size={48} className="mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium mb-2">
          {t("training.page.noWorkouts", "No workouts logged yet")}
        </p>
        <p className="text-sm">
          {t(
            "training.page.noWorkoutsDesc",
            "Start logging your workouts to track your progress"
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allWorkouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          activeProgram={activeProgram}
          onEdit={
            workout.type === "custom"
              ? () => onEditCustomWorkout(workout)
              : undefined
          }
        />
      ))}
    </div>
  );
};

interface WorkoutCardProps {
  workout: WorkoutSession;
  activeProgram?: TrainingProgram | null;
  onEdit?: () => void;
}

const WorkoutCard = ({ workout, activeProgram, onEdit }: WorkoutCardProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t("common.today", "Today");
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t("common.yesterday", "Yesterday");
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  const getExerciseName = (exercise: any): string => {
    // For custom workouts, use the exerciseName property
    if (exercise.exerciseName) {
      return exercise.exerciseName;
    }

    // For program workouts, look up in active program
    if (!activeProgram) return t("training.logSession.unknownExercise");

    for (const day of activeProgram.days) {
      const ex = day.exercises.find((e) => e._id === exercise.exerciseId);
      if (ex) return ex.name;
    }
    return t("training.logSession.unknownExercise");
  };

  const totalVolume = workout.exercises.reduce(
    (sum, ex) =>
      sum + (ex.setsDone || 0) * (ex.repsDone || 0) * (ex.weightKg || 0),
    0
  );

  return (
    <div className="bg-background-secondary border border-border rounded-xl overflow-hidden transition-all hover:border-primary/30">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex justify-between items-center hover:bg-background-tertiary/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              workout.type === "program"
                ? "bg-primary/10 text-primary"
                : "bg-purple-500/10 text-purple-500"
            }`}
          >
            <Dumbbell size={20} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-text-primary capitalize">
                {workout.dayName}
              </h4>
              {workout.type === "custom" && (
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-500/10 text-purple-500 rounded-full border border-purple-500/20">
                  {t("training.page.custom", "Custom")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
              <Calendar size={12} />
              <span>{formatDate(workout.date)}</span>
              {workout.programName && (
                <>
                  <span>•</span>
                  <span>{workout.programName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-text-primary">
              {workout.exercises.length}{" "}
              {t("training.page.exercises", "exercises")}
            </div>
            {totalVolume > 0 && (
              <div className="text-xs text-text-secondary">
                {totalVolume.toFixed(0)} kg {t("training.page.volume", "total")}
              </div>
            )}
          </div>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Edit2 size={16} />
            </button>
          )}
          <ChevronDown
            size={20}
            className={`text-text-secondary transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Expanded Content */}
      <div
        className={`border-t border-border transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-4 space-y-3 bg-background">
          {workout.exercises.map((ex, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-sm p-3 bg-surface rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <span className="font-medium text-text-primary">
                  {getExerciseName(ex)}
                </span>
              </div>
              <div className="text-text-secondary font-mono text-xs">
                {ex.setsDone || "-"} × {ex.repsDone || "-"} @{" "}
                {ex.weightKg || "-"}kg
              </div>
            </div>
          ))}
          {workout.notes && (
            <div className="mt-3 pt-3 border-t border-dashed border-border">
              <p className="text-xs text-text-secondary italic">
                "{workout.notes}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
