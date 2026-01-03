import {
  type CreateExerciseDto,
  type CreateProgramDayDto,
} from "@ahmedrioueche/gympro-client";
import { Calendar, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../../components/ui/InputField";
import { ExerciseForm } from "../ExerciseForm";
import { ExerciseItem } from "./ExerciseItem";

interface DayCardProps {
  day: CreateProgramDayDto;
  dayIndex: number;
  isEditMode: boolean;
  onDayNameChange: (name: string) => void;
  onAddExercise: () => void;
  onExerciseUpdate: (
    exIndex: number,
    field: keyof CreateExerciseDto,
    value: any
  ) => void;
  onExerciseRemove: (exIndex: number) => void;
  onExerciseClick: (exercise: any) => void;
}

export const DayCard = ({
  day,
  dayIndex,
  isEditMode,
  onDayNameChange,
  onAddExercise,
  onExerciseUpdate,
  onExerciseRemove,
  onExerciseClick,
}: DayCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-background-secondary border border-border rounded-xl">
      <div className="bg-background-tertiary p-3 border-b border-border flex items-center justify-between rounded-t-xl">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary" />
          {isEditMode ? (
            <InputField
              value={day.name}
              onChange={(e) => onDayNameChange(e.target.value)}
              placeholder={`${t("training.programs.create.form.day")} ${
                dayIndex + 1
              }`}
            />
          ) : (
            <span className="font-medium text-text-primary">
              {t("training.programs.create.form.dayName")} {dayIndex + 1}:{" "}
              {day.name}
            </span>
          )}
        </div>
        {isEditMode && (
          <button
            onClick={onAddExercise}
            className="p-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs flex items-center gap-1.5 transition-all"
          >
            <Plus size={14} />
            {t("training.programs.create.form.addExercise")}
          </button>
        )}
      </div>

      <div className="p-3 space-y-2">
        {isEditMode
          ? day.exercises.map((ex: any, exIdx) => (
              <ExerciseForm
                key={exIdx}
                exercise={ex}
                onUpdate={(field, value) =>
                  onExerciseUpdate(exIdx, field, value)
                }
                onRemove={() => onExerciseRemove(exIdx)}
                onAddNext={
                  exIdx === day.exercises.length - 1 ? onAddExercise : undefined
                }
              />
            ))
          : day.exercises.map((ex: any, exIdx) => (
              <ExerciseItem
                key={exIdx}
                exercise={ex}
                index={exIdx}
                onClick={() => onExerciseClick(ex)}
              />
            ))}
        {day.exercises.length === 0 && (
          <p className="text-sm text-text-secondary text-center py-4">
            {t("training.programs.create.form.noExercises")}
          </p>
        )}
      </div>
    </div>
  );
};
