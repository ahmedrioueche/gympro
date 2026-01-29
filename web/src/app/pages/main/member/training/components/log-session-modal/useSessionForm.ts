import {
  type ExerciseProgress,
  type ExerciseSet,
  type ProgramDayProgress,
  type ProgramHistory,
} from "@ahmedrioueche/gympro-client";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseSessionFormProps {
  isOpen: boolean;
  activeHistory: ProgramHistory;
  initialSession?: ProgramDayProgress;
  mode: "new" | "edit";
  onAutoSave?: (data: any) => Promise<string | undefined>; // Returns new sessionId
}

// LocalStorage key for session in progress
const getStorageKey = (programId: string, dayName: string) =>
  `session_progress_v2_${programId}_${dayName}`;

interface StoredSession {
  exercises: ExerciseProgress[];
  sessionDate: string;
  timestamp: number;
  mode: "new" | "edit";
  serverSessionId?: string;
  submissionId?: string; // Persist session identity across page reloads
}

export const useSessionForm = ({
  isOpen,
  activeHistory,
  initialSession,
  mode,
  onAutoSave,
}: UseSessionFormProps) => {
  const program = activeHistory?.program;
  const progress = activeHistory?.progress;

  const [selectedDayName, setSelectedDayName] = useState<string>(
    initialSession?.dayName || program?.days?.[0]?.name || "",
  );
  const [sessionDate, setSessionDate] = useState(
    initialSession
      ? new Date(initialSession.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );
  const [exercises, setExercises] = useState<ExerciseProgress[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [serverSessionId, setServerSessionId] = useState<string | undefined>(
    (initialSession as any)?._id || (initialSession as any)?.id,
  );
  const [isDirty, setIsDirty] = useState(false);
  const autoSaveTimerRef = useRef<any>(null);
  const prevDayNameRef = useRef<string>("");

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen && program?.days) {
      const dayName = initialSession?.dayName || program.days[0]?.name || "";
      setSelectedDayName(dayName);
      prevDayNameRef.current = dayName; // Track initial day
      setSessionDate(
        initialSession?.date
          ? new Date(initialSession.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      );
      setServerSessionId(
        (initialSession as any)?._id || (initialSession as any)?.id,
      );
      setIsDirty(false);
    }
    // Only reset when the modal OPENS. Ignore updates to program/initialSession while open to preserve state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Initialize form when Day changes or Edit Session provided
  useEffect(() => {
    // We want to load data whenever:
    // 1. The modal opens (isOpen change)
    // 2. The day changes (selectedDayName change)
    // We do NOT want to skip if exercises exist, because they might be stale from a previous session.

    prevDayNameRef.current = selectedDayName;

    if (!isOpen || !selectedDayName || !program) return;

    const day = program.days.find((d) => d.name === selectedDayName);
    if (!day) return;

    // EDIT MODE LOGIC ------------------------
    if (mode === "edit" && initialSession) {
      // If day switched away from initial session day, treat as "new" or fallback?
      // Assuming user stays on the edit day, or if they switch, they want to log THAT day (which is effectively new/draft).
      // But let's strictly load initialSession if it matches selectedDayName.
      if (initialSession.dayName === selectedDayName) {
        const flattenedExercises = day.blocks.flatMap((b) => b.exercises);
        const initialExercises: ExerciseProgress[] = flattenedExercises.map(
          (ex) => {
            const existingEx = initialSession.exercises.find(
              (e) =>
                e.exerciseId === ex._id ||
                e.exerciseId === ex.name ||
                (ex._id && e.exerciseId === "unknown_exercise"),
            );

            if (existingEx) {
              return {
                exerciseId: ex._id || ex.name || "unknown_exercise",
                sets: existingEx.sets || [],
                notes: existingEx.notes || "",
              };
            }

            // Fallback for new exercises
            const setRange = Array.from({ length: ex.recommendedSets || 3 });
            return {
              exerciseId: ex._id || ex.name || "unknown_exercise",
              sets: setRange.map(() => ({
                reps: ex.recommendedReps || 10,
                weight: 0,
                completed: false,
                drops: [],
              })),
              notes: "",
            };
          },
        );
        setExercises(initialExercises);
        return;
      }
    }

    // NEW SESSION LOGIC ------------------------

    // First, try to load from localStorage (Crash Recovery)
    const storageKey = getStorageKey(program._id!, selectedDayName);
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: StoredSession = JSON.parse(stored);

        // Validation: Check if stored session is recent enough (24 hours)
        const hoursSinceStored =
          (Date.now() - parsed.timestamp) / (1000 * 60 * 60);
        if (hoursSinceStored < 24 && parsed.exercises.length > 0) {
          console.log("[useSessionForm] Recovering session from localStorage");

          // Force uncheck sets if mode is new (User Request: "always uncheck all sets on a new log")
          // This prevents stale drafts from showing completed sets
          const exercises = parsed.exercises.map((ex) => ({
            ...ex,
            sets: ex.sets.map((s) => ({ ...s, completed: false })),
          }));

          setExercises(exercises);
          setSessionDate(parsed.sessionDate);
          setLastSavedAt(new Date(parsed.timestamp));
          // Recover server session ID if available
          if (parsed.serverSessionId) {
            setServerSessionId(parsed.serverSessionId);
          }
          // Recover submissionId to maintain session identity
          if (parsed.submissionId) {
            setSubmissionId(parsed.submissionId);
          }
          return;
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    // If no draft, try to pre-fill from Last Session (Progressive Overload)
    // Find the last session logged for this specific day name
    const lastSession = progress?.dayLogs
      ? [...progress.dayLogs]
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .find((log) => log.dayName === selectedDayName)
      : undefined;

    const flattenedExercises = day.blocks.flatMap((b) => b.exercises);
    const initialExercises: ExerciseProgress[] = flattenedExercises.map(
      (ex) => {
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
          // Pre-fill with last session's data (weights, reps, etc)
          // BUT force completed = false
          initialSets = lastEx.sets.map((s) => ({
            reps: s.reps,
            weight: s.weight,
            completed: false, // Ensure sets are unchecked
            drops: s.drops || [],
          }));
        } else {
          // Default fallbacks
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
  }, [selectedDayName, isOpen]); // Rerun logic when modal opens!

  // Client-side ID for robust de-duplication
  // This starts as undefined and gets set during initialization
  const [submissionId, setSubmissionId] = useState<string | undefined>(
    (initialSession as any)?.submissionId ||
      (mode === "new"
        ? Math.random().toString(36).substring(2) + Date.now().toString(36)
        : undefined),
  );

  // Auto-save Effect
  useEffect(() => {
    if (!isOpen || !onAutoSave || !program?._id || exercises.length === 0)
      return;

    // Don't auto-save if we haven't made changes (initial load)
    if (!isDirty) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      // Perform save
      const data = {
        programId: program._id,
        dayName: selectedDayName,
        date: sessionDate,
        exercises,
        sessionId: serverSessionId,
        submissionId: submissionId, // Send robust ID
      };

      try {
        const newId = await onAutoSave(data);
        if (newId && !serverSessionId) {
          setServerSessionId(newId);
        }
        setLastSavedAt(new Date());
        setIsDirty(false);
      } catch (err) {
        console.error("Auto-save error", err);
      }
    }, 2000); // 2 second debounce

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [
    exercises,
    sessionDate,
    selectedDayName,
    isOpen,
    program?._id,
    onAutoSave,
    serverSessionId,
    isDirty,
  ]);

  // Save to localStorage whenever exercises change
  useEffect(() => {
    if (!isOpen || exercises.length === 0 || !selectedDayName || !program?._id)
      return;

    const storageKey = getStorageKey(program._id, selectedDayName);
    const data: StoredSession = {
      exercises,
      sessionDate,
      timestamp: Date.now(),
      mode,
      serverSessionId, // Persist ID so crash recovery works with proper UPDATE
      submissionId, // Persist session identity
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      // Ignore localStorage errors
    }
  }, [
    exercises,
    sessionDate,
    isOpen,
    selectedDayName,
    program?._id,
    mode,
    serverSessionId,
  ]);

  // Clear localStorage for this session
  const clearStorage = useCallback(() => {
    if (program?._id && selectedDayName) {
      const storageKey = getStorageKey(program._id, selectedDayName);
      localStorage.removeItem(storageKey);
    }
  }, [program?._id, selectedDayName]);

  // Mark as saved (to update lastSavedAt)
  const markAsSaved = useCallback(() => {
    setLastSavedAt(new Date());
    clearStorage();
    setIsDirty(false); // Reset dirty state on manual save/completion
  }, [clearStorage]);

  const updateSet = (
    exIndex: number,
    setIndex: number,
    field: keyof ExerciseSet,
    value: any,
  ) => {
    setIsDirty(true);
    const newExercises = [...exercises];
    const currentSets = [...newExercises[exIndex].sets];

    // Propagate weight changes intelligently
    const oldValue = currentSets[setIndex][field];

    // Update the specific field
    currentSets[setIndex] = { ...currentSets[setIndex], [field]: value };

    // UX Improvements:
    if (field === "weight") {
      const weightValue = parseFloat(value) || 0;

      if (weightValue > 0) {
        // Auto-mark as completed
        currentSets[setIndex].completed = true;

        // Propagate weight to subsequent sets
        for (let i = setIndex + 1; i < currentSets.length; i++) {
          const nextSetWeight = currentSets[i].weight || 0;
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
    setIsDirty(true);
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
    setIsDirty(true);
    const newExercises = [...exercises];
    newExercises[exIndex].sets.splice(setIndex, 1);
    setExercises(newExercises);
  };

  const addDropSet = (exIndex: number, setIndex: number) => {
    setIsDirty(true);
    const newExercises = [...exercises];
    const currentSets = [...newExercises[exIndex].sets];
    const set = currentSets[setIndex];

    const currentDrops = set.drops ? [...set.drops] : [];

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
    setIsDirty(true);
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
    setIsDirty(true);
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
    lastSavedAt,
    clearStorage,
    markAsSaved,
  };
};
