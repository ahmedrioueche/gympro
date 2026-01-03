import {
  type ProgramDayProgress,
  type TrainingProgram,
} from "@ahmedrioueche/gympro-client";
import { Calendar, ChevronDown, Dumbbell } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Helper for date formatting
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

interface SessionListProps {
  sessions: ProgramDayProgress[];
  program: TrainingProgram;
}

export const SessionList = ({ sessions, program }: SessionListProps) => {
  const { t } = useTranslation();
  if (!sessions?.length) {
    return (
      <div className="text-center py-8 text-text-secondary italic">
        {t("training.logSession.noSessions")}
      </div>
    );
  }

  // Sort by date desc
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedSessions.map((session, index) => (
        <SessionItem key={index} session={session} program={program} />
      ))}
    </div>
  );
};

const SessionItem = ({
  session,
  program,
}: {
  session: ProgramDayProgress;
  program: TrainingProgram;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  // Helper to find exercise name
  const getExerciseName = (id: string) => {
    for (const day of program.days) {
      const ex = day.exercises.find((e) => e._id === id);
      if (ex) return ex.name;
    }
    return t("training.logSession.unknownExercise");
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex justify-between items-center hover:bg-background-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Calendar size={20} />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-text-primary capitalize">
              {session.dayName}
            </h4>
            <span className="text-xs text-text-secondary">
              {formatDate(session.date)}
            </span>
          </div>
        </div>
        <div className="text-right flex items-center gap-4">
          <div className="hidden sm:block">
            <span className="text-sm font-medium text-text-primary block">
              {t("training.programs.details.exercisesCount", {
                count: session.exercises.length,
              })}
            </span>
          </div>
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
        className={`bg-background-secondary border-t border-border transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-4 space-y-3">
          {session.exercises.map((ex, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-sm"
            >
              <div className="flex items-center gap-2">
                <Dumbbell size={14} className="text-primary" />
                <span className="font-medium text-text-primary max-w-[150px] truncate">
                  {getExerciseName(ex.exerciseId)}
                </span>
              </div>
              <div className="text-text-secondary">
                {ex.setsDone || "-"} {t("training.logSession.sets")} x{" "}
                {ex.repsDone || "-"} {t("training.logSession.reps")} @{" "}
                {ex.weightKg || "-"} {t("training.logSession.kg")}
              </div>
            </div>
          ))}
          {session.notes && (
            <div className="mt-2 pt-2 border-t border-dashed border-border text-xs text-text-secondary italic">
              "{session.notes}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
