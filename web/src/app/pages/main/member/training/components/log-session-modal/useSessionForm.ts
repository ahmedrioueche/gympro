import {
  type ExerciseProgress,
  type ExerciseSet,
  type ProgramDayProgress,
  type ProgramHistory,
} from "@ahmedrioueche/gympro-client";
import { useEffect, useRef, useState } from "react";

interface UseSessionFormProps {
  isOpen: boolean;
  activeHistory: ProgramHistory;
  initialSession?: ProgramDayProgress;
}

export const useSessionForm = ({
  isOpen,
  activeHistory,
  initialSession,
}: UseSessionFormProps) => {
  const { program, progress } = activeHistory;

  const [selectedDayName, setSelectedDayName] = useState<string>(
    initialSession?.dayName || program.days[0]?.name || "",
  );
  const [sessionDate, setSessionDate] = useState(
    initialSession
      ? new Date(initialSession.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );
  const [exercises, setExercises] = useState<ExerciseProgress[]>([]);
  const prevDayNameRef = useRef<string>("");

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const dayName = initialSession?.dayName || program.days[0]?.name || "";
      setSelectedDayName(dayName);
      prevDayNameRef.current = dayName; // Track initial day
      setSessionDate(
        initialSession?.date
          ? new Date(initialSession.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      );
    }
  }, [isOpen, initialSession, program.days]);

  // Initialize form when Day changes or Edit Session provided
  useEffect(() => {
    // Skip if day hasn't actually changed AND exercises are already populated
    if (prevDayNameRef.current === selectedDayName && exercises.length > 0) {
      return;
    }

    prevDayNameRef.current = selectedDayName;

    if (!selectedDayName) return;

    const day = program.days.find((d) => d.name === selectedDayName);
    if (!day) return;

    // Find the last session logged for this specific day name
    const lastSession = progress?.dayLogs
      ? [...progress.dayLogs]
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .find((log) => log.dayName === selectedDayName)
      : undefined;

    // If we are editing (initialSession provided) and we are on that day, load its data directly
    const isEditingTarget =
      initialSession && initialSession.dayName === selectedDayName;

    // Map exercises for the selected day (Flatten blocks)
    const flattenedExercises = day.blocks.flatMap((b) => b.exercises);
    const initialExercises: ExerciseProgress[] = flattenedExercises.map(
      (ex) => {
        // If editing, try to find the exercise in the initial session data
        if (isEditingTarget) {
          const existingEx = initialSession.exercises.find(
            (e) =>
              e.exerciseId === ex._id ||
              e.exerciseId === ex.name ||
              (ex._id && e.exerciseId === "unknown_exercise"), // Fallback matching
          );

          if (existingEx) {
            return {
              exerciseId: ex._id || ex.name || "unknown_exercise",
              sets: existingEx.sets || [],
              notes: existingEx.notes || "",
            };
          }
        }

        const lastEx = lastSession?.exercises.find(
          (e) =>
            e.exerciseId === ex._id ||
            e.exerciseId === ex.name ||
            (ex._id && e.exerciseId === ex._id) ||
            (ex.name && e.exerciseId === ex.name),
        );

        // Determine initial sets configuration
        let initialSets: ExerciseSet[] = [];

        if (lastEx && lastEx.sets && lastEx.sets.length > 0) {
          // Option A: Pre-fill with last session's data
          console.log(
            `Pre-filling exercise "${ex.name}" with last session data:`,
            lastEx.sets,
          );
          initialSets = lastEx.sets.map((s) => ({
            reps: s.reps,
            weight: s.weight,
            completed: false,
            drops: s.drops || [],
          }));
        } else {
          const setRange = Array.from({ length: ex.recommendedSets || 3 });
          initialSets = setRange.map(() => ({
            reps: ex.recommendedReps || 10,
            weight: 0,
            completed: false,
            drops: [],
          }));
        }

        return {
          exerciseId: ex._id || ex.name || "unknown_exercise",
          sets: initialSets,
          notes: "",
        };
      },
    );

    setExercises(initialExercises);
  }, [selectedDayName]); // Only depend on selectedDayName

  const updateSet = (
    exIndex: number,
    setIndex: number,
    field: keyof ExerciseSet,
    value: any,
  ) => {
    const newExercises = [...exercises];
    const currentSets = [...newExercises[exIndex].sets];

    // Propagate weight changes intelligently
    // We need to capture the old value BEFORE updating to know if subsequent sets were synced
    const oldValue = currentSets[setIndex][field];

    // Update the specific field
    currentSets[setIndex] = { ...currentSets[setIndex], [field]: value };

    // UX Improvements:
    // 1. Auto-fill weights for subsequent sets if they are empty OR matched the old value
    // 2. Auto-mark as completed if weight is entered
    if (field === "weight") {
      const weightValue = parseFloat(value) || 0;
      const oldWeightValue = parseFloat(oldValue as any) || 0;

      if (weightValue > 0) {
        // Auto-mark as completed
        currentSets[setIndex].completed = true;

        // Propagate weight to subsequent sets
        for (let i = setIndex + 1; i < currentSets.length; i++) {
          const nextSetWeight = currentSets[i].weight || 0;
          // Update if empty OR if it matched the previous value (meaning they were likely synced)
          // But careful not to overwrite user intent.
          // For now, only propagate if next set is 0.
          if (nextSetWeight === 0) {
            currentSets[i] = { ...currentSets[i], weight: weightValue };
          }
        }
      }
    }

    newExercises[exIndex] = { ...newExercises[exIndex], sets: currentSets };
    setExercises(newExercises);
  };

  const addSet = (exIndex: number) => {
    const newExercises = [...exercises];
    const previousSet =
      newExercises[exIndex].sets[newExercises[exIndex].sets.length - 1];

    newExercises[exIndex].sets.push({
      reps: previousSet?.reps || 10,
      weight: previousSet?.weight || 0,
      completed: false,
      drops: [],
    });
    setExercises(newExercises);
  };

  const removeSet = (exIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exIndex].sets.splice(setIndex, 1);
    setExercises(newExercises);
  };

  const addDropSet = (exIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    const currentSets = [...newExercises[exIndex].sets];
    const set = currentSets[setIndex];

    // Initialize drops if undefined (though we init with [])
    const currentDrops = set.drops ? [...set.drops] : [];

    // Add new drop. Default weight slightly less than main set? Or 0.
    const lastDrop =
      currentDrops.length > 0 ? currentDrops[currentDrops.length - 1] : null;
    currentDrops.push({
      weight: lastDrop
        ? lastDrop.weight
        : set.weight > 5
          ? set.weight - 5
          : set.weight,
      reps: lastDrop ? lastDrop.reps : set.reps,
    });

    currentSets[setIndex] = { ...set, drops: currentDrops };
    newExercises[exIndex] = { ...newExercises[exIndex], sets: currentSets };
    setExercises(newExercises);
  };

  const updateDropSet = (
    exIndex: number,
    setIndex: number,
    dropIndex: number,
    field: "weight" | "reps",
    value: number,
  ) => {
    const newExercises = [...exercises];
    const currentSets = [...newExercises[exIndex].sets];
    const set = currentSets[setIndex];
    if (!set.drops) return;

    const currentDrops = [...set.drops];
    currentDrops[dropIndex] = { ...currentDrops[dropIndex], [field]: value };

    currentSets[setIndex] = { ...set, drops: currentDrops };
    newExercises[exIndex] = { ...newExercises[exIndex], sets: currentSets };
    setExercises(newExercises);
  };

  const removeDropSet = (
    exIndex: number,
    setIndex: number,
    dropIndex: number,
  ) => {
    const newExercises = [...exercises];
    const currentSets = [...newExercises[exIndex].sets];
    const set = currentSets[setIndex];
    if (!set.drops) return;

    const currentDrops = [...set.drops];
    currentDrops.splice(dropIndex, 1);

    currentSets[setIndex] = { ...set, drops: currentDrops };
    newExercises[exIndex] = { ...newExercises[exIndex], sets: currentSets };
    setExercises(newExercises);
  };

  return {
    selectedDayName,
    setSelectedDayName,
    sessionDate,
    setSessionDate,
    exercises,
    updateSet,
    addSet,
    removeSet,
    addDropSet,
    updateDropSet,
    removeDropSet,
  };
};
