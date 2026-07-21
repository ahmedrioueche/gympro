import { useEffect } from "react";
import type { ProgramDayProgress } from "@ahmedrioueche/gympro-client";
import { syncSessionTimer } from "../../../../../../../api/sessionTimerSync";
import { findResumableSession, getResumableTimerStopPayload } from "./sessionDraftUtils";
import { isSessionTimerRunning, stateToSnapshot } from "./useSessionTimer";

const BACKGROUND_TIMER_SYNC_MS = 30_000;

/** Keeps the latest in-progress session timer materialized while modal is closed. */
export const useBackgroundSessionTimerSync = (
  programId?: string,
  dayLogs: ProgramDayProgress[] = [],
) => {
  useEffect(() => {
    if (!programId) return;

    const runSync = () => {
      const resumable = findResumableSession(programId, dayLogs);
      if (!resumable) return;

      const payload = getResumableTimerStopPayload(programId, resumable);
      if (!payload.submissionId) return;

      const serverLog = resumable.session;
      if (serverLog) {
        const timer = (serverLog as ProgramDayProgress & { sessionTimer?: unknown })
          .sessionTimer;
        if (
          timer &&
          !isSessionTimerRunning(stateToSnapshot(timer as Parameters<typeof stateToSnapshot>[0]))
        ) {
          return;
        }
      }

      void syncSessionTimer({
        programId,
        dayName: payload.dayName,
        action: "sync",
        submissionId: payload.submissionId,
        sessionId: payload.sessionId,
      }).catch(() => {
        // Silent — modal sync will retry when reopened
      });
    };

    runSync();
    const id = setInterval(runSync, BACKGROUND_TIMER_SYNC_MS);
    return () => clearInterval(id);
  }, [programId, dayLogs]);
};
