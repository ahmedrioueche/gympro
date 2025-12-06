import { CompleteOnboardingDto, CreateMemberDto } from "../dto/users";
import { ApiResponse } from "../types/api";
import { User } from "../types/user";
import { apiClient, handleApiError } from "./helper";

export const usersApi = {
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

  /** Create Member */
  createMember: async (data: CreateMemberDto): Promise<ApiResponse<User>> => {
    try {
      const res = await apiClient.post<ApiResponse<User>>(
        "/users/members",
        data
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** List users (paginated) */
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
};
