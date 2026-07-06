import { useCallback, useEffect, useState } from "react";

/** Pause after this long without user interaction. */
export const SESSION_INACTIVITY_MS = 3 * 60 * 1000;

/** Sanity cap — never persist/display beyond this. */
export const MAX_SESSION_SECONDS = 4 * 60 * 60;

export interface SessionTimerSnapshot {
  /** Accumulated active time from completed segments (seconds). */
  elapsedSeconds: number;
  /** When the current active segment started; null when paused. */
  segmentStartedAt: number | null;
  /** Last user interaction while the session modal was open. */
  lastInteractionAt: number;
}

/** @deprecated Old draft field — migrated on load. */
export interface LegacyStoredTimerFields {
  sessionTimerStartedAt?: number;
  durationMinutes?: number;
  timestamp?: number;
}

/** Formats elapsed time: H:MM:SS when hours > 0, M:SS when minutes > 0, else seconds only. */
export const formatElapsed = (totalSeconds: number): string => {
  const clamped = Math.min(Math.max(0, totalSeconds), MAX_SESSION_SECONDS);
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  const ss = s.toString().padStart(2, "0");

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${ss}`;
  }
  if (m > 0) {
    return `${m}:${ss}`;
  }
  return String(s);
};

export const createSessionTimer = (
  elapsedSeconds = 0,
  now = Date.now(),
): SessionTimerSnapshot => ({
  elapsedSeconds: Math.min(Math.max(0, elapsedSeconds), MAX_SESSION_SECONDS),
  segmentStartedAt: null,
  lastInteractionAt: now,
});

export const getElapsedSeconds = (
  snapshot: SessionTimerSnapshot,
  now = Date.now(),
): number => {
  let total = snapshot.elapsedSeconds;

  if (snapshot.segmentStartedAt !== null) {
    const inactivityCutoff = snapshot.lastInteractionAt + SESSION_INACTIVITY_MS;
    const effectiveNow = Math.min(now, inactivityCutoff);
    if (effectiveNow > snapshot.segmentStartedAt) {
      total += Math.floor((effectiveNow - snapshot.segmentStartedAt) / 1000);
    }
  }

  return Math.min(Math.max(0, total), MAX_SESSION_SECONDS);
};

export const pauseSessionTimer = (
  snapshot: SessionTimerSnapshot,
  now = Date.now(),
): SessionTimerSnapshot => ({
  elapsedSeconds: getElapsedSeconds(snapshot, now),
  segmentStartedAt: null,
  lastInteractionAt: snapshot.lastInteractionAt,
});

export const resumeSessionTimer = (
  snapshot: SessionTimerSnapshot,
  now = Date.now(),
): SessionTimerSnapshot => ({
  elapsedSeconds: getElapsedSeconds(snapshot, now),
  segmentStartedAt: now,
  lastInteractionAt: now,
});

export const touchSessionTimer = (
  snapshot: SessionTimerSnapshot,
  now = Date.now(),
): SessionTimerSnapshot => {
  const inactive =
    snapshot.segmentStartedAt !== null &&
    now > snapshot.lastInteractionAt + SESSION_INACTIVITY_MS;

  if (inactive) {
    const paused = pauseSessionTimer(
      snapshot,
      snapshot.lastInteractionAt + SESSION_INACTIVITY_MS,
    );
    return resumeSessionTimer(paused, now);
  }

  if (snapshot.segmentStartedAt === null) {
    return resumeSessionTimer(snapshot, now);
  }

  return { ...snapshot, lastInteractionAt: now };
};

export const migrateStoredTimer = (
  parsed: LegacyStoredTimerFields & { sessionTimer?: SessionTimerSnapshot },
): SessionTimerSnapshot => {
  if (parsed.sessionTimer) {
    return {
      ...parsed.sessionTimer,
      elapsedSeconds: Math.min(
        parsed.sessionTimer.elapsedSeconds,
        MAX_SESSION_SECONDS,
      ),
    };
  }

  if (parsed.sessionTimerStartedAt && parsed.timestamp) {
    const endAt = parsed.timestamp;
    const rawSeconds = Math.floor(
      (endAt - parsed.sessionTimerStartedAt) / 1000,
    );
    return createSessionTimer(Math.max(0, rawSeconds), endAt);
  }

  if (parsed.durationMinutes) {
    return createSessionTimer(parsed.durationMinutes * 60);
  }

  return createSessionTimer();
};

export const computeDurationMinutes = (
  snapshot: SessionTimerSnapshot,
  now = Date.now(),
): number => {
  const seconds = getElapsedSeconds(snapshot, now);
  return Math.max(1, Math.round(seconds / 60));
};

interface UseSessionTimerProps {
  isOpen: boolean;
  timer: SessionTimerSnapshot;
}

export const useSessionTimer = ({ isOpen, timer }: UseSessionTimerProps) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!isOpen || timer.segmentStartedAt === null) return;

    const interval = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, [isOpen, timer.segmentStartedAt]);

  const elapsedSeconds = getElapsedSeconds(timer);

  const getDurationMinutes = useCallback(
    () => computeDurationMinutes(timer),
    [timer],
  );

  return {
    elapsedSeconds,
    formattedElapsed: formatElapsed(elapsedSeconds),
    isRunning: isOpen && timer.segmentStartedAt !== null,
    getDurationMinutes,
  };
};
