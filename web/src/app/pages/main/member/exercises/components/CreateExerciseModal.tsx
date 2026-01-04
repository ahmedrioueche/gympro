import {
  EXERCISE_DIFFICULTIES,
  EXERCISE_TYPES,
  type CreateExerciseDto,
  type Exercise,
  type ExerciseDifficulty,
  type ExerciseType,
  type MuscleGroup,
} from "@ahmedrioueche/gympro-client";
import { Dumbbell, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../components/ui/InputField";
import TextArea from "../../../../../../components/ui/TextArea";
import {
  useCreateExercise,
  useUpdateExercise,
} from "../../../../../../hooks/queries/useExercises";
import { MuscleSelector } from "./MuscleSelector";

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseToEdit?: Exercise;
}

const INITIAL_DATA: CreateExerciseDto = {
  name: "",
  description: "",
  instructions: "",
  targetMuscles: [],
  equipment: [],
  difficulty: "beginner",
  type: "strength",
  recommendedSets: 3,
  recommendedReps: 10,
  durationMinutes: 0,
  videoUrl: "",
  imageUrl: "",
  isPublic: true,
};

export const CreateExerciseModal = ({
  isOpen,
  onClose,
  exerciseToEdit,
}: CreateExerciseModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateExerciseDto>(INITIAL_DATA);
  const [equipmentInput, setEquipmentInput] = useState("");

  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();

  const isPending = createExercise.isPending || updateExercise.isPending;

  useEffect(() => {
    if (exerciseToEdit) {
      setFormData({
        name: exerciseToEdit.name,
        description: exerciseToEdit.description || "",
        instructions: exerciseToEdit.instructions || "",
        targetMuscles: exerciseToEdit.targetMuscles || [],
        equipment: exerciseToEdit.equipment || [],
        difficulty: exerciseToEdit.difficulty || "beginner",
        type: exerciseToEdit.type || "strength",
        recommendedSets: exerciseToEdit.recommendedSets || 3,
        recommendedReps: exerciseToEdit.recommendedReps || 10,
        durationMinutes: exerciseToEdit.durationMinutes || 0,
        videoUrl: exerciseToEdit.videoUrl || "",
        imageUrl: exerciseToEdit.imageUrl || "",
        isPublic: exerciseToEdit.isPublic ?? true,
      });
    } else {
      setFormData(INITIAL_DATA);
    }
  }, [exerciseToEdit, isOpen]);

  const handleSubmit = async () => {
    if (!formData.name) return;

    if (exerciseToEdit) {
      await updateExercise.mutateAsync({
        id: exerciseToEdit._id!,
        data: formData,
      });
    } else {
      await createExercise.mutateAsync(formData);
    }
    onClose();
  };

  const handleEquipmentAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && equipmentInput.trim()) {
      e.preventDefault();
      if (!formData.equipment?.includes(equipmentInput.trim())) {
        setFormData({
          ...formData,
          equipment: [...(formData.equipment || []), equipmentInput.trim()],
        });
        setEquipmentInput("");
      }
    }
  };

  const removeEquipment = (item: string) => {
    setFormData({
      ...formData,
      equipment: formData.equipment?.filter((e) => e !== item),
    });
  };

  const toggleMuscle = (muscle: MuscleGroup) => {
    const current = formData.targetMuscles || [];
    if (current.includes(muscle)) {
      setFormData({
        ...formData,
        targetMuscles: current.filter((m) => m !== muscle),
      });
    } else {
      setFormData({
        ...formData,
        targetMuscles: [...current, muscle],
      });
    }
  };

  const typeOptions = EXERCISE_TYPES.map((type) => ({
    value: type,
    label: t(`training.exercises.types.${type}`),
  }));

  const difficultyOptions = EXERCISE_DIFFICULTIES.map((diff) => ({
    value: diff,
    label: t(`training.exercises.difficulty.${diff}`),
  }));

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl shadow-2xl max-w-3xl max-h-[99vh] w-full border-2 border-primary/30 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Dumbbell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {exerciseToEdit
                    ? t("training.exercises.edit")
                    : t("training.exercises.create")}
                </h2>
                <p className="text-white/90 text-sm">
                  {t("training.exercises.subtitle")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <InputField
            label={t("training.exercises.form.name")}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t("training.exercises.form.namePlaceholder")}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect
              title={t("training.exercises.form.type")}
              options={typeOptions}
              selectedOption={formData.type || "strength"}
              onChange={(val) =>
                setFormData({ ...formData, type: val as ExerciseType })
              }
            />

            <CustomSelect
              title={t("training.exercises.form.difficulty")}
              options={difficultyOptions}
              selectedOption={formData.difficulty || "beginner"}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  difficulty: val as ExerciseDifficulty,
                })
              }
            />
          </div>

          <TextArea
            label={t("training.exercises.form.description")}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="h-24 resize-none"
            placeholder={t("training.exercises.form.descriptionPlaceholder")}
          />

          <TextArea
            label={t("training.exercises.form.instructions")}
            value={formData.instructions}
            onChange={(e) =>
              setFormData({ ...formData, instructions: e.target.value })
            }
            className="h-32 resize-none"
            placeholder={t("training.exercises.form.instructionsPlaceholder")}
          />

          <div className="space-y-2">
            <MuscleSelector
              selectedMuscles={formData.targetMuscles || []}
              onChange={(muscles) =>
                setFormData({ ...formData, targetMuscles: muscles as any })
              }
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
                setFormData({
                  ...formData,
                  recommendedSets: parseInt(e.target.value) || 0,
                })
              }
            />
            <InputField
              label={t("training.exercises.form.recommendedReps")}
              type="number"
              value={formData.recommendedReps}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  recommendedReps: parseInt(e.target.value) || 0,
                })
              }
            />
            <InputField
              label={t("training.exercises.form.duration")}
              type="number"
              value={formData.durationMinutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  durationMinutes: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <InputField
            label={t("training.exercises.form.videoUrl")}
            value={formData.videoUrl}
            onChange={(e) =>
              setFormData({ ...formData, videoUrl: e.target.value })
            }
            placeholder="https://..."
          />

          <InputField
            label={t("training.exercises.form.imageUrl")}
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            placeholder="https://..."
          />
        </div>

        {/* Footer */}
        <div className="p-6 bg-surface-secondary border-t-2 border-border flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending || !formData.name}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {t("common.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
