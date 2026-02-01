import { CreateEditorDto } from "../dto/user";
import { ApiResponse } from "../types/api";
import { AdminDashboardStats } from "../types/stats";
import { AppEditorUser, User } from "../types/user";
import { apiClient, handleApiError } from "./helper";

export const adminApi = {
  getDashboardStats: async (): Promise<ApiResponse<AdminDashboardStats>> => {
    try {
      const res = await apiClient.get<ApiResponse<AdminDashboardStats>>(
        "/admin/dashboard-stats",
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createEditor: async (
    data: CreateEditorDto,
  ): Promise<ApiResponse<AppEditorUser>> => {
    try {
      const res = await apiClient.post<ApiResponse<AppEditorUser>>(
        "/admin/editors",
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getEditors: async (): Promise<ApiResponse<AppEditorUser[]>> => {
    try {
      const res =
        await apiClient.get<ApiResponse<AppEditorUser[]>>("/admin/editors");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateEditorPermissions: async (
    id: string,
    permissions: string[],
  ): Promise<ApiResponse<AppEditorUser>> => {
    try {
      const res = await apiClient.put<ApiResponse<AppEditorUser>>(
        `/admin/editors/${id}/permissions`,
        { permissions },
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteEditor: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.delete<ApiResponse<void>>(
        `/admin/editors/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCoachRequests: async (): Promise<ApiResponse<User[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<User[]>>(
        "/admin/coach-requests",
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  approveCoachRequest: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.post<ApiResponse<void>>(
        `/admin/coach-requests/${userId}/approve`,
        {},
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  rejectCoachRequest: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.post<ApiResponse<void>>(
        `/admin/coach-requests/${userId}/reject`,
        {},
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  rejectCoachRequest: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.post<ApiResponse<void>>(
        `/admin/coach-requests/${userId}/reject`,
        {},
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCoaches: async (): Promise<ApiResponse<User[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<User[]>>("/admin/coaches");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
