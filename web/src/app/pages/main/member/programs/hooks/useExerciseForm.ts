import {
  type CreateExerciseDto,
  type MuscleGroup,
} from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import { useAI } from "../../../../../../hooks/useAI";
import { parseAiResponse } from "../../../../../../utils/helper";

interface UseExerciseFormProps {
  exercise: CreateExerciseDto;
  onUpdate: (field: keyof CreateExerciseDto, value: any) => void;
}

export const useExerciseForm = ({
  exercise,
  onUpdate,
}: UseExerciseFormProps) => {
  const { mutate: getAiResponse, isPending } = useAI();
  const [suggestions, setSuggestions] = useState<Array<{ name: string }>>([]);

  // Array to single select adaptation
  const selectedMuscle = exercise.targetMuscles?.[0] || ("" as MuscleGroup);

  const handleMuscleChange = (muscle: MuscleGroup) => {
    onUpdate("targetMuscles", [muscle]);
  };

  const handleGetSuggestions = () => {
    if (!exercise.targetMuscles?.length) return;

    const muscles = exercise.targetMuscles.join(", ");
    const existingNames = suggestions.map((s) => s.name).join(", ");
    const prompt = `Suggest 5 gym exercises for ${muscles}. ${
      existingNames ? `Do NOT suggest: ${existingNames}.` : ""
    } Return the most common exercises first. Return ONLY a JSON array with objects containing ONE field: "name". Example: [{"name": "Bench Press"}]`;

    getAiResponse(prompt, {
      onSuccess: (response: any) => {
        const parsed = parseAiResponse<Array<{ name: string }>>(response);
        if (parsed && Array.isArray(parsed)) {
          setSuggestions((prev) => [...prev, ...parsed]);
        }
      },
    });
  };

  const applySuggestion = (suggestion: { name: string }) => {
    onUpdate("name", suggestion.name);
    setSuggestions([]);
  };

  const clearSuggestions = () => setSuggestions([]);

  const muscleOptions = (MUSCLE_GROUPS: readonly string[]) =>
    MUSCLE_GROUPS.map((m) => ({
      value: m,
      label: m.charAt(0).toUpperCase() + m.slice(1).replace(/_/g, " "),
    }));

  return {
    selectedMuscle,
    handleMuscleChange,
    handleGetSuggestions,
    applySuggestion,
    clearSuggestions,
    suggestions,
    isPending,
    muscleOptions,
  };
};
