import {
  type ProgramDayProgress,
  type TrainingProgram,
} from "@ahmedrioueche/gympro-client";
import { Calendar, ChevronDown, Edit } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/ui/Button";
import { formatDate } from "../../../../../../../utils/date";
import { SessionExerciseList } from "./SessionExerciseList";

interface SessionItemProps {
  session: ProgramDayProgress;
  program: TrainingProgram;
  onEdit?: () => void;
}

export const SessionItem = ({ session, program, onEdit }: SessionItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-all">
      <div className="flex flex-col sm:flex-row">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 p-4 flex justify-between items-center hover:bg-background-secondary/50 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Calendar size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary capitalize">
                {session.dayName}
              </h4>
              <span className="text-xs text-text-secondary">
                {formatDate(session.date)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
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

        {/* Action Buttons (Edit) */}
        {onEdit && (
          <div className="flex items-center px-4 pb-4 sm:pb-0 sm:border-l border-border bg-transparent">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-[42px] text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {t("training.page.sessionList.editSession")}
              <Edit className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      <div
        className={`bg-background-secondary border-t border-border transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-4 space-y-4">
          <SessionExerciseList
            exercises={session.exercises}
            program={program}
            notes={session.notes}
          />
        </div>
      </div>
    </div>
  );
};
