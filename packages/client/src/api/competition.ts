import {
  CompetitionQueryDto,
  CreateCompetitionDto,
  UpdateCompetitionDto,
} from "../dto/competition";
import { ApiResponse } from "../types/api";
import { Competition } from "../types/competition";
import { apiClient, handleApiError } from "./helper";

export const competitionApi = {
  /**
   * Get all competitions for a gym (paginated)
   */
  findAll: async (
    gymId: string,
    options: CompetitionQueryDto = {},
  ): Promise<
    ApiResponse<import("../types/api").PaginatedResponse<Competition>>
  > => {
    try {
      const { search, type, status, page, limit } = options;
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (type) params.append("type", type);
      if (status) params.append("status", status);
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());

      const res = await apiClient.get<
        ApiResponse<import("../types/api").PaginatedResponse<Competition>>
      >(`/gyms/${gymId}/competitions?${params.toString()}`);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single competition
   */
  findOne: async (
    gymId: string,
    id: string,
  ): Promise<ApiResponse<Competition>> => {
    try {
      const res = await apiClient.get<ApiResponse<Competition>>(
        `/gyms/${gymId}/competitions/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new competition
   */
  create: async (
    gymId: string,
    dto: CreateCompetitionDto,
  ): Promise<ApiResponse<Competition>> => {
    try {
      const res = await apiClient.post<ApiResponse<Competition>>(
        `/gyms/${gymId}/competitions`,
        dto,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a competition
   */
  update: async (
    gymId: string,
    id: string,
    dto: UpdateCompetitionDto,
  ): Promise<ApiResponse<Competition>> => {
    try {
      const res = await apiClient.put<ApiResponse<Competition>>(
        `/gyms/${gymId}/competitions/${id}`,
        dto,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Remove a competition
   */
  remove: async (
    gymId: string,
    id: string,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const res = await apiClient.delete<ApiResponse<{ success: boolean }>>(
        `/gyms/${gymId}/competitions/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get competitions for gym members (only active/completed)
   */
  getMemberCompetitions: async (
    gymId: string,
    options: CompetitionQueryDto = {},
  ): Promise<
    ApiResponse<import("../types/api").PaginatedResponse<Competition>>
  > => {
    try {
      const { search, type, page, limit } = options;
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (type) params.append("type", type);
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());

      const res = await apiClient.get<
        ApiResponse<import("../types/api").PaginatedResponse<Competition>>
      >(`/gyms/${gymId}/competitions/member/list?${params.toString()}`);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Member joins a competition
   */
  join: async (
    gymId: string,
    competitionId: string,
  ): Promise<ApiResponse<Competition>> => {
    try {
      const res = await apiClient.post<ApiResponse<Competition>>(
        `/gyms/${gymId}/competitions/${competitionId}/join`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Member leaves a competition
   */
  leave: async (
    gymId: string,
    competitionId: string,
  ): Promise<ApiResponse<Competition>> => {
    try {
      const res = await apiClient.post<ApiResponse<Competition>>(
        `/gyms/${gymId}/competitions/${competitionId}/leave`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Manager sets winners for a completed competition
   */
  setWinners: async (
    gymId: string,
    competitionId: string,
    winners: {
      place: 1 | 2 | 3;
      userId: string;
      userName?: string;
      userAvatar?: string;
    }[],
  ): Promise<ApiResponse<Competition>> => {
    try {
      const res = await apiClient.put<ApiResponse<Competition>>(
        `/gyms/${gymId}/competitions/${competitionId}/winners`,
        { winners },
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get participants for a competition (Manager only)
   */
  getParticipants: async (
    gymId: string,
    competitionId: string,
  ): Promise<ApiResponse<any[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<any[]>>(
        `/gyms/${gymId}/competitions/${competitionId}/participants`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
