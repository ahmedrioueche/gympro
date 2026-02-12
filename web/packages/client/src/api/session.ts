import { ApiResponse } from "../types/api";
import {
  CreateSessionDto,
  Session,
  SessionQueryDto,
  UpdateSessionDto,
} from "../types/session";
import { getApiClient } from "./config";

export const sessionApi = {
  create: async (data: CreateSessionDto): Promise<ApiResponse<Session>> => {
    const res = await getApiClient().post<ApiResponse<Session>>(
      "/sessions",
      data,
    );
    return res.data;
  },

  getAll: async (query?: SessionQueryDto): Promise<ApiResponse<Session[]>> => {
    const res = await getApiClient().get<ApiResponse<Session[]>>("/sessions", {
      params: query,
    });
    return res.data;
  },

  getOne: async (id: string): Promise<ApiResponse<Session>> => {
    const res = await getApiClient().get<ApiResponse<Session>>(
      `/sessions/${id}`,
    );
    return res.data;
  },

  update: async (
    id: string,
    data: UpdateSessionDto,
    updateSeries = false,
  ): Promise<ApiResponse<Session>> => {
    const res = await getApiClient().patch<ApiResponse<Session>>(
      `/sessions/${id}`,
      data,
      { params: { updateSeries } },
    );
    return res.data;
  },

  delete: async (
    id: string,
    deleteSeries = false,
  ): Promise<ApiResponse<void>> => {
    const res = await getApiClient().delete<ApiResponse<void>>(
      `/sessions/${id}`,
      { params: { deleteSeries } },
    );
    return res.data;
  },
};
