import {
  type CreateExerciseDto,
  type CreateProgramBlockDto,
  type CreateProgramDto,
  type DaysPerWeek,
} from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useCreateProgram } from "../../hooks/queries/useTraining";

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
            blocks: [], // Initialize blocks
          }),
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
              blocks: [],
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
        // Ensure blocks are valid if needed
      }));

      // Save
      createProgram.mutate(
        { ...formData, days: cleanedDays },
        {
          onSuccess: () => {
            resetForm();
          },
        },
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
    initialData?: Partial<CreateExerciseDto>,
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

    // Create a new SINGLE block for the exercise
    const newBlock: CreateProgramBlockDto = {
      type: "single",
      exercises: [newExercise],
    };

    newDays[dayIndex].blocks.push(newBlock);
    setFormData({ ...formData, days: newDays });
  };

  const updateExercise = (
    dayIndex: number,
    blockIndex: number,
    exIndex: number,
    field: keyof CreateExerciseDto,
    value: any,
  ) => {
    const newDays = [...formData.days];
    newDays[dayIndex].blocks[blockIndex].exercises[exIndex] = {
      ...newDays[dayIndex].blocks[blockIndex].exercises[exIndex],
      [field]: value,
    };
    setFormData({ ...formData, days: newDays });
  };

  // Remove exercise from a block. If block becomes empty, remove block.
  // If block is 'single', removing the exercise removes the block.
  const removeExercise = (
    dayIndex: number,
    blockIndex: number,
    exIndex: number,
  ) => {
    const newDays = [...formData.days];
    const block = newDays[dayIndex].blocks[blockIndex];

    block.exercises.splice(exIndex, 1);

    // If block is empty, remove it
    if (block.exercises.length === 0) {
      newDays[dayIndex].blocks.splice(blockIndex, 1);
    }
    // If block was superset and now has 1 exercise, maybe convert to single?
    // User requirements say "make sure its clean". Automatic downgrade is clean.
    else if (block.type === "superset" && block.exercises.length === 1) {
      block.type = "single";
    }

    setFormData({ ...formData, days: newDays });
  };

  const reorderBlock = (
    dayIndex: number,
    fromIndex: number,
    toIndex: number,
  ) => {
    const newDays = [...formData.days];
    const blocks = [...newDays[dayIndex].blocks];
    const [movedBlock] = blocks.splice(fromIndex, 1);
    blocks.splice(toIndex, 0, movedBlock);
    newDays[dayIndex].blocks = blocks;
    setFormData({ ...formData, days: newDays });
  };

  // Group multiple blocks into one SuperSet
  const groupBlocks = (dayIndex: number, blockIndices: number[]) => {
    if (blockIndices.length < 2) return;

    const newDays = [...formData.days];
    const day = newDays[dayIndex];

    // Extract exercises from selected blocks
    const exercisesToGroup: CreateExerciseDto[] = [];

    // Sort indices descending to splice correctly
    const sortedIndices = [...blockIndices].sort((a, b) => b - a);

    // Gather exercises and remove blocks
    // We want to preserve order of blocks as they appear in the list
    // So we iterate original indices in ascending order to collect exercises
    const ascendingIndices = [...blockIndices].sort((a, b) => a - b);

    ascendingIndices.forEach((idx) => {
      exercisesToGroup.push(...day.blocks[idx].exercises);
    });

    // Remove old blocks
    sortedIndices.forEach((idx) => {
      day.blocks.splice(idx, 1);
    });

    // Create new Superset block at the position of the first block
    const newBlock: CreateProgramBlockDto = {
      type: "superset",
      exercises: exercisesToGroup,
      rounds: 3, // Default for superset
    };

    day.blocks.splice(ascendingIndices[0], 0, newBlock);

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
    reorderBlock,
    groupBlocks,
    updateField,
    updateDaysPerWeek,
  };
};
