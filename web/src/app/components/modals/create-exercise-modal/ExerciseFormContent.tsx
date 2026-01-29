import {
  EXERCISE_DIFFICULTIES,
  EXERCISE_TYPES,
  type CreateExerciseDto,
  type ExerciseDifficulty,
  type ExerciseType,
} from "@ahmedrioueche/gympro-client";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../components/ui/CustomSelect";
import InputField from "../../../../components/ui/InputField";
import TextArea from "../../../../components/ui/TextArea";
import { MuscleSelector } from "../../gym/MuscleSelector";

interface ExerciseFormContentProps {
  formData: CreateExerciseDto;
  equipmentInput: string;
  setEquipmentInput: (value: string) => void;
  updateField: (field: keyof CreateExerciseDto, value: any) => void;
  handleEquipmentAdd: (e: React.KeyboardEvent) => void;
  removeEquipment: (item: string) => void;
  setFormData: (data: any) => void; // Helper for broader updates if needed, though updateField covers most
}

export function ExerciseFormContent({
  formData,
  equipmentInput,
  setEquipmentInput,
  updateField,
  handleEquipmentAdd,
  removeEquipment,
  setFormData,
}: ExerciseFormContentProps) {
  const { t } = useTranslation();

  const typeOptions = EXERCISE_TYPES.map((type) => ({
    value: type,
    label: t(`training.exercises.types.${type}`),
  }));

  const difficultyOptions = EXERCISE_DIFFICULTIES.map((diff) => ({
    value: diff,
    label: t(`training.exercises.difficulty.${diff}`),
  }));

  return (
    <div className="space-y-6">
      <InputField
        label={t("training.exercises.form.name")}
        value={formData.name}
        onChange={(e) => updateField("name", e.target.value)}
        placeholder={t("training.exercises.form.namePlaceholder")}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomSelect
          title={t("training.exercises.form.type")}
          options={typeOptions}
          selectedOption={formData.type || "strength"}
          onChange={(val) => updateField("type", val as ExerciseType)}
        />

        <CustomSelect
          title={t("training.exercises.form.difficulty")}
          options={difficultyOptions}
          selectedOption={formData.difficulty || "beginner"}
          onChange={(val) =>
            updateField("difficulty", val as ExerciseDifficulty)
          }
        />
      </div>

      <TextArea
        label={t("training.exercises.form.description")}
        value={formData.description}
        onChange={(e) => updateField("description", e.target.value)}
        className="h-24 resize-none"
        placeholder={t("training.exercises.form.descriptionPlaceholder")}
      />

      <TextArea
        label={t("training.exercises.form.instructions")}
        value={formData.instructions}
        onChange={(e) => updateField("instructions", e.target.value)}
        className="h-32 resize-none"
        placeholder={t("training.exercises.form.instructionsPlaceholder")}
      />

      <div className="space-y-2">
        <MuscleSelector
          selectedMuscles={formData.targetMuscles || []}
          onChange={(muscles) => updateField("targetMuscles", muscles)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-secondary">
          {t("training.exercises.form.equipment")}
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.equipment?.map((item) => (
            <span
              key={item}
              className="px-2 py-1 bg-surface-secondary text-text-primary rounded-lg text-sm flex items-center gap-1"
            >
              {item}
              <button
                type="button"
                onClick={() => removeEquipment(item)}
                className="hover:text-red-500"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <InputField
          value={equipmentInput}
          onChange={(e) => setEquipmentInput(e.target.value)}
          onKeyDown={handleEquipmentAdd}
          placeholder={t("training.exercises.form.equipmentPlaceholder")}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <InputField
          label={t("training.exercises.form.recommendedSets")}
          type="number"
          value={formData.recommendedSets}
          onChange={(e) =>
            updateField("recommendedSets", parseInt(e.target.value) || 0)
          }
        />
        <InputField
          label={t("training.exercises.form.recommendedReps")}
          type="number"
          value={formData.recommendedReps}
          onChange={(e) =>
            updateField("recommendedReps", parseInt(e.target.value) || 0)
          }
        />
        <InputField
          label={t("training.exercises.form.duration")}
          type="number"
          value={formData.durationMinutes}
          onChange={(e) =>
            updateField("durationMinutes", parseInt(e.target.value) || 0)
          }
        />
      </div>

      <InputField
        label={t("training.exercises.form.videoUrl")}
        value={formData.videoUrl}
        onChange={(e) => updateField("videoUrl", e.target.value)}
        placeholder="https://..."
      />

      <InputField
        label={t("training.exercises.form.imageUrl")}
        value={formData.imageUrl}
        onChange={(e) => updateField("imageUrl", e.target.value)}
        placeholder="https://..."
      />
    </div>
  );
}
