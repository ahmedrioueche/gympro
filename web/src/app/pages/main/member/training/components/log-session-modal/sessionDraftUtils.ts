import type { ProgramDayProgress } from "@ahmedrioueche/gympro-client";
import type { SessionTimerSnapshot } from "./useSessionTimer";

export const RESUMABLE_SESSION_MS = 12 * 60 * 60 * 1000;

export const getSessionStorageKey = (programId: string, dayName: string) =>
  `session_progress_v2_${programId}_${dayName}`;

interface StoredSessionDraft {
  exercises: unknown[];
  timestamp: number;
  submissionId?: string;
  serverSessionId?: string;
  sessionTimer?: SessionTimerSnapshot;
}

export type ResumableSessionSource = "draft" | "server";

export interface ResumableSession {
  source: ResumableSessionSource;
  timestamp: number;
  dayName: string;
  session?: ProgramDayProgress;
}

export const isSessionIncomplete = (session: ProgramDayProgress): boolean => {
  if (!session.exercises?.length) return false;

  let totalSets = 0;
  let completedSets = 0;

  for (const exercise of session.exercises) {
    for (const set of exercise.sets) {
      totalSets++;
      if (set.completed) completedSets++;
    }
  }

  if (totalSets === 0) return true;
  return completedSets < totalSets;
};

const getSessionIdentity = (session: ProgramDayProgress): string | undefined =>
  session.submissionId ||
  (session as { _id?: string; id?: string })._id ||
  (session as { id?: string }).id;

export const isSameSession = (
  a: ProgramDayProgress,
  b: ProgramDayProgress,
): boolean => {
  const idA = getSessionIdentity(a);
  const idB = getSessionIdentity(b);
  return idA != null && idA === idB;
};

export const shouldResumeTimerForSession = (
  session: ProgramDayProgress,
  programId: string,
  dayLogs: ProgramDayProgress[] = [],
): boolean => {
  if (!isSessionIncomplete(session)) return false;

  const resumable = findResumableSession(programId, dayLogs);
  if (!resumable) return false;

  if (resumable.session) {
    return isSameSession(resumable.session, session);
  }

  if (resumable.source === "draft" && resumable.dayName === session.dayName) {
    const incompleteForDay = dayLogs
      .filter(
        (log) => log.dayName === session.dayName && isSessionIncomplete(log),
      )
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    if (incompleteForDay.length === 0) return false;
    return isSameSession(incompleteForDay[0], session);
  }

  return false;
};

export const getResumableTimerStopPayload = (
  programId: string,
  resumable: ResumableSession,
): {
  dayName: string;
  submissionId?: string;
  sessionId?: string;
} => {
  if (resumable.session) {
    return {
      dayName: resumable.dayName,
      submissionId: resumable.session.submissionId,
      sessionId: getSessionIdentity(resumable.session),
    };
  }

  try {
    const raw = localStorage.getItem(
      getSessionStorageKey(programId, resumable.dayName),
    );
    if (raw) {
      const parsed = JSON.parse(raw) as StoredSessionDraft;
      return {
        dayName: resumable.dayName,
        submissionId: parsed.submissionId,
        sessionId: parsed.serverSessionId,
      };
    }
  } catch {
    // Ignore localStorage errors
  }

  return { dayName: resumable.dayName };
};

export const clearSessionDraft = (programId: string, dayName: string) => {
  try {
    localStorage.removeItem(getSessionStorageKey(programId, dayName));
  } catch {
    // Ignore localStorage errors
  }
};

export const findResumableSession = (
  programId: string,
  dayLogs: ProgramDayProgress[] = [],
): ResumableSession | null => {
  const cutoff = Date.now() - RESUMABLE_SESSION_MS;
  const candidates: ResumableSession[] = [];
  const draftIdentities = new Set<string>();

  const serverIdentities = new Set(
    dayLogs
      .map((log) => getSessionIdentity(log))
      .filter((id): id is string => Boolean(id)),
  );

  try {
    const prefix = `session_progress_v2_${programId}_`;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(prefix)) continue;

      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw) as StoredSessionDraft;
      if (
        !parsed.timestamp ||
        parsed.timestamp < cutoff ||
        !parsed.exercises?.length
      ) {
        continue;
      }

      // Drop drafts tied to a server session that no longer exists (e.g. after delete).
      if (
        parsed.serverSessionId &&
        !serverIdentities.has(parsed.serverSessionId)
      ) {
        localStorage.removeItem(key);
        continue;
      }

      const dayName = key.slice(prefix.length);
      const identity = parsed.submissionId || parsed.serverSessionId;
      if (identity) draftIdentities.add(identity);

      candidates.push({
        source: "draft",
        timestamp: parsed.timestamp,
        dayName,
      });
    }
  } catch {
    // Ignore localStorage errors
  }

  for (const log of dayLogs) {
    const sessionTime = new Date(log.date).getTime();
    if (sessionTime < cutoff || !isSessionIncomplete(log)) continue;

    const identity = getSessionIdentity(log);
    if (identity && draftIdentities.has(identity)) continue;

    candidates.push({
      source: "server",
      timestamp: sessionTime,
      dayName: log.dayName,
      session: log,
    });
  }

  if (candidates.length === 0) return null;

  return candidates.sort((a, b) => b.timestamp - a.timestamp)[0];
};
