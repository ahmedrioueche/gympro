import {
  type CreateExerciseDto,
  type CreateProgramDayDto,
} from "@ahmedrioueche/gympro-client";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../../components/ui/InputField";
import { ExerciseForm } from "../ExerciseForm";

interface DayScheduleCardProps {
  day: CreateProgramDayDto;
  dayIndex: number;
  onDayNameChange: (name: string) => void;
  onAddExercise: () => void;
  onExerciseUpdate: (
    exIndex: number,
    field: keyof CreateExerciseDto,
    value: any
  ) => void;
  onExerciseRemove: (exIndex: number) => void;
}

export const DayScheduleCard = ({
  day,
  dayIndex,
  onDayNameChange,
  onAddExercise,
  onExerciseUpdate,
  onExerciseRemove,
}: DayScheduleCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-background-secondary border border-border rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-center">
        <InputField
          value={day.name}
          onChange={(e) => onDayNameChange(e.target.value)}
          placeholder={`${t("training.programs.create.form.day")} ${
            dayIndex + 1
          }`}
        />
        <button
          onClick={onAddExercise}
          className="ml-3 px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          {t("training.programs.create.form.addExercise")}
        </button>
      </div>

      {day.exercises.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-4">
          {t("training.programs.create.form.noExercises")}
        </p>
      ) : (
        <div className="space-y-2">
          {day.exercises.map((ex, exIndex) => (
            <ExerciseForm
              key={exIndex}
              exercise={ex}
              onUpdate={(field, value) =>
                onExerciseUpdate(exIndex, field, value)
              }
              onRemove={() => onExerciseRemove(exIndex)}
              onAddNext={
                exIndex === day.exercises.length - 1 ? onAddExercise : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
