import { useEffect } from "react";
import type { ProgramDayProgress } from "@ahmedrioueche/gympro-client";
import { syncSessionTimer } from "../../../../../../../api/sessionTimerSync";
import { isSessionTimerRunning, stateToSnapshot } from "./useSessionTimer";

const BACKGROUND_TIMER_SYNC_MS = 30_000;

interface StoredDraftMeta {
  dayName: string;
  submissionId?: string;
  serverSessionId?: string;
  timestamp: number;
  sessionTimer?: {
    segmentStartedAt: number | null;
  };
}

const findLocalDrafts = (programId: string): StoredDraftMeta[] => {
  const drafts: StoredDraftMeta[] = [];
  const prefix = `session_progress_v2_${programId}_`;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(prefix)) continue;

      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw) as StoredDraftMeta & { exercises?: unknown[] };
      if (!parsed.submissionId || !parsed.exercises?.length) continue;

      drafts.push({
        dayName: key.slice(prefix.length),
        submissionId: parsed.submissionId,
        serverSessionId: parsed.serverSessionId,
        timestamp: parsed.timestamp,
        sessionTimer: parsed.sessionTimer,
      });
    }
  } catch {
    // Ignore localStorage errors
  }

  return drafts;
};

const shouldSyncServerLog = (log: ProgramDayProgress): boolean => {
  const timer = (log as ProgramDayProgress & { sessionTimer?: unknown })
    .sessionTimer;
  if (!timer) return false;
  return isSessionTimerRunning(stateToSnapshot(timer as any));
};

/** Keeps server session timers materialized while a workout draft is in progress. */
export const useBackgroundSessionTimerSync = (
  programId?: string,
  dayLogs: ProgramDayProgress[] = [],
) => {
  useEffect(() => {
    if (!programId) return;

    const runSync = () => {
      const syncedSubmissionIds = new Set<string>();

      for (const draft of findLocalDrafts(programId)) {
        if (!draft.submissionId) continue;
        if (
          draft.sessionTimer &&
          !isSessionTimerRunning(stateToSnapshot(draft.sessionTimer as any))
        ) {
          continue;
        }

        syncedSubmissionIds.add(draft.submissionId);
        void syncSessionTimer({
          programId,
          dayName: draft.dayName,
          action: "sync",
          submissionId: draft.submissionId,
          sessionId: draft.serverSessionId,
        }).catch(() => {
          // Silent — modal sync will retry when reopened
        });
      }

      for (const log of dayLogs) {
        if (!log.submissionId || syncedSubmissionIds.has(log.submissionId)) {
          continue;
        }
        if (!shouldSyncServerLog(log)) continue;

        void syncSessionTimer({
          programId,
          dayName: log.dayName,
          action: "sync",
          submissionId: log.submissionId,
          sessionId: (log as { _id?: string })._id,
        }).catch(() => {
          // Silent
        });
      }
    };

    runSync();
    const id = setInterval(runSync, BACKGROUND_TIMER_SYNC_MS);
    return () => clearInterval(id);
  }, [programId, dayLogs]);
};
