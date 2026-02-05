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
  ): Promise<ApiResponse<Competition[]>> => {
    try {
      const { search, type, status, page, limit } = options;
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (type) params.append("type", type);
      if (status) params.append("status", status);
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());

      const res = await apiClient.get<ApiResponse<Competition[]>>(
        `/gyms/${gymId}/competitions?${params.toString()}`,
      );
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
};
