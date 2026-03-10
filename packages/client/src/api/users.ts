import { CompleteOnboardingDto, EditUserDto } from "../dto/users";
import { ApiResponse } from "../types/api";
import { User } from "../types/user";
import { apiClient, handleApiError } from "./helper";

export const usersApi = {
  /** Complete Onboarding */
  completeOnboarding: async (
    data: CompleteOnboardingDto,
  ): Promise<ApiResponse<User>> => {
    try {
      const res = await apiClient.post<ApiResponse<User>>(
        "/users/onboarding/complete",
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Complete Welcome Tour */
  completeWelcomeTour: async (role?: string): Promise<ApiResponse<User>> => {
    try {
      const res = await apiClient.post<ApiResponse<User>>(
        "/users/welcome-tour/complete",
        { role },
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
    signal?: AbortSignal,
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

  getUser: async (userId: string): Promise<ApiResponse<User>> => {
    try {
      const res = await apiClient.get<ApiResponse<User>>(`/users/${userId}`);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  editUser: async (
    userId: string,
    data: EditUserDto,
  ): Promise<ApiResponse<User>> => {
    try {
      const res = await apiClient.patch<ApiResponse<User>>(
        `/users/${userId}/profile`,
        data,
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
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Request email addition verification */
  requestEmailAddition: async (email: string): Promise<ApiResponse<any>> => {
    try {
      const res = await apiClient.post<ApiResponse<any>>(
        "/users/profile/verify-email/request",
        { email },
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Verify and add email */
  verifyEmailAddition: async (
    email: string,
    code: string,
  ): Promise<ApiResponse<User>> => {
    try {
      const res = await apiClient.post<ApiResponse<User>>(
        "/users/profile/verify-email/confirm",
        { email, code },
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Request phone addition verification */
  requestPhoneAddition: async (
    phoneNumber: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const res = await apiClient.post<ApiResponse<any>>(
        "/users/profile/verify-phone/request",
        { phoneNumber },
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Verify and add phone */
  verifyPhoneAddition: async (
    phoneNumber: string,
    code: string,
  ): Promise<ApiResponse<User>> => {
    try {
      const res = await apiClient.post<ApiResponse<User>>(
        "/users/profile/verify-phone/confirm",
        { phoneNumber, code },
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
