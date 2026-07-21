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
    for (const set of exercise.sets ?? []) {
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

/** Most recent day log by session start date. */
export const getLatestDayLog = (
  dayLogs: ProgramDayProgress[] = [],
): ProgramDayProgress | null => {
  if (dayLogs.length === 0) return null;
  return [...dayLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];
};

export const shouldResumeTimerForSession = (
  session: ProgramDayProgress,
  programId: string,
  dayLogs: ProgramDayProgress[] = [],
): boolean => {
  if (!isSessionIncomplete(session)) return false;

  const latest = getLatestDayLog(dayLogs);
  if (!latest || !isSameSession(latest, session)) return false;

  const resumable = findResumableSession(programId, dayLogs);
  if (!resumable) return false;

  if (resumable.session) {
    return isSameSession(resumable.session, session);
  }

  return resumable.source === "draft" && resumable.dayName === session.dayName;
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

  // Collect every identity a server day log can be matched by (submissionId
  // AND Mongo _id / id). Drafts persist `serverSessionId` = the Mongo id, while
  // getSessionIdentity prefers submissionId, so we must index both to avoid
  // wrongly discarding a valid draft as "belonging to a deleted session".
  const serverIdentities = new Set<string>();
  for (const log of dayLogs) {
    const submissionId = log.submissionId;
    const mongoId =
      (log as { _id?: string })._id || (log as { id?: string }).id;
    if (submissionId) serverIdentities.add(submissionId);
    if (mongoId) serverIdentities.add(mongoId);
  }

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
