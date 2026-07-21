import { apiClient, handleApiError, type ApiResponse } from "@ahmedrioueche/gympro-client";

export type SessionTimerAction = "start" | "touch" | "stop" | "sync";

export interface SyncSessionTimerPayload {
  programId: string;
  dayName: string;
  action: SessionTimerAction;
  sessionId?: string;
  submissionId?: string;
  date?: string;
}

export interface SessionTimerStatePayload {
  elapsedSeconds: number;
  segmentStartedAt: number | null;
  lastActivityAt: number;
}

export interface SessionTimerSyncResult {
  sessionTimer: SessionTimerStatePayload;
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
