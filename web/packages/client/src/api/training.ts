import {
  CreateProgramDto,
  LogSessionDto,
  SessionTimerResponse,
  SyncSessionTimerDto,
} from "../dto/training";
import { ApiResponse } from "../types/api";
import { ProgramHistory, TrainingProgram } from "../types/training";
import { apiClient, handleApiError } from "./helper";

export const trainingApi = {
  // Programs
  createProgram: async (
    data: CreateProgramDto,
  ): Promise<ApiResponse<TrainingProgram>> => {
    try {
      const res = await apiClient.post<ApiResponse<TrainingProgram>>(
        "/training/programs",
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPrograms: async (
    source?: string,
    search?: string,
  ): Promise<ApiResponse<TrainingProgram[]>> => {
    try {
      const params = new URLSearchParams();
      if (source) params.append("source", source);
      if (search) params.append("search", search);

      const res = await apiClient.get<ApiResponse<TrainingProgram[]>>(
        `/training/programs`,
        { params },
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getProgram: async (id: string): Promise<ApiResponse<TrainingProgram>> => {
    try {
      const res = await apiClient.get<ApiResponse<TrainingProgram>>(
        `/training/programs/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateProgram: async (
    id: string,
    data: Partial<CreateProgramDto>,
  ): Promise<ApiResponse<TrainingProgram>> => {
    try {
      const res = await apiClient.patch<ApiResponse<TrainingProgram>>(
        `/training/programs/${id}`,
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  addComment: async (
    programId: string,
    data: {
      text: string;
      rating: number;
      userName: string;
      userImage?: string;
    },
  ): Promise<ApiResponse<TrainingProgram>> => {
    try {
      const res = await apiClient.post<ApiResponse<TrainingProgram>>(
        `/training/programs/${programId}/comment`,
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  startProgram: async (
    id: string,
    force?: boolean,
  ): Promise<ApiResponse<ProgramHistory>> => {
    try {
      const res = await apiClient.post<ApiResponse<ProgramHistory>>(
        `/training/programs/${id}/start${force ? "?force=true" : ""}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  abandonProgram: async (): Promise<ApiResponse<ProgramHistory>> => {
    try {
      const res = await apiClient.post<ApiResponse<ProgramHistory>>(
        "/training/program/abandon",
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  resumeHistory: async (id: string): Promise<ApiResponse<ProgramHistory>> => {
    try {
      const res = await apiClient.post<ApiResponse<ProgramHistory>>(
        `/training/history/${id}/resume`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Active & History
  getActiveProgram: async (): Promise<ApiResponse<ProgramHistory | null>> => {
    try {
      const res =
        await apiClient.get<ApiResponse<ProgramHistory | null>>(
          "/training/active",
        );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logSession: async (
    data: LogSessionDto,
  ): Promise<ApiResponse<ProgramHistory>> => {
    try {
      const res = await apiClient.post<ApiResponse<ProgramHistory>>(
        "/training/sessions",
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  syncSessionTimer: async (
    data: SyncSessionTimerDto,
  ): Promise<ApiResponse<SessionTimerResponse>> => {
    try {
      const res = await apiClient.post<ApiResponse<SessionTimerResponse>>(
        "/training/sessions/timer",
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getHistory: async (): Promise<ApiResponse<ProgramHistory[]>> => {
    try {
      const res =
        await apiClient.get<ApiResponse<ProgramHistory[]>>("/training/history");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteSession: async (
    programId: string,
    sessionId: string,
  ): Promise<ApiResponse<ProgramHistory>> => {
    try {
      const res = await apiClient.delete<ApiResponse<ProgramHistory>>(
        `/training/${programId}/sessions/${sessionId}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
