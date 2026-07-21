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
    const body = res.data;
    return (body as ApiResponse<SessionTimerSyncResult>).data ?? body;
  } catch (error) {
    throw handleApiError(error);
  }
}
