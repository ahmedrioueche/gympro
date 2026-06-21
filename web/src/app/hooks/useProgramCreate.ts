import {
  type CreateExerciseDto,
  type CreateProgramBlockDto,
  type CreateProgramDto,
  type DaysPerWeek,
} from "@ahmedrioueche/gympro-client";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useCreateProgram,
  useUpdateProgram,
} from "../../hooks/queries/useTraining";
import { useProgramAutoSaveState } from "./useProgramAutoSaveState";

const buildInitialFormData = (): CreateProgramDto => ({
  name: "",
  description: "",
  experience: "beginner",
  purpose: "general_fitness",
  daysPerWeek: 3,
  durationWeeks: 12,
  days: [],
  isPublic: false,
});

export const useProgramCreate = (onClose: () => void) => {
  const { t } = useTranslation();
  const createProgram = useCreateProgram();
  const updateProgram = useUpdateProgram();
  const [step, setStep] = useState(1);
  const [programId, setProgramId] = useState<string | undefined>();
  const [formData, setFormData] = useState<CreateProgramDto>(buildInitialFormData);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);

  const cleanDays = useCallback(
    (days: CreateProgramDto["days"]) =>
      days.map((day, index) => ({
        ...day,
        name:
          day.name.trim() ||
          `${t("training.programs.create.form.day")} ${index + 1}`,
      })),
    [t],
  );

  const saveProgram = useCallback(async () => {
    if (!programId) return;

    await updateProgram.mutateAsync({
      id: programId,
      data: { ...formData, days: cleanDays(formData.days) },
      silent: true,
    });
  }, [cleanDays, formData, programId, updateProgram]);

  const {
    markDirty,
    isAutoSaving,
    showSavedIndicator,
    flushSave,
    resetAutoSaveState,
  } = useProgramAutoSaveState({
    enabled: !!programId,
    save: saveProgram,
    revision: formData,
  });

  const ensureDaysStructure = (data: CreateProgramDto) => {
    let days = [...data.days];

    if (days.length === 0) {
      days = Array.from({ length: data.daysPerWeek }).map((_, i) => ({
        name: `${t("training.programs.create.form.day")} ${i + 1}`,
        blocks: [],
      }));
    } else if (days.length !== data.daysPerWeek) {
      if (days.length < data.daysPerWeek) {
        const needed = data.daysPerWeek - days.length;
        for (let i = 0; i < needed; i++) {
          days.push({
            name: `${t("training.programs.create.form.day")} ${days.length + 1}`,
            blocks: [],
          });
        }
      } else {
        days = days.slice(0, data.daysPerWeek);
      }
    }

    return { ...data, days: cleanDays(days) };
  };

  const createDraftProgram = async (data: CreateProgramDto) => {
    const payload = ensureDaysStructure(data);
    setIsCreatingDraft(true);
    try {
      const response = await createProgram.mutateAsync({
        ...payload,
        silent: true,
      });
      const createdId = response.data?._id;
      if (!createdId) {
        throw new Error("Program ID missing after create");
      }
      setProgramId(createdId);
      setFormData(payload);
      resetAutoSaveState();
      return createdId;
    } finally {
      setIsCreatingDraft(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        toast.error(t("training.programs.create.validation.nameRequired"));
        return;
      }

      try {
        if (!programId) {
          await createDraftProgram(formData);
        }
        setStep(2);
      } catch {
        toast.error(t("training.programs.create.error"));
      }
      return;
    }

    await flushSave();
    resetForm();
  };

  const resetForm = () => {
    onClose();
    setStep(1);
    setProgramId(undefined);
    setFormData(buildInitialFormData());
    resetAutoSaveState();
  };

  const updateFormData = (next: CreateProgramDto) => {
    markDirty();
    setFormData(next);
  };

  const updateDayName = (index: number, name: string) => {
    const newDays = [...formData.days];
    newDays[index].name = name;
    updateFormData({ ...formData, days: newDays });
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

    const newBlock: CreateProgramBlockDto = {
      type: "single",
      exercises: [newExercise],
    };

    newDays[dayIndex].blocks.push(newBlock);
    updateFormData({ ...formData, days: newDays });
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
    updateFormData({ ...formData, days: newDays });
  };

  const removeExercise = (
    dayIndex: number,
    blockIndex: number,
    exIndex: number,
  ) => {
    const newDays = [...formData.days];
    const block = newDays[dayIndex].blocks[blockIndex];

    block.exercises.splice(exIndex, 1);

    if (block.exercises.length === 0) {
      newDays[dayIndex].blocks.splice(blockIndex, 1);
    } else if (block.type === "superset" && block.exercises.length === 1) {
      block.type = "single";
    }

    updateFormData({ ...formData, days: newDays });
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
    updateFormData({ ...formData, days: newDays });
  };

  const groupBlocks = (dayIndex: number, blockIndices: number[]) => {
    if (blockIndices.length < 2) return;

    const newDays = [...formData.days];
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
    updateFormData({ ...formData, days: newDays });
  };

  const updateField = (field: keyof CreateProgramDto, value: any) => {
    updateFormData({ ...formData, [field]: value });
  };

  const updateDaysPerWeek = (days: DaysPerWeek) => {
    updateFormData({ ...formData, daysPerWeek: days });
  };

  const isSaving = isCreatingDraft || createProgram.isPending || isAutoSaving;

  return {
    step,
    setStep,
    formData,
    programId,
    createProgram,
    isSaving,
    isAutoSaving,
    showSavedIndicator,
    handleNext,
    updateDayName,
    addExercise,
    updateExercise,
    removeExercise,
    reorderBlock,
    groupBlocks,
    updateField,
    updateDaysPerWeek,
    flushSave,
  };
};
