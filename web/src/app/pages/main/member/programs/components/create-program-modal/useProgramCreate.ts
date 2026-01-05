import {
  type CreateExerciseDto,
  type CreateProgramDto,
  type DaysPerWeek,
} from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useCreateProgram } from "../../../../../../../hooks/queries/useTraining";

export const useProgramCreate = (onClose: () => void) => {
  const { t } = useTranslation();
  const createProgram = useCreateProgram();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<CreateProgramDto>({
    name: "",
    description: "",
    experience: "beginner",
    purpose: "general_fitness",
    daysPerWeek: 3,
    days: [],
    isPublic: false,
  });

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name) {
        toast.error(t("training.programs.create.validation.nameRequired"));
        return;
      }
      // Initialize days if empty
      if (formData.days.length === 0) {
        const initialDays = Array.from({ length: formData.daysPerWeek }).map(
          (_, i) => ({
            name: `${t("training.programs.create.form.day")} ${i + 1}`,
            exercises: [],
          })
        );
        setFormData({ ...formData, days: initialDays });
      } else if (formData.days.length !== formData.daysPerWeek) {
        // Adjust days if daysPerWeek changed
        const currentDays = [...formData.days];
        if (currentDays.length < formData.daysPerWeek) {
          const needed = formData.daysPerWeek - currentDays.length;
          for (let i = 0; i < needed; i++) {
            currentDays.push({
              name: `${t("training.programs.create.form.day")} ${
                currentDays.length + 1
              }`,
              exercises: [],
            });
          }
        } else {
          currentDays.splice(formData.daysPerWeek);
        }
        setFormData({ ...formData, days: currentDays });
      }
      setStep(2);
    } else {
      // Validate and clean up days before submission
      const cleanedDays = formData.days.map((day, index) => ({
        ...day,
        name:
          day.name.trim() ||
          `${t("training.programs.create.form.day")} ${index + 1}`,
      }));

      // Save
      createProgram.mutate(
        { ...formData, days: cleanedDays },
        {
          onSuccess: () => {
            resetForm();
          },
        }
      );
    }
  };

  const resetForm = () => {
    onClose();
    setStep(1);
    setFormData({
      name: "",
      description: "",
      experience: "beginner",
      purpose: "general_fitness",
      daysPerWeek: 3,
      days: [],
      isPublic: false,
    });
  };

  const updateDayName = (index: number, name: string) => {
    const newDays = [...formData.days];
    newDays[index].name = name;
    setFormData({ ...formData, days: newDays });
  };

  const addExercise = (
    dayIndex: number,
    initialData?: Partial<CreateExerciseDto>
  ) => {
    const newDays = [...formData.days];
    const newExercise: CreateExerciseDto = {
      name: initialData?.name || "",
      description: initialData?.description || "",
      instructions: initialData?.instructions || "",
      recommendedSets: initialData?.recommendedSets || 3,
      recommendedReps: initialData?.recommendedReps || 10,
      targetMuscles: initialData?.targetMuscles || [],
      equipment: initialData?.equipment || [],
      videoUrl: initialData?.videoUrl || "",
      imageUrl: initialData?.imageUrl || "",
      difficulty: initialData?.difficulty,
      type: initialData?.type,
    };
    newDays[dayIndex].exercises.push(newExercise);
    setFormData({ ...formData, days: newDays });
  };

  const updateExercise = (
    dayIndex: number,
    exIndex: number,
    field: keyof CreateExerciseDto,
    value: any
  ) => {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises[exIndex] = {
      ...newDays[dayIndex].exercises[exIndex],
      [field]: value,
    };
    setFormData({ ...formData, days: newDays });
  };

  const removeExercise = (dayIndex: number, exIndex: number) => {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises.splice(exIndex, 1);
    setFormData({ ...formData, days: newDays });
  };

  const reorderExercise = (
    dayIndex: number,
    fromIndex: number,
    toIndex: number
  ) => {
    const newDays = [...formData.days];
    const exercises = [...newDays[dayIndex].exercises];
    const [movedExercise] = exercises.splice(fromIndex, 1);
    exercises.splice(toIndex, 0, movedExercise);
    newDays[dayIndex].exercises = exercises;
    setFormData({ ...formData, days: newDays });
  };

  const updateField = (field: keyof CreateProgramDto, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateDaysPerWeek = (days: DaysPerWeek) => {
    setFormData({ ...formData, daysPerWeek: days });
  };

  return {
    step,
    setStep,
    formData,
    createProgram,
    handleNext,
    updateDayName,
    addExercise,
    updateExercise,
    removeExercise,
    reorderExercise,
    updateField,
    updateDaysPerWeek,
  };
};
