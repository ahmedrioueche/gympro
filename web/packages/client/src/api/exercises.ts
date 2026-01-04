import type { CreateExerciseDto } from "../dto/training";
import { ApiResponse } from "../types/api";
import { Exercise, ExerciseFilters } from "../types/training";
import { apiClient, handleApiError } from "./helper";

export const exercisesApi = {
  createExercise: async (
    data: CreateExerciseDto
  ): Promise<ApiResponse<Exercise>> => {
    try {
      const res = await apiClient.post<ApiResponse<Exercise>>(
        "/exercises",
        data
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getExercises: async (
    filters?: ExerciseFilters
  ): Promise<ApiResponse<Exercise[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<Exercise[]>>("/exercises", {
        params: filters,
      });
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getExerciseById: async (id: string): Promise<ApiResponse<Exercise>> => {
    try {
      const res = await apiClient.get<ApiResponse<Exercise>>(
        `/exercises/${id}`
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateExercise: async (
    id: string,
    data: Partial<CreateExerciseDto>
  ): Promise<ApiResponse<Exercise>> => {
    try {
      const res = await apiClient.patch<ApiResponse<Exercise>>(
        `/exercises/${id}`,
        data
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteExercise: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.delete<ApiResponse<void>>(`/exercises/${id}`);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
