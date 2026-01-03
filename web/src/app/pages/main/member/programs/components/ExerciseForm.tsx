import {
  type CreateExerciseDto,
  MUSCLE_GROUPS,
  type MuscleGroup,
} from "@ahmedrioueche/gympro-client";
import { BrainCircuit, Loader2, Plus, Trash2, Video, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../components/ui/InputField";
import { useExerciseForm } from "./hooks/useExerciseForm";

interface ExerciseFormProps {
  exercise: CreateExerciseDto;
  onUpdate: (field: keyof CreateExerciseDto, value: any) => void;
  onRemove: () => void;
  onAddNext?: () => void;
}

export const ExerciseForm = ({
  exercise,
  onUpdate,
  onRemove,
  onAddNext,
}: ExerciseFormProps) => {
  const { t } = useTranslation();
  const {
    selectedMuscle,
    handleMuscleChange,
    handleGetSuggestions,
    applySuggestion,
    clearSuggestions,
    suggestions,
    isPending,
    muscleOptions,
  } = useExerciseForm({ exercise, onUpdate });

  return (
    <div className="flex flex-col gap-3 p-4 bg-background-tertiary/30 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
      {/* Row 1: Name and Muscle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <InputField
            placeholder={t("training.programs.create.form.exerciseName")}
            value={exercise.name}
            onChange={(e) => onUpdate("name", e.target.value)}
            className="w-full"
            label={t("training.programs.create.form.exerciseName")}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <CustomSelect
            title={t("training.programs.create.form.targetMuscles")}
            options={muscleOptions(MUSCLE_GROUPS)}
            selectedOption={selectedMuscle as MuscleGroup}
            onChange={(val) => handleMuscleChange(val as MuscleGroup)}
            marginTop="mt-1"
            placeholder={t(
              "training.programs.create.form.selectMuscle",
              "Select Muscle"
            )}
          />
        </div>
      </div>

      {/* Row 2: Details & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:w-24">
            <InputField
              type="number"
              placeholder="0"
              value={exercise.recommendedSets}
              onChange={(e) =>
                onUpdate("recommendedSets", parseInt(e.target.value) || 0)
              }
              min="0"
              label={t("training.programs.create.form.sets")}
            />
          </div>
          <div className="flex-1 sm:w-24">
            <InputField
              type="number"
              placeholder="0"
              value={exercise.recommendedReps}
              onChange={(e) =>
                onUpdate("recommendedReps", parseInt(e.target.value) || 0)
              }
              min="0"
              label={t("training.programs.create.form.reps")}
            />
          </div>
        </div>

        <div className="flex-1 w-full relative">
          {typeof exercise.videoUrl !== "string" ? (
            <button
              type="button"
              onClick={() => onUpdate("videoUrl", "")}
              className="h-[50px] px-3 mt-auto w-full sm:w-auto text-sm text-text-secondary hover:text-primary border border-dashed border-border hover:border-primary/50 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Video size={16} />
              {t("training.programs.create.form.addVideo")}
            </button>
          ) : (
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <InputField
                  placeholder="https://youtube.com/..."
                  value={exercise.videoUrl}
                  onChange={(e) =>
                    onUpdate("videoUrl", e.target.value || undefined)
                  }
                  label={t("training.programs.create.form.videoUrl")}
                />
              </div>
              <button
                type="button"
                onClick={() => onUpdate("videoUrl", undefined)}
                className="h-[42px] w-[42px] flex items-center justify-center text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2 w-full sm:w-auto pt-2 sm:pt-0">
          {exercise.name && onAddNext && (
            <button
              type="button"
              onClick={onAddNext}
              className="px-3 py-1.5 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs flex items-center gap-1.5 transition-all"
              title={t(
                "training.programs.create.form.addNextExercise",
                "Add Next Exercise"
              )}
            >
              <Plus size={16} />
              <span className="sm:hidden lg:inline">
                {t("training.programs.create.form.addNext", "Add Next")}
              </span>
            </button>
          )}

          {!exercise.name && (
            <button
              type="button"
              onClick={handleGetSuggestions}
              disabled={isPending || !exercise.targetMuscles?.length}
              className="flex-1 sm:flex-none h-[42px] px-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-primary border border-primary/20 hover:border-primary/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                !exercise.targetMuscles?.length
                  ? t("training.programs.create.form.selectMuscleForAi")
                  : t("common.suggestWithAI", "Suggest with AI")
              }
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <BrainCircuit size={16} />
              )}
              <span className="sm:hidden lg:inline">
                {t("common.suggest", "Suggest")}
              </span>
            </button>
          )}

          <button
            onClick={onRemove}
            className="h-[42px] w-[42px] flex items-center justify-center text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20 ml-auto sm:ml-0"
            title={t("common.delete")}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* AI Suggestions Panel (Full Width) */}
      {suggestions.length > 0 && (
        <div className="w-full mt-2 p-3 bg-surface rounded-xl border border-border/50 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-text-secondary">
              {t("training.programs.create.form.aiSuggestions")}
            </span>
            <button
              onClick={clearSuggestions}
              className="text-xs text-text-secondary hover:text-primary transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applySuggestion(s)}
                className="text-xs px-3 py-1.5 bg-background-secondary hover:bg-primary hover:text-white text-text-primary rounded-lg border border-border transition-all text-left"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
