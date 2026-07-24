import { apiClient, handleApiError, type ApiResponse } from "@ahmedrioueche/gympro-client";

export type SessionTimerAction = "start" | "touch" | "stop" | "sync" | "close";

export interface SyncSessionTimerPayload {
  programId: string;
  dayName: string;
  action: SessionTimerAction;
  sessionId?: string;
  submissionId?: string;
  date?: string;
  /** Client elapsed to seed first attach when day log has no sessionTimer. */
  seedElapsedSeconds?: number;
}

export interface SessionTimerStatePayload {
  elapsedSeconds: number;
  segmentStartedAt: number | null;
  lastActivityAt: number;
}

export interface SessionTimerSyncResult {
  /** Null when no day log exists yet (touch no-op — client keeps local). */
  sessionTimer: SessionTimerStatePayload | null;
  durationMinutes: number;
  sessionId?: string;
}

export async function syncSessionTimer(
  payload: SyncSessionTimerPayload,
): Promise<SessionTimerSyncResult> {
  try {
    const res = await apiClient.post<ApiResponse<SessionTimerSyncResult>>(
      "/training/sessions/timer",
      payload,
    );
    const body = res.data as ApiResponse<SessionTimerSyncResult>;
    if (!body.data) {
      throw new Error(body.message || "Session timer sync failed");
    }
    return body.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
