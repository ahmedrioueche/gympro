import { useCallback, useEffect, useState } from "react";

/** Pause after this long without opening the log session modal (included in elapsed total). */
export const SESSION_INACTIVITY_MS = 15 * 60 * 1000;

/** Sanity cap — never persist/display beyond this. */
export const MAX_SESSION_SECONDS = 4 * 60 * 60;

export interface SessionTimerSnapshot {
  elapsedSeconds: number;
  segmentStartedAt: number | null;
  lastActivityAt: number;
}

/** @deprecated Old draft field — migrated on load. */
export interface LegacyStoredTimerFields {
  sessionTimerStartedAt?: number;
  durationMinutes?: number;
  timestamp?: number;
}

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
  segmentStartedAt: now,
  lastActivityAt: now,
});

export const getElapsedSeconds = (
  snapshot: SessionTimerSnapshot,
  now = Date.now(),
): number => {
  let total = snapshot.elapsedSeconds;

  if (snapshot.segmentStartedAt !== null) {
    const inactivityCutoff = snapshot.lastActivityAt + SESSION_INACTIVITY_MS;
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
  lastActivityAt: snapshot.lastActivityAt,
});

export const resumeSessionTimer = (
  snapshot: SessionTimerSnapshot,
  now = Date.now(),
): SessionTimerSnapshot => ({
  elapsedSeconds: getElapsedSeconds(snapshot, now),
  segmentStartedAt: now,
  lastActivityAt: now,
});

export const touchSessionTimer = (
  snapshot: SessionTimerSnapshot,
  now = Date.now(),
): SessionTimerSnapshot => {
  const inactive =
    snapshot.segmentStartedAt !== null &&
    now > snapshot.lastActivityAt + SESSION_INACTIVITY_MS;

  if (inactive) {
    const paused = pauseSessionTimer(
      snapshot,
      snapshot.lastActivityAt + SESSION_INACTIVITY_MS,
    );
    return resumeSessionTimer(paused, now);
  }

  if (snapshot.segmentStartedAt === null) {
    return resumeSessionTimer(snapshot, now);
  }

  return { ...snapshot, lastActivityAt: now };
};

/** Modal closed — anchor idle grace from now without pausing. */
export const closeSessionTimer = (
  snapshot: SessionTimerSnapshot,
  now = Date.now(),
): SessionTimerSnapshot => {
  const materialized = materializeSessionTimer(snapshot, now);
  if (materialized.segmentStartedAt === null) {
    return materialized;
  }
  return { ...materialized, lastActivityAt: now };
};

export const materializeSessionTimer = (
  snapshot: SessionTimerSnapshot,
  now = Date.now(),
): SessionTimerSnapshot => {
  if (snapshot.segmentStartedAt === null) {
    return snapshot;
  }

  if (now <= snapshot.lastActivityAt + SESSION_INACTIVITY_MS) {
    return snapshot;
  }

  return pauseSessionTimer(
    snapshot,
    snapshot.lastActivityAt + SESSION_INACTIVITY_MS,
  );
};

export const migrateStoredTimer = (
  parsed: LegacyStoredTimerFields & {
    sessionTimer?: SessionTimerSnapshot & { lastInteractionAt?: number };
  },
): SessionTimerSnapshot => {
  if (parsed.sessionTimer) {
    const timer = parsed.sessionTimer;
    return {
      elapsedSeconds: Math.min(timer.elapsedSeconds, MAX_SESSION_SECONDS),
      segmentStartedAt: timer.segmentStartedAt,
      lastActivityAt:
        timer.lastActivityAt ?? timer.lastInteractionAt ?? Date.now(),
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

export const stateToSnapshot = (state: {
  elapsedSeconds: number;
  segmentStartedAt?: number | null;
  lastActivityAt?: number;
}): SessionTimerSnapshot => ({
  elapsedSeconds: Math.min(
    Math.max(0, state.elapsedSeconds),
    MAX_SESSION_SECONDS,
  ),
  segmentStartedAt: state.segmentStartedAt ?? null,
  lastActivityAt: state.lastActivityAt ?? Date.now(),
});

export const isSessionTimerRunning = (
  snapshot: SessionTimerSnapshot,
): boolean => snapshot.segmentStartedAt !== null;

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
    isRunning: isSessionTimerRunning(timer),
    getDurationMinutes,
  };
};
