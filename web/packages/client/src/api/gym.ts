import { CreateGymDto } from "../dto/gym";
import { ApiResponse, PaginatedResponse } from "../types/api";
import { Gym } from "../types/gym";
import { User } from "../types/user";
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

  /** Update gym settings */
  updateGymSettings: async (
    id: string,
    updateSettingsDto: any
  ): Promise<ApiResponse<Gym>> => {
    try {
      const res = await apiClient.patch<ApiResponse<Gym>>(
        `/gyms/${id}/settings`,
        updateSettingsDto
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

  /** Get all members for a specific gym (paginated) */
  getGymMembers: async (
    gymId: string,
    options: { search?: string; page?: number; limit?: number } = {}
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    try {
      const { search, page = 1, limit = 12 } = options;
      const params: Record<string, any> = { page, limit };
      if (search) {
        params.search = search;
      }
      const res = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
        `/gyms/${gymId}/members`,
        { params }
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Update the last visited gym for the current user */
  updateLastVisited: async (gymId: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.post<ApiResponse<void>>(
        `/gyms/${gymId}/last-visited`
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
