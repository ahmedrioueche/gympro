import {
  type CreateExerciseDto,
  type CreateProgramBlockDto,
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
  onProgramUpdated?: (program: TrainingProgram) => void,
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
          blocks: day.blocks.map((block) => ({
            type: block.type,
            exercises: block.exercises.map((ex) => ({ ...ex })),
            rounds: block.rounds,
          })),
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
      },
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

    const newExercise: CreateExerciseDto = {
      name: "",
      recommendedSets: 3,
      recommendedReps: 10,
      targetMuscles: [],
      equipment: [],
    };

    const newBlock: CreateProgramBlockDto = {
      type: "single",
      exercises: [newExercise],
    };

    newDays[dayIndex].blocks.push(newBlock);
    setEditData({ ...editData, days: newDays });
  };

  const updateExercise = (
    dayIndex: number,
    blockIndex: number,
    exIndex: number,
    field: keyof CreateExerciseDto,
    value: any,
  ) => {
    if (!editData?.days) return;
    const newDays = [...editData.days] as CreateProgramDayDto[];
    const newBlock = newDays[dayIndex].blocks[blockIndex];
    if (!newBlock) return;

    newBlock.exercises[exIndex] = {
      ...newBlock.exercises[exIndex],
      [field]: value,
    };
    setEditData({ ...editData, days: newDays });
  };

  const removeExercise = (
    dayIndex: number,
    blockIndex: number,
    exIndex: number,
  ) => {
    if (!editData?.days) return;
    const newDays = [...editData.days] as CreateProgramDayDto[];
    const block = newDays[dayIndex].blocks[blockIndex];

    block.exercises.splice(exIndex, 1);

    if (block.exercises.length === 0) {
      newDays[dayIndex].blocks.splice(blockIndex, 1);
    } else if (block.type === "superset" && block.exercises.length === 1) {
      block.type = "single";
    }

    setEditData({ ...editData, days: newDays });
  };

  const reorderBlock = (
    dayIndex: number,
    fromIndex: number,
    toIndex: number,
  ) => {
    if (!editData?.days) return;
    const newDays = [...editData.days] as CreateProgramDayDto[];
    const blocks = [...newDays[dayIndex].blocks];

    const [movedBlock] = blocks.splice(fromIndex, 1);
    blocks.splice(toIndex, 0, movedBlock);

    newDays[dayIndex].blocks = blocks;
    setEditData({ ...editData, days: newDays });
  };

  const groupBlocks = (dayIndex: number, blockIndices: number[]) => {
    if (!editData?.days || blockIndices.length < 2) return;
    const newDays = [...editData.days] as CreateProgramDayDto[];
    const day = newDays[dayIndex];

    const exercisesToGroup: CreateExerciseDto[] = [];
    const sortedIndices = [...blockIndices].sort((a, b) => b - a);
    const ascendingIndices = [...blockIndices].sort((a, b) => a - b);

    ascendingIndices.forEach((idx) => {
      exercisesToGroup.push(...day.blocks[idx].exercises);
    });

    sortedIndices.forEach((idx) => {
      day.blocks.splice(idx, 1);
    });

    const newBlock: CreateProgramBlockDto = {
      type: "superset",
      exercises: exercisesToGroup,
      rounds: 3,
    };

    day.blocks.splice(ascendingIndices[0], 0, newBlock);
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
    reorderBlock,
    groupBlocks,
  };
};
