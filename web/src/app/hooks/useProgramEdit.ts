import {
  type CreateExerciseDto,
  type CreateProgramDayDto,
  type TrainingProgram,
} from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useUpdateProgram } from "../../hooks/queries/useTraining";

export const useProgramEdit = (
  program: TrainingProgram | null,
  isEditMode: boolean,
  onProgramUpdated?: (program: TrainingProgram) => void
) => {
  const { t } = useTranslation();
  const [editData, setEditData] = useState<any>(null);
  const updateProgram = useUpdateProgram();

  // Initialize edit data when program changes or edit mode is entered
  useEffect(() => {
    if (program && isEditMode) {
      setEditData({
        name: program.name,
        description: program.description,
        experience: program.experience,
        purpose: program.purpose,
        daysPerWeek: program.daysPerWeek,
        days: program.days.map((day) => ({
          name: day.name,
          exercises: day.exercises.map((ex) => ({ ...ex })),
        })),
        isPublic: program.isPublic,
      });
    }
  }, [program, isEditMode]);

  const handleSave = () => {
    if (!editData || !program?._id) return;

    updateProgram.mutate(
      { id: program._id, data: editData },
      {
        onSuccess: () => {
          toast.success(t("training.programs.edit.success"));
          // Optimistically update parent state with edited data
          if (onProgramUpdated) {
            onProgramUpdated({ ...program, ...editData } as TrainingProgram);
          }
        },
        onError: () => {
          toast.error(t("training.programs.edit.error"));
        },
      }
    );
  };

  const updateDayName = (index: number, name: string) => {
    if (!editData?.days) return;
    const newDays = [...editData.days] as CreateProgramDayDto[];
    newDays[index] = { ...newDays[index], name };
    setEditData({ ...editData, days: newDays });
  };

  const addExercise = (dayIndex: number) => {
    if (!editData?.days) return;
    const newDays = [...editData.days] as CreateProgramDayDto[];
    newDays[dayIndex] = {
      ...newDays[dayIndex],
      exercises: [
        ...newDays[dayIndex].exercises,
        {
          name: "",
          recommendedSets: 3,
          recommendedReps: 10,
          targetMuscles: [],
          equipment: [],
        } as CreateExerciseDto,
      ],
    };
    setEditData({ ...editData, days: newDays });
  };

  const updateExercise = (
    dayIndex: number,
    exIndex: number,
    field: keyof CreateExerciseDto,
    value: any
  ) => {
    if (!editData?.days) return;
    const newDays = [...editData.days] as CreateProgramDayDto[];
    const newExercises = [...newDays[dayIndex].exercises];
    newExercises[exIndex] = { ...newExercises[exIndex], [field]: value };
    newDays[dayIndex] = { ...newDays[dayIndex], exercises: newExercises };
    setEditData({ ...editData, days: newDays });
  };

  const removeExercise = (dayIndex: number, exIndex: number) => {
    if (!editData?.days) return;
    const newDays = [...editData.days] as CreateProgramDayDto[];
    const newExercises = newDays[dayIndex].exercises.filter(
      (_, i) => i !== exIndex
    );
    newDays[dayIndex] = { ...newDays[dayIndex], exercises: newExercises };
    setEditData({ ...editData, days: newDays });
  };

  const reorderExercise = (
    dayIndex: number,
    fromIndex: number,
    toIndex: number
  ) => {
    if (!editData?.days) return;
    const newDays = [...editData.days] as CreateProgramDayDto[];
    const exercises = [...newDays[dayIndex].exercises];

    // Remove the item from the old position
    const [movedExercise] = exercises.splice(fromIndex, 1);
    // Insert it at the new position
    exercises.splice(toIndex, 0, movedExercise);

    newDays[dayIndex] = { ...newDays[dayIndex], exercises };
    setEditData({ ...editData, days: newDays });
  };

  return {
    editData,
    setEditData,
    updateProgram,
    handleSave,
    updateDayName,
    addExercise,
    updateExercise,
    removeExercise,
    reorderExercise,
  };
};
