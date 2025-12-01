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
};
