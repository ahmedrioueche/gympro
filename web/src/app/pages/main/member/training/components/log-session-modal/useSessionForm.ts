import {
  type ExerciseProgress,
  type ExerciseSet,
  type ProgramDayProgress,
  type ProgramHistory,
} from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

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
  durationMinutes?: number;
  timestamp: number;
  mode: "new" | "edit";
  serverSessionId?: string;
  submissionId?: string; // Persist session identity across page reloads
  splitBlockIndices?: number[]; // Track which blocks user chose to split (opt-out of superset)
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

  const { t } = useTranslation();

  const [selectedDayName, setSelectedDayName] = useState<string>(
    initialSession?.dayName || program?.days?.[0]?.name || "",
  );
  const [sessionDate, setSessionDate] = useState(
    initialSession
      ? format(new Date(initialSession.date), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(
    initialSession?.durationMinutes || 45,
  );
  const [exercises, setExercises] = useState<ExerciseProgress[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [serverSessionId, setServerSessionId] = useState<string | undefined>(
    (initialSession as any)?._id || (initialSession as any)?.id,
  );
  const [splitBlockIndices, setSplitBlockIndices] = useState<Set<number>>(
    new Set(),
  );
  const [isDirty, setIsDirty] = useState(false);
  const autoSaveTimerRef = useRef<any>(null);
  const prevDayNameRef = useRef<string>("");

  // Logic previously here for manual resets was removed.
  // The hook now relies on component unmounting for state cleanup.

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

    // Reset IDs initially to prevent "leakage" from previous day selection
    if (mode === "new") {
      setServerSessionId(undefined);
      setSubmissionId(
        Math.random().toString(36).substring(2) + Date.now().toString(36),
      );
      // STRICT RESET: Always default to "Now" when switching days in "new" mode.
      // This prevents stale times from staying in the form if the modal was open for hours.
      setSessionDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    }

    // EDIT MODE LOGIC ------------------------
    if (mode === "edit" && initialSession) {
      if (initialSession.dayName === selectedDayName) {
        setServerSessionId(
          (initialSession as any)?._id || (initialSession as any)?.id,
        );
        setSubmissionId((initialSession as any).submissionId);

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
          console.log(
            `[useSessionForm] Recovering ${selectedDayName} session from localStorage`,
          );

          // Force uncheck sets if mode is new (User Request: "always uncheck all sets on a new log")
          // This prevents stale drafts from showing completed sets
          const exercises = parsed.exercises.map((ex) => ({
            ...ex,
            sets: ex.sets.map((s) => ({ ...s, completed: false })),
          }));

          setExercises(exercises);

          // SMART DATE RECOVERY:
          // Recover date only if draft is recent (< 1 hour).
          // This preserves local time "Now" for old drafts while keeping Gym Bro weights/reps.
          if (hoursSinceStored < 1) {
            setSessionDate(
              format(new Date(parsed.sessionDate), "yyyy-MM-dd'T'HH:mm"),
            );
          } else {
            console.log(
              "[useSessionForm] Draft is old. Keeping 'Now' time but preserving exercises.",
            );
          }
          setLastSavedAt(new Date(parsed.timestamp));
          // Recover server session ID if available
          if (parsed.serverSessionId) {
            setServerSessionId(parsed.serverSessionId);
          }
          // Recover submissionId to maintain session identity
          if (parsed.submissionId) {
            setSubmissionId(parsed.submissionId);
          }
          // Recover split state
          if (parsed.splitBlockIndices) {
            setSplitBlockIndices(new Set(parsed.splitBlockIndices));
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
  }, [selectedDayName, isOpen, mode, initialSession, program]); // Rerun logic when modal opens or key props change!

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
        date: new Date(sessionDate).toISOString(), // Export as UTC for consistency
        durationMinutes,
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
      sessionDate: new Date(sessionDate).toISOString(), // Store as full ISO for cross-timezone recovery
      durationMinutes,
      timestamp: Date.now(),
      mode,
      serverSessionId, // Persist ID so crash recovery works with proper UPDATE
      submissionId, // Persist session identity
      splitBlockIndices: Array.from(splitBlockIndices),
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
      setSplitBlockIndices(new Set()); // Reset split state on clear
    }
  }, [program?._id, selectedDayName]);

  // Mark as saved (to update lastSavedAt)
  const markAsSaved = useCallback(() => {
    console.log("[useSessionForm] Marking as saved and CLEARING ID state");
    setLastSavedAt(new Date());
    clearStorage();
    // CRITICAL: Clear IDs after successful save so the next time the modal opens, it's fresh
    setServerSessionId(undefined);
    setSubmissionId(undefined);
    setIsDirty(false); // Reset dirty state on manual save/completion
  }, [clearStorage]);

  const validateSet = (weight: number, reps: number) => {
    if (weight <= 0) return t("training.logSession.validation.weightPositive");
    if (reps <= 0) return t("training.logSession.validation.repsPositive");
    if (weight % 0.5 !== 0)
      return t("training.logSession.validation.weightIncrements");
    // Check for negative numbers explicitly if input allows them, though <= 0 covers it.
    return null;
  };

  const updateSet = (
    exIndex: number,
    setIndex: number,
    field: keyof ExerciseSet,
    value: any,
  ) => {
    // Validation Logic
    if (field === "completed" && value === true) {
      const currentSet = exercises[exIndex].sets[setIndex];
      // Use current values in state unless they are being updated right now (which for 'completed' toggle, they are not)
      const error = validateSet(currentSet.weight, currentSet.reps);
      if (error) {
        toast.error(error);
        return; // Block update
      }
    }

    setIsDirty(true);
    const newExercises = [...exercises];
    const currentSets = [...newExercises[exIndex].sets];

    // Propagate weight changes intelligently
    const oldValue = currentSets[setIndex][field];

    // Update the specific field
    currentSets[setIndex] = { ...currentSets[setIndex], [field]: value };

    // Strict Validation: If modifying a COMPLETED set, check if new value remains valid.
    if (
      currentSets[setIndex].completed &&
      (field === "weight" || field === "reps")
    ) {
      // Use current new values to check
      const newWeight =
        parseInt(field === "weight" ? value : currentSets[setIndex].weight) ||
        0;
      const newReps =
        parseInt(field === "reps" ? value : currentSets[setIndex].reps) || 0;

      // Note: value coming from input might be string or number, safely handle both
      // Actually, validation expects numbers.
      // Let's rely on set state which is updated above.
      // But state update is async/batched? No, `currentSets` is a local mutation of the array before setExercises.

      const setToCheck = currentSets[setIndex];
      const error = validateSet(setToCheck.weight, setToCheck.reps);
      if (error) {
        currentSets[setIndex].completed = false;
        toast(t("training.logSession.validation.autoUncheck"), { icon: "⚠️" });
      }
    }

    // UX Improvements:
    if (field === "weight") {
      const weightValue = parseFloat(value) || 0;

      if (weightValue > 0) {
        // Auto-mark as completed
        currentSets[setIndex].completed = true;

        // Propagate weight to subsequent sets
        for (let i = setIndex + 1; i < currentSets.length; i++) {
          const nextSetWeight = currentSets[i].weight || 0;
          // PROPAGATION LOGIC:
          // We propagate if the next set has weight 0 OR if it matches the OLD value of this set.
          // This allows typing multi-digit numbers (like "15") correctly.
          // We also only propagate to UNCOMPLETED sets to avoid overwriting manually finished data.
          if (
            (nextSetWeight === 0 || nextSetWeight === oldValue) &&
            !currentSets[i].completed
          ) {
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

  const toggleSupersetCompletion = (
    exerciseIndices: number[],
    setIndex: number,
    completed: boolean,
  ) => {
    setIsDirty(true);
    const newExercises = [...exercises];
    let hasError = false;

    exerciseIndices.forEach((exIdx) => {
      const day = program?.days.find((d) => d.name === selectedDayName);
      if (completed && !hasError) {
        // validating only when marking as completed
        const setToCheck = newExercises[exIdx]?.sets[setIndex];
        if (setToCheck) {
          const error = validateSet(setToCheck.weight, setToCheck.reps);
          if (error) {
            const exercise = day?.blocks
              .flatMap((b) => b.exercises)
              .find(
                (e) =>
                  e._id === newExercises[exIdx].exerciseId ||
                  e.name === newExercises[exIdx].exerciseId
              );
            const exName = exercise?.name || newExercises[exIdx].exerciseId;
            toast.error(`${exName}: ${error}`);
            hasError = true;
          }
        }
      }

      if (
        !hasError &&
        newExercises[exIdx] &&
        newExercises[exIdx].sets[setIndex]
      ) {
        const newSets = [...newExercises[exIdx].sets];
        newSets[setIndex] = { ...newSets[setIndex], completed };

        newExercises[exIdx] = {
          ...newExercises[exIdx],
          sets: newSets,
        };
      }
    });

    if (hasError) return;

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

  const toggleBlockSplit = (blockIndex: number) => {
    setSplitBlockIndices((prev) => {
      const next = new Set(prev);
      if (next.has(blockIndex)) {
        next.delete(blockIndex);
      } else {
        next.add(blockIndex);
      }
      return next;
    });
  };

  const validateSession = () => {
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      for (let j = 0; j < ex.sets.length; j++) {
        const set = ex.sets[j];
        if (set.completed) {
          const error = validateSet(set.weight, set.reps);
          if (error) {
            const day = program?.days.find((d) => d.name === selectedDayName);
            const exercise = day?.blocks
              .flatMap((b) => b.exercises)
              .find((e) => e._id === ex.exerciseId || e.name === ex.exerciseId);
            const exName = exercise?.name || ex.exerciseId;
            return `${exName} ${t("common.set")} ${j + 1}: ${error}`;
          }
        }
      }
    }
    return null;
  };

  return {
    selectedDayName,
    setSelectedDayName,
    sessionDate,
    setSessionDate,
    durationMinutes,
    setDurationMinutes,
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
    splitBlockIndices, // Expose split state
    toggleBlockSplit, // Expose toggler
    toggleSupersetCompletion, // Expose atomic updater
    validateSession,
    submissionId,
    serverSessionId,
  };
};
