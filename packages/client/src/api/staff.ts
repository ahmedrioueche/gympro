import type { AddStaffDto, StaffMember, UpdateStaffDto } from "../dto/staff";
import type { ApiResponse } from "../types/api";
import { apiClient, handleApiError } from "./helper";

export const staffApi = {
  /**
   * Get all staff members for a gym
   */
  getGymStaff: async (gymId: string): Promise<ApiResponse<StaffMember[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<StaffMember[]>>(
        `/membership/gym/${gymId}/staff`
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Add a new staff member to a gym
   */
  addStaff: async (
    dto: AddStaffDto
  ): Promise<
    ApiResponse<{
      membership: any;
      user: any;
      setupToken?: string;
      isNewUser: boolean;
    }>
  > => {
    try {
      const res = await apiClient.post<
        ApiResponse<{
          membership: any;
          user: any;
          setupToken?: string;
          isNewUser: boolean;
        }>
      >(`/membership/gym/${dto.gymId}/staff`, dto);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a staff member
   */
  updateStaff: async (
    gymId: string,
    membershipId: string,
    dto: UpdateStaffDto
  ): Promise<ApiResponse<{ membership: any; user: any }>> => {
    try {
      const res = await apiClient.patch<
        ApiResponse<{ membership: any; user: any }>
      >(`/membership/gym/${gymId}/staff/${membershipId}`, dto);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Remove a staff member from the gym
   */
  removeStaff: async (
    gymId: string,
    membershipId: string
  ): Promise<ApiResponse<{ deleted: boolean }>> => {
    try {
      const res = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(
        `/membership/gym/${gymId}/staff/${membershipId}`
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
