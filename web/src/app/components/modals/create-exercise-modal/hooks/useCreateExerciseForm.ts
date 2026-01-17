import { type CreateExerciseDto } from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import {
  useCreateExercise,
  useUpdateExercise,
} from "../../../../../hooks/queries/useExercises";
import { useModalStore } from "../../../../../store/modal";

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

export function useCreateExerciseForm() {
  const { currentModal, createExerciseProps, closeModal } = useModalStore();

  const isOpen = currentModal === "create_exercise";
  const exerciseToEdit = createExerciseProps?.exerciseToEdit;

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
    closeModal();
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

  const updateField = (field: keyof CreateExerciseDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    isOpen,
    exerciseToEdit,
    formData,
    equipmentInput,
    isPending,
    closeModal,
    handleSubmit,
    setEquipmentInput,
    handleEquipmentAdd,
    removeEquipment,
    updateField,
    setFormData,
  };
}
