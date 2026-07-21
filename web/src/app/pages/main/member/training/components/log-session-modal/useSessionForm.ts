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
import {
  localDateTimeInputToISO,
  sessionStartToLocalInput,
} from "../../../../../../../utils/sessionDateTime";
import { useTimerStore } from "../../../../../../../store/timer";
import { useUserStore } from "../../../../../../../store/user";
import {
  shouldStartRestTimerAfterCompletion,
  type SetCompletion,
} from "./sessionRestTimer";
import {
  buildLayoutForEdit,
  buildLayoutFromProgram,
  rebuildLayoutFromExercises,
  removeExerciseFromLayout,
  type SessionExerciseMeta,
  type SessionLayoutEntry,
} from "./sessionLayout";
import type { SessionExercisePick } from "./AddSessionExercise";
import { getSessionStorageKey } from "./sessionDraftUtils";
import {
  computeDurationMinutes,
  createSessionTimer,
  migrateStoredTimer,
  pauseSessionTimer,
  stateToSnapshot,
  type SessionTimerSnapshot,
  useSessionTimer,
} from "./useSessionTimer";
import type {
  SessionTimerAction,
  SessionTimerSyncResult,
  SyncSessionTimerPayload,
} from "../../../../../../../api/sessionTimerSync";

interface UseSessionFormProps {
  isOpen: boolean;
  activeHistory: ProgramHistory;
  initialSession?: ProgramDayProgress;
  initialDayName?: string;
  mode: "new" | "edit";
  forceNew?: boolean;
  resumeTimer?: boolean;
  onAutoSave?: (data: any) => Promise<string | undefined>; // Returns new sessionId
  onSyncTimer?: (
    payload: SyncSessionTimerPayload,
  ) => Promise<SessionTimerSyncResult | undefined>;
}

const AUTO_SAVE_INTERVAL_MS = 60_000; // 1 minute
const TIMER_MODAL_KEEPALIVE_MS = 60_000;

const getStorageKey = getSessionStorageKey;

interface StoredSession {
  exercises: ExerciseProgress[];
  sessionDate: string;
  durationMinutes?: number;
  timestamp: number;
  mode: "new" | "edit";
  serverSessionId?: string;
  submissionId?: string; // Persist session identity across page reloads
  splitBlockIndices?: number[]; // Track which blocks user chose to split (opt-out of superset)
  sessionLayout?: SessionLayoutEntry[];
  sessionExerciseMeta?: Record<string, SessionExerciseMeta>;
  sessionTimer?: SessionTimerSnapshot;
  /** @deprecated Migrated to sessionTimer */
  sessionTimerStartedAt?: number;
}

export const useSessionForm = ({
  isOpen,
  activeHistory,
  initialSession,
  initialDayName,
  mode,
  forceNew = false,
  resumeTimer = false,
  onAutoSave,
  onSyncTimer,
}: UseSessionFormProps) => {
  const program = activeHistory?.program;
  const progress = activeHistory?.progress;
  const timerEnabled = Boolean(onSyncTimer) && (mode === "new" || resumeTimer);

  const { t } = useTranslation();
  const { user } = useUserStore();

  const [selectedDayName, setSelectedDayName] = useState<string>(
    initialSession?.dayName ||
      initialDayName ||
      program?.days?.[0]?.name ||
      "",
  );
  const [sessionDate, setSessionDate] = useState(
    initialSession
      ? sessionStartToLocalInput(initialSession.date)
      : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  );
  const [sessionDateLocked, setSessionDateLocked] = useState(
    mode === "edit" || (resumeTimer && !!initialSession),
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(
    initialSession?.durationMinutes || 1,
  );
  const [sessionTimerSnapshot, setSessionTimerSnapshot] =
    useState<SessionTimerSnapshot>(createSessionTimer());
  const [exercises, setExercises] = useState<ExerciseProgress[]>([]);
  const [sessionLayout, setSessionLayout] = useState<SessionLayoutEntry[]>([]);
  const [sessionExerciseMeta, setSessionExerciseMeta] = useState<
    Record<string, SessionExerciseMeta>
  >({});
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const savedIndicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [serverSessionId, setServerSessionId] = useState<string | undefined>(
    (initialSession as any)?._id || (initialSession as any)?.id,
  );
  const [submissionId, setSubmissionId] = useState<string | undefined>(
    (initialSession as any)?.submissionId ||
      (mode === "new"
        ? Math.random().toString(36).substring(2) + Date.now().toString(36)
        : undefined),
  );
  const [splitBlockIndices, setSplitBlockIndices] = useState<Set<number>>(
    new Set(),
  );
  const [isDirty, setIsDirty] = useState(false);
  const isDirtyRef = useRef(false);
  const autoSaveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onAutoSaveRef = useRef(onAutoSave);
  const autoSavePayloadRef = useRef({
    programId: program?._id,
    dayName: selectedDayName,
    sessionDate,
    durationMinutes,
    exercises,
    serverSessionId,
    submissionId,
  });
  const prevDayNameRef = useRef<string>("");
  const propagatedWeightsRef = useRef<Map<string, number>>(new Map());
  const [scrollToSet, setScrollToSet] = useState<{
    exIndex: number;
    setIndex: number;
  } | null>(null);

  const sessionTimerRef = useRef(sessionTimerSnapshot);
  const timerStoppedRef = useRef(false);
  const timerRegisteredRef = useRef(false);
  const timerSyncInFlightRef = useRef(false);
  const timerEnabledRef = useRef(timerEnabled);
  const prevIsOpenRef = useRef(isOpen);
  const onSyncTimerRef = useRef(onSyncTimer);
  useEffect(() => {
    sessionTimerRef.current = sessionTimerSnapshot;
  }, [sessionTimerSnapshot]);
  useEffect(() => {
    onSyncTimerRef.current = onSyncTimer;
  }, [onSyncTimer]);

  useEffect(() => {
    timerEnabledRef.current = timerEnabled;
  }, [timerEnabled]);

  useEffect(() => {
    if (serverSessionId) {
      setSessionDateLocked(true);
    }
  }, [serverSessionId]);

  const applyTimerResponse = useCallback((result: SessionTimerSyncResult) => {
    setSessionTimerSnapshot(stateToSnapshot(result.sessionTimer));
    setDurationMinutes(result.durationMinutes);
    if (result.sessionId) {
      setServerSessionId(result.sessionId);
    }
    timerRegisteredRef.current = true;
  }, []);

  const syncTimer = useCallback(
    async (action: SessionTimerAction) => {
      if (
        !timerEnabled ||
        !onSyncTimerRef.current ||
        timerStoppedRef.current ||
        !program?._id ||
        !selectedDayName ||
        !submissionId
      ) {
        return undefined;
      }

      if (timerSyncInFlightRef.current) {
        return undefined;
      }

      timerSyncInFlightRef.current = true;
      try {
        const result = await onSyncTimerRef.current({
          programId: program._id,
          dayName: selectedDayName,
          action,
          sessionId: serverSessionId,
          submissionId,
          date: localDateTimeInputToISO(sessionDate),
        });
        if (result) {
          applyTimerResponse(result);
        }
        return result;
      } catch (error) {
        console.error("[useSessionForm] Timer sync failed", error);
        return undefined;
      } finally {
        timerSyncInFlightRef.current = false;
      }
    },
    [
      timerEnabled,
      program?._id,
      selectedDayName,
      submissionId,
      serverSessionId,
      sessionDate,
      applyTimerResponse,
    ],
  );
  const syncTimerRef = useRef(syncTimer);
  useEffect(() => {
    syncTimerRef.current = syncTimer;
  }, [syncTimer]);

  const storageDraftRef = useRef({
    programId: program?._id as string | undefined,
    dayName: selectedDayName,
    exercises,
    sessionDate,
    durationMinutes,
    mode,
    serverSessionId,
    submissionId,
    splitBlockIndices,
    sessionLayout,
    sessionExerciseMeta,
  });
  useEffect(() => {
    storageDraftRef.current = {
      programId: program?._id,
      dayName: selectedDayName,
      exercises,
      sessionDate,
      durationMinutes,
      mode,
      serverSessionId,
      submissionId,
      splitBlockIndices,
      sessionLayout,
      sessionExerciseMeta,
    };
  });

  // Persist paused timer when the modal unmounts without saving (e.g. close button).
  useEffect(() => {
    return () => {
      if (!isDirtyRef.current) return;

      const draft = storageDraftRef.current;
      if (!draft.programId || !draft.dayName || draft.exercises.length === 0) {
        return;
      }

      try {
        const storageKey = getStorageKey(draft.programId, draft.dayName);
        const stored = localStorage.getItem(storageKey);
        const base: Partial<StoredSession> = stored ? JSON.parse(stored) : {};
        const data: StoredSession = {
          ...base,
          exercises: draft.exercises,
          sessionDate: new Date(draft.sessionDate).toISOString(),
          durationMinutes: computeDurationMinutes(sessionTimerRef.current),
          timestamp: Date.now(),
          mode: draft.mode,
          serverSessionId: draft.serverSessionId,
          submissionId: draft.submissionId,
          splitBlockIndices: Array.from(draft.splitBlockIndices),
          sessionLayout: draft.sessionLayout,
          sessionExerciseMeta: draft.sessionExerciseMeta,
          sessionTimer: sessionTimerRef.current,
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch {
        // Ignore localStorage errors
      }
    };
  }, []);

  const sessionTimer = useSessionTimer({
    isOpen,
    timer: sessionTimerSnapshot,
  });

  const finalizeSessionTimer = useCallback(async (): Promise<number> => {
    timerStoppedRef.current = true;

    if (onSyncTimerRef.current && timerEnabled) {
      const result = await syncTimer("stop");
      const minutes =
        result?.durationMinutes ??
        computeDurationMinutes(sessionTimerRef.current);
      setDurationMinutes(minutes);
      return minutes;
    }

    const paused = pauseSessionTimer(sessionTimerRef.current);
    setSessionTimerSnapshot(paused);
    const minutes = computeDurationMinutes(paused);
    setDurationMinutes(minutes);
    return minutes;
  }, [timerEnabled, syncTimer]);

  // Resume / touch server timer when the logging modal opens.
  useEffect(() => {
    if (!isOpen || !timerEnabled || timerStoppedRef.current) return;
    void syncTimer("touch");
  }, [isOpen, timerEnabled, syncTimer]);

  // Keepalive while modal is open (modal activity, not general app usage).
  useEffect(() => {
    if (!isOpen || !timerEnabled || timerStoppedRef.current) return;

    const id = setInterval(() => {
      void syncTimer("touch");
    }, TIMER_MODAL_KEEPALIVE_MS);

    return () => clearInterval(id);
  }, [isOpen, timerEnabled, syncTimer]);

  // Anchor idle grace when the modal closes.
  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen && timerEnabledRef.current) {
      if (!timerStoppedRef.current) {
        void syncTimerRef.current("close");
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

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
    if (mode === "new" && !resumeTimer) {
      setServerSessionId(undefined);
      setSubmissionId(
        Math.random().toString(36).substring(2) + Date.now().toString(36),
      );
      // STRICT RESET: Always default to "Now" when switching days in "new" mode.
      // This prevents stale times from staying in the form if the modal was open for hours.
      setSessionDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    }

    // RESUME IN-PROGRESS (edit with timer) ------------------------
    if (mode === "new" && initialSession && resumeTimer && !forceNew) {
      if (initialSession.dayName === selectedDayName) {
        timerStoppedRef.current = false;
        setServerSessionId(
          (initialSession as any)?._id || (initialSession as any)?.id,
        );
        setSubmissionId((initialSession as any).submissionId);
        setSessionDateLocked(true);
        setSessionDate(sessionStartToLocalInput(initialSession.date));

        const { exercises: editExercises, layout, meta } =
          buildLayoutForEdit(day, initialSession.exercises);
        setExercises(editExercises);
        setSessionLayout(layout);
        setSessionExerciseMeta(meta);

        setSessionTimerSnapshot(
          (initialSession as any).sessionTimer
            ? stateToSnapshot((initialSession as any).sessionTimer)
            : createSessionTimer((initialSession.durationMinutes || 0) * 60),
        );
        return;
      }
    }

    // EDIT MODE LOGIC ------------------------
    if (mode === "edit" && initialSession) {
      if (initialSession.dayName === selectedDayName) {
        setServerSessionId(
          (initialSession as any)?._id || (initialSession as any)?.id,
        );
        setSubmissionId((initialSession as any).submissionId);
        setSessionDateLocked(true);
        setSessionDate(sessionStartToLocalInput(initialSession.date));

        const { exercises: editExercises, layout, meta } =
          buildLayoutForEdit(day, initialSession.exercises);
        setExercises(editExercises);
        setSessionLayout(layout);
        setSessionExerciseMeta(meta);

        setSessionTimerSnapshot(
          (initialSession as any).sessionTimer
            ? stateToSnapshot((initialSession as any).sessionTimer)
            : createSessionTimer((initialSession.durationMinutes || 0) * 60),
        );
        return;
      }
    }

    // NEW SESSION LOGIC ------------------------

    // First, try to load from localStorage (Crash Recovery)
    const storageKey = getStorageKey(program._id!, selectedDayName);
    if (!forceNew) {
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

            setExercises(parsed.exercises);
            setSessionLayout(
              parsed.sessionLayout ??
                rebuildLayoutFromExercises(day, parsed.exercises),
            );
            setSessionExerciseMeta(parsed.sessionExerciseMeta ?? {});

            // SMART DATE RECOVERY:
            // Recover date only if draft is recent (< 1 hour).
            // This preserves local time "Now" for old drafts while keeping Gym Bro weights/reps.
            if (hoursSinceStored < 1) {
              setSessionDate(sessionStartToLocalInput(parsed.sessionDate));
            } else {
              console.log(
                "[useSessionForm] Draft is old. Keeping 'Now' time but preserving exercises.",
              );
            }
            setLastSavedAt(new Date(parsed.timestamp));
            // Recover server session ID if available
            if (parsed.serverSessionId) {
              setServerSessionId(parsed.serverSessionId);
              setSessionDateLocked(true);
            }
            // Recover submissionId to maintain session identity
            if (parsed.submissionId) {
              setSubmissionId(parsed.submissionId);
            }
            // Recover split state
            if (parsed.splitBlockIndices) {
              setSplitBlockIndices(new Set(parsed.splitBlockIndices));
            }
            setSessionTimerSnapshot(migrateStoredTimer(parsed));
            if (!timerStoppedRef.current) {
              void syncTimerRef.current("sync");
            }
            return;
          }
        }
      } catch {
        // Ignore localStorage errors
      }
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
    setSessionLayout(buildLayoutFromProgram(day));
    setSessionExerciseMeta({});
    setSessionTimerSnapshot(createSessionTimer());
    if (!timerStoppedRef.current) {
      void syncTimerRef.current("start");
    }
  }, [selectedDayName, isOpen, mode, initialSession, program, forceNew, resumeTimer]); // Rerun logic when modal opens or key props change!

  // Keep durationMinutes in sync with activity-based timer for autosave
  useEffect(() => {
    if (!isOpen) return;
    setDurationMinutes(computeDurationMinutes(sessionTimerSnapshot));
  }, [isOpen, sessionTimerSnapshot, sessionTimer.elapsedSeconds]);

  // Hide saved indicator when user makes new changes
  useEffect(() => {
    isDirtyRef.current = isDirty;
    if (isDirty) {
      setShowSavedIndicator(false);
    }
  }, [isDirty]);

  useEffect(() => {
    onAutoSaveRef.current = onAutoSave;
  }, [onAutoSave]);

  useEffect(() => {
    autoSavePayloadRef.current = {
      programId: program?._id,
      dayName: selectedDayName,
      sessionDate,
      durationMinutes,
      exercises,
      serverSessionId,
      submissionId,
    };
  }, [
    program?._id,
    selectedDayName,
    sessionDate,
    durationMinutes,
    exercises,
    serverSessionId,
    submissionId,
  ]);

  // Auto-save every minute while there are unsaved changes
  useEffect(() => {
    if (!isOpen || !onAutoSave || !program?._id) return;

    const performAutoSave = async () => {
      const payload = autoSavePayloadRef.current;
      if (!isDirtyRef.current || payload.exercises.length === 0) return;

      const data = {
        programId: payload.programId,
        dayName: payload.dayName,
        date: localDateTimeInputToISO(payload.sessionDate),
        durationMinutes: payload.durationMinutes,
        exercises: payload.exercises,
        sessionId: payload.serverSessionId,
        submissionId: payload.submissionId,
      };

      setIsAutoSaving(true);
      try {
        const newId = await onAutoSaveRef.current?.(data);
        if (newId && !payload.serverSessionId) {
          setServerSessionId(newId);
        }
        setLastSavedAt(new Date());
        setIsDirty(false);
        isDirtyRef.current = false;
        setShowSavedIndicator(true);
        if (savedIndicatorTimerRef.current) {
          clearTimeout(savedIndicatorTimerRef.current);
        }
        savedIndicatorTimerRef.current = setTimeout(
          () => setShowSavedIndicator(false),
          4000,
        );
      } catch (err) {
        console.error("Auto-save error", err);
      } finally {
        setIsAutoSaving(false);
      }
    };

    autoSaveIntervalRef.current = setInterval(() => {
      void performAutoSave();
    }, AUTO_SAVE_INTERVAL_MS);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
    };
  }, [isOpen, onAutoSave, program?._id]);

  // Save to localStorage whenever session state changes
  useEffect(() => {
    if (!isOpen || exercises.length === 0 || !selectedDayName || !program?._id)
      return;

    const storageKey = getStorageKey(program._id, selectedDayName);
    const data: StoredSession = {
      exercises,
      sessionDate: new Date(sessionDate).toISOString(),
      durationMinutes,
      timestamp: Date.now(),
      mode,
      serverSessionId,
      submissionId,
      splitBlockIndices: Array.from(splitBlockIndices),
      sessionLayout,
      sessionExerciseMeta,
      sessionTimer: sessionTimerSnapshot,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      // Ignore localStorage errors
    }
  }, [
    exercises,
    sessionDate,
    durationMinutes,
    isOpen,
    selectedDayName,
    program?._id,
    mode,
    serverSessionId,
    submissionId,
    splitBlockIndices,
    sessionLayout,
    sessionExerciseMeta,
    sessionTimerSnapshot,
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
    setSessionTimerSnapshot(createSessionTimer());
    timerStoppedRef.current = false;
    timerRegisteredRef.current = false;
    setSessionDateLocked(false);
    clearStorage();
    // CRITICAL: Clear IDs after successful save so the next time the modal opens, it's fresh
    setServerSessionId(undefined);
    setSubmissionId(undefined);
    setIsDirty(false);
    isDirtyRef.current = false;
    propagatedWeightsRef.current.clear();
    setShowSavedIndicator(false);
    if (savedIndicatorTimerRef.current) {
      clearTimeout(savedIndicatorTimerRef.current);
    }
  }, [clearStorage]);

  const propagateWeightToSubsequentSets = (
    exIndex: number,
    setIndex: number,
    currentSets: ExerciseSet[],
    oldWeight: number,
    weightValue: number,
  ) => {
    for (let i = setIndex + 1; i < currentSets.length; i++) {
      const nextSetWeight = currentSets[i].weight || 0;
      const propagatedKey = `${exIndex}-${i}`;
      const wasAutoFilled =
        propagatedWeightsRef.current.get(propagatedKey) === nextSetWeight;

      if (
        !currentSets[i].completed &&
        (nextSetWeight === 0 ||
          nextSetWeight === oldWeight ||
          wasAutoFilled)
      ) {
        currentSets[i] = { ...currentSets[i], weight: weightValue };
        propagatedWeightsRef.current.set(propagatedKey, weightValue);
      }
    }
  };

  const markSetCompleted = (exIndex: number, setIndex: number) => {
    setScrollToSet({ exIndex, setIndex });
  };

  const getExerciseMeta = useCallback(
    (exIndex: number) => {
      const day = program?.days.find((d) => d.name === selectedDayName);
      if (!day) return null;

      let idx = 0;
      for (const block of day.blocks) {
        for (let i = 0; i < block.exercises.length; i++) {
          if (idx === exIndex) {
            return {
              exercise: block.exercises[i],
              block,
            };
          }
          idx++;
        }
      }
      return null;
    },
    [program, selectedDayName],
  );

  const maybeStartRestTimer = useCallback(
    (completions: SetCompletion[]) => {
      if (!shouldStartRestTimerAfterCompletion(exercises, completions)) return;

      const defaultRest = user?.appSettings?.timer?.defaultRestTime ?? 90;
      const primaryExIndex = Math.max(...completions.map((c) => c.exIndex));
      const meta = getExerciseMeta(primaryExIndex);
      if (!meta) return;

      const restExercise =
        meta.block.exercises[meta.block.exercises.length - 1];
      const restTime = restExercise.restTime || defaultRest;
      if (restTime <= 0) return;

      const isMultiExerciseBlock = meta.block.exercises.length > 1;
      const timerLabel = isMultiExerciseBlock
        ? `Superset: ${meta.block.exercises.map((e) => e.name).join(" + ")}`
        : meta.exercise.name;

      useTimerStore.getState().startTimer(restTime, timerLabel);
    },
    [exercises, getExerciseMeta, user?.appSettings?.timer?.defaultRestTime],
  );

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
    options?: { propagate?: boolean; commit?: boolean },
  ) => {
    // Validation Logic — manual check only
    if (field === "completed" && value === true) {
      const currentSet = exercises[exIndex].sets[setIndex];
      const error = validateSet(currentSet.weight, currentSet.reps);
      if (error) {
        toast.error(error);
        return;
      }
    }

    setIsDirty(true);
    const newExercises = [...exercises];
    const currentSets = [...newExercises[exIndex].sets];
    const previousWeight = currentSets[setIndex].weight;
    const wasCompleted = exercises[exIndex].sets[setIndex].completed;
    let newlyCompleted = false;

    if (field === "weight") {
      propagatedWeightsRef.current.delete(`${exIndex}-${setIndex}`);
    }

    currentSets[setIndex] = { ...currentSets[setIndex], [field]: value };

    if (field === "weight") {
      const weightValue =
        typeof value === "number" ? value : parseFloat(value) || 0;
      const shouldCommit = options?.propagate === true;

      if (shouldCommit) {
        const reps = currentSets[setIndex].reps;
        const error = validateSet(weightValue, reps);

        if (weightValue > 0 && !error) {
          if (!wasCompleted) {
            newlyCompleted = true;
            markSetCompleted(exIndex, setIndex);
          }
          currentSets[setIndex].completed = true;
          propagateWeightToSubsequentSets(
            exIndex,
            setIndex,
            currentSets,
            previousWeight,
            weightValue,
          );
        } else if (weightValue <= 0 || error) {
          currentSets[setIndex].completed = false;
          if (error && weightValue > 0) {
            toast.error(error);
          }
        }
      }
    }

    if (field === "reps" && options?.commit) {
      if (wasCompleted) {
        const setToCheck = currentSets[setIndex];
        const error = validateSet(setToCheck.weight, setToCheck.reps);
        if (error) {
          currentSets[setIndex].completed = false;
          toast(t("training.logSession.validation.autoUncheck"), {
            icon: "⚠️",
          });
        }
      }
    }

    if (field === "completed" && value === true && !wasCompleted) {
      newlyCompleted = true;
      markSetCompleted(exIndex, setIndex);
    }

    newExercises[exIndex] = { ...newExercises[exIndex], sets: currentSets };
    setExercises(newExercises);

    if (newlyCompleted) {
      maybeStartRestTimer([{ exIndex, setIndex }]);
    }
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

    const wasRowComplete = exerciseIndices.every(
      (exIdx) => exercises[exIdx]?.sets[setIndex]?.completed,
    );

    if (completed && !wasRowComplete) {
      markSetCompleted(exerciseIndices[0], setIndex);
      maybeStartRestTimer(
        exerciseIndices.map((exIndex) => ({ exIndex, setIndex })),
      );
    }

    setExercises(newExercises);
  };

  const commitSetWeight = (
    exIndex: number,
    setIndex: number,
    weight: number,
  ) => {
    updateSet(exIndex, setIndex, "weight", weight, { propagate: true });
  };

  const commitSetReps = (
    exIndex: number,
    setIndex: number,
    reps: number,
  ) => {
    updateSet(exIndex, setIndex, "reps", reps, { commit: true });
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

  const clearScrollToSet = useCallback(() => setScrollToSet(null), []);

  const handleSessionDateChange = useCallback(
    (value: string) => {
      if (sessionDateLocked) return;
      setIsDirty(true);
      setSessionDate(value);
    },
    [sessionDateLocked],
  );

  const handleDurationChange = useCallback((value: number) => {
    setIsDirty(true);
    setDurationMinutes(value);
  }, []);

  const handleDayChange = useCallback((value: string) => {
    setIsDirty(true);
    timerStoppedRef.current = false;
    timerRegisteredRef.current = false;
    setSessionDateLocked(false);
    setSessionTimerSnapshot(createSessionTimer());
    setSelectedDayName(value);
  }, []);

  const addSessionExercise = useCallback((pick: SessionExercisePick) => {
    setIsDirty(true);
    const sets = Array.from({ length: pick.recommendedSets || 3 }).map(() => ({
      reps: pick.recommendedReps || 10,
      weight: 0,
      completed: false,
      drops: [] as ExerciseSet["drops"],
    }));

    setExercises((prev) => {
      const exerciseIndex = prev.length;
      setSessionLayout((layout) => [
        ...layout,
        { kind: "added", exerciseIndex },
      ]);
      return [
        ...prev,
        { exerciseId: pick.exerciseId, sets, notes: "" },
      ];
    });

    setSessionExerciseMeta((meta) => ({
      ...meta,
      [pick.exerciseId]: {
        name: pick.name,
        videoUrl: pick.videoUrl,
        recommendedSets: pick.recommendedSets,
        recommendedReps: pick.recommendedReps,
        restTime: pick.restTime,
      },
    }));
  }, []);

  const removeSessionExercise = useCallback((exIndex: number) => {
    setIsDirty(true);

    for (const key of propagatedWeightsRef.current.keys()) {
      if (key.startsWith(`${exIndex}-`)) {
        propagatedWeightsRef.current.delete(key);
      }
    }

    setExercises((prev) => prev.filter((_, i) => i !== exIndex));
    setSessionLayout((layout) => removeExerciseFromLayout(layout, exIndex));
  }, []);

  const getSessionExerciseDisplay = useCallback(
    (exIndex: number) => {
      const exercise = exercises[exIndex];
      if (!exercise) return null;

      const meta = sessionExerciseMeta[exercise.exerciseId];
      if (meta) {
        return {
          name: meta.name,
          videoUrl: meta.videoUrl,
          restTime: meta.restTime,
        };
      }

      const day = program?.days.find((d) => d.name === selectedDayName);
      const programExercise = day?.blocks
        .flatMap((b) => b.exercises)
        .find(
          (e) =>
            e._id === exercise.exerciseId || e.name === exercise.exerciseId,
        );

      if (programExercise) {
        return {
          name: programExercise.name,
          videoUrl: programExercise.videoUrl,
          restTime: programExercise.restTime,
        };
      }

      return { name: exercise.exerciseId };
    },
    [exercises, program?.days, selectedDayName, sessionExerciseMeta],
  );

  return {
    selectedDayName,
    setSelectedDayName: handleDayChange,
    sessionDate,
    sessionDateLocked,
    setSessionDate: handleSessionDateChange,
    durationMinutes,
    setDurationMinutes: handleDurationChange,
    sessionTimerFormattedElapsed: sessionTimer.formattedElapsed,
    sessionTimerIsRunning: sessionTimer.isRunning,
    finalizeSessionTimer,
    exercises,
    sessionLayout,
    getSessionExerciseDisplay,
    addSessionExercise,
    removeSessionExercise,
    updateSet,
    commitSetWeight,
    commitSetReps,
    scrollToSet,
    clearScrollToSet,
    addSet,
    removeSet,
    addDropSet,
    updateDropSet,
    removeDropSet,
    lastSavedAt,
    isAutoSaving,
    showSavedIndicator,
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
