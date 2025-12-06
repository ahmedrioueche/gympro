import { CreateGymDto } from "../dto/gym";
import { ApiResponse } from "../types/api";
import { Gym } from "../types/gym";
import { apiClient, handleApiError } from "./helper";

export const gymApi = {
  /** Create a new gym */
  create: async (createGymDto: CreateGymDto): Promise<ApiResponse<Gym>> => {
    try {
      const res = await apiClient.post<ApiResponse<Gym>>("/gyms", createGymDto);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get all gyms */
  findAll: async (): Promise<ApiResponse<Gym[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<Gym[]>>("/gyms");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get gyms owned by current user */
  findMyGyms: async (): Promise<ApiResponse<Gym[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<Gym[]>>("/gyms/my-gyms");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get gyms where current user is a member */
  findMemberGyms: async (): Promise<ApiResponse<Gym[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<Gym[]>>("/gyms/member");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get all gyms for current user (owned + member combined) */
  findAllMyGyms: async (): Promise<ApiResponse<Gym[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<Gym[]>>("/gyms/all-my-gyms");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get a single gym by ID */
  findOne: async (id: string): Promise<ApiResponse<Gym>> => {
    try {
      const res = await apiClient.get<ApiResponse<Gym>>(`/gyms/${id}`);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Update a gym */
  update: async (
    id: string,
    updateGymDto: Partial<Gym>
  ): Promise<ApiResponse<Gym>> => {
    try {
      const res = await apiClient.patch<ApiResponse<Gym>>(
        `/gyms/${id}`,
        updateGymDto
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Delete a gym */
  remove: async (id: string): Promise<ApiResponse<Gym>> => {
    try {
      const res = await apiClient.delete<ApiResponse<Gym>>(`/gyms/${id}`);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
