import {
  CompleteOnboardingDto,
  EditUserDto,
  RegionDetectionResult,
} from "../dto/users";
import { ApiResponse } from "../types/api";
import { User } from "../types/user";
import { apiClient, handleApiError } from "./helper";

export const usersApi = {
  /** Detect region from IP address */
  detectRegion: async (): Promise<ApiResponse<RegionDetectionResult>> => {
    try {
      const res = await apiClient.post<ApiResponse<RegionDetectionResult>>(
        "/users/onboarding/detect-region"
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Complete Onboarding */
  completeOnboarding: async (
    data: CompleteOnboardingDto
  ): Promise<ApiResponse<User>> => {
    try {
      const res = await apiClient.post<ApiResponse<User>>(
        "/users/onboarding/complete",
        data
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** List users / members (paginated) */
  list: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: string,
    signal?: AbortSignal
  ): Promise<ApiResponse<User[]>> => {
    try {
      const params: any = { page: page.toString(), limit: limit.toString() };
      if (search) params.search = search;
      if (role) params.role = role;

      const res = await apiClient.get<ApiResponse<User[]>>("/users", {
        params,
        signal,
      });

      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  editUser: async (
    userId: string,
    data: EditUserDto
  ): Promise<ApiResponse<User>> => {
    try {
      const res = await apiClient.patch<ApiResponse<User>>(
        `/users/${userId}/profile`,
        data
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Update current user's profile */
  updateMyProfile: async (data: EditUserDto): Promise<ApiResponse<User>> => {
    try {
      const res = await apiClient.patch<ApiResponse<User>>(
        "/users/me/profile",
        data
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
