import {
  CreateSessionDto,
  Session,
  SessionQueryDto,
  UpdateSessionDto,
} from "../types/session";
import { getApiClient } from "./config";

export const sessionApi = {
  create: (data: CreateSessionDto) =>
    getApiClient().post<Session>("/sessions", data),

  getAll: (query?: SessionQueryDto) =>
    getApiClient().get<Session[]>("/sessions", { params: query }),

  getOne: (id: string) => getApiClient().get<Session>(`/sessions/${id}`),

  update: (id: string, data: UpdateSessionDto) =>
    getApiClient().patch<Session>(`/sessions/${id}`, data),

  delete: (id: string) => getApiClient().delete<void>(`/sessions/${id}`),
};
