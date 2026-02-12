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
  findAll: async (params?: {
    search?: string;
    city?: string;
    gender?: string;
    services?: string[];
    page?: number;
    limit?: number;
    excludeUserId?: string;
  }): Promise<ApiResponse<PaginatedResponse<Gym>>> => {
    try {
      const res = await apiClient.get<ApiResponse<PaginatedResponse<Gym>>>(
        "/gyms",
        { params },
      );
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
    updateGymDto: Partial<Gym>,
  ): Promise<ApiResponse<Gym>> => {
    try {
      const res = await apiClient.patch<ApiResponse<Gym>>(
        `/gyms/${id}`,
        updateGymDto,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Update gym settings */
  updateGymSettings: async (
    id: string,
    updateSettingsDto: any,
  ): Promise<ApiResponse<Gym>> => {
    try {
      const res = await apiClient.patch<ApiResponse<Gym>>(
        `/gyms/${id}/settings`,
        updateSettingsDto,
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
    options: { search?: string; page?: number; limit?: number } = {},
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    try {
      const { search, page = 1, limit = 12 } = options;
      const params: Record<string, any> = { page, limit };
      if (search) {
        params.search = search;
      }
      const res = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
        `/gyms/${gymId}/members`,
        { params },
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
        `/gyms/${gymId}/last-visited`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Request access to a gym */
  requestAccess: async (gymId: string): Promise<ApiResponse<any>> => {
    try {
      const res = await apiClient.post<ApiResponse<any>>(
        `/membership/request/${gymId}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Add media to a gym */
  addMedia: async (gymId: string, media: any): Promise<ApiResponse<Gym>> => {
    try {
      const res = await apiClient.post<ApiResponse<Gym>>(
        `/gyms/${gymId}/media`,
        media,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Remove media from a gym */
  removeMedia: async (
    gymId: string,
    publicId: string,
  ): Promise<ApiResponse<Gym>> => {
    try {
      const res = await apiClient.delete<ApiResponse<Gym>>(
        `/gyms/${gymId}/media/${publicId}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Set gym banner */
  setBanner: async (
    gymId: string,
    banner: { url: string; publicId: string },
  ): Promise<ApiResponse<Gym>> => {
    try {
      const res = await apiClient.post<ApiResponse<Gym>>(
        `/gyms/${gymId}/banner`,
        banner,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get unique cities where gyms are located */
  getUniqueCities: async (): Promise<ApiResponse<string[]>> => {
    try {
      console.log("Client: gymApi.getUniqueCities called");
      const res = await apiClient.get<ApiResponse<string[]>>("/gyms/cities");
      console.log("Client: gymApi.getUniqueCities response:", res.data);
      return res.data;
    } catch (error) {
      console.error("Client: gymApi.getUniqueCities error:", error);
      throw handleApiError(error);
    }
  },

  /** Add a facility to a gym */
  addFacility: async (
    gymId: string,
    facility: any,
  ): Promise<ApiResponse<Gym>> => {
    try {
      const res = await apiClient.post<ApiResponse<Gym>>(
        `/gyms/${gymId}/facilities`,
        facility,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Update a facility in a gym */
  updateFacility: async (
    gymId: string,
    facilityId: string,
    facility: any,
  ): Promise<ApiResponse<Gym>> => {
    try {
      const res = await apiClient.patch<ApiResponse<Gym>>(
        `/gyms/${gymId}/facilities/${facilityId}`,
        facility,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Remove a facility from a gym */
  removeFacility: async (
    gymId: string,
    facilityId: string,
  ): Promise<ApiResponse<Gym>> => {
    try {
      const res = await apiClient.delete<ApiResponse<Gym>>(
        `/gyms/${gymId}/facilities/${facilityId}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
