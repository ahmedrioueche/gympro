import { type TrainingProgram } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";

export const useSessionExercises = (program: TrainingProgram) => {
  const { t } = useTranslation();

  const getExercise = (id: string) => {
    // 1. Try to find by ID or exact Name match in the program
    for (const day of program.days) {
      const ex = day.exercises.find((e) => e._id === id || e.name === id);
      if (ex) return ex;
    }
    return undefined;
  };

  const getExerciseName = (id: string) => {
    const ex = getExercise(id);
    if (ex) return ex.name;

    // 2. If the "id" is specific placeholder, show "Unknown"
    if (id === "unknown_exercise")
      return t("training.logSession.unknownExercise", "Unknown Exercise");

    // 3. Otherwise, assume the ID is actually the name (saved as fallback)
    return id;
  };

  return { getExerciseName, getExercise };
};
