import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_SAVE_DEBOUNCE_MS = 2000;
const SAVED_INDICATOR_MS = 4000;

interface UseProgramAutoSaveStateOptions {
  enabled: boolean;
  save: () => Promise<void>;
  revision?: unknown;
}

export const useProgramAutoSaveState = ({
  enabled,
  save,
  revision,
}: UseProgramAutoSaveStateOptions) => {
  const [isDirty, setIsDirty] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedIndicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const saveRef = useRef(save);
  saveRef.current = save;

  const markDirty = useCallback(() => {
    setIsDirty(true);
    setShowSavedIndicator(false);
  }, []);

  const resetAutoSaveState = useCallback(() => {
    setIsDirty(false);
    setIsAutoSaving(false);
    setShowSavedIndicator(false);
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    if (savedIndicatorTimerRef.current) {
      clearTimeout(savedIndicatorTimerRef.current);
    }
  }, []);

  const runSave = useCallback(async () => {
    setIsAutoSaving(true);
    try {
      await saveRef.current();
      setIsDirty(false);
      setShowSavedIndicator(true);
      if (savedIndicatorTimerRef.current) {
        clearTimeout(savedIndicatorTimerRef.current);
      }
      savedIndicatorTimerRef.current = setTimeout(
        () => setShowSavedIndicator(false),
        SAVED_INDICATOR_MS,
      );
    } catch (error) {
      console.error("Program auto-save failed", error);
    } finally {
      setIsAutoSaving(false);
    }
  }, []);

  const flushSave = useCallback(async () => {
    if (!isDirty) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    await runSave();
  }, [isDirty, runSave]);

  useEffect(() => {
    if (!enabled || !isDirty) return;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    autoSaveTimerRef.current = setTimeout(() => {
      void runSave();
    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [enabled, isDirty, revision, runSave]);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      if (savedIndicatorTimerRef.current) {
        clearTimeout(savedIndicatorTimerRef.current);
      }
    };
  }, []);

  return {
    isDirty,
    markDirty,
    isAutoSaving,
    showSavedIndicator,
    flushSave,
    resetAutoSaveState,
  };
};
