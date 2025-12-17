import { CreateMemberDto } from "../dto/users";
import { ApiResponse } from "../types/api";
import { User } from "../types/user";
import { apiClient, handleApiError } from "./helper";

interface MemberResponse {
  membership: any;
  user: User;
}

interface UpdateMemberDto {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  age?: string;
  subscriptionTypeId?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  subscriptionStatus?: string;
  membershipStatus?: string;
}

export const membersApi = {
  /** Create Member */
  createMember: async (data: CreateMemberDto): Promise<ApiResponse<User>> => {
    try {
      const res = await apiClient.post<ApiResponse<User>>(
        "/membership/create",
        data
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get Member by membership ID */
  getMember: async (
    gymId: string,
    membershipId: string
  ): Promise<ApiResponse<MemberResponse>> => {
    try {
      const res = await apiClient.get<ApiResponse<MemberResponse>>(
        `/membership/${gymId}/${membershipId}`
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Update Member */
  updateMember: async (
    gymId: string,
    membershipId: string,
    data: UpdateMemberDto
  ): Promise<ApiResponse<MemberResponse>> => {
    try {
      const res = await apiClient.patch<ApiResponse<MemberResponse>>(
        `/membership/${gymId}/${membershipId}`,
        data
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Delete Member */
  deleteMember: async (
    gymId: string,
    membershipId: string
  ): Promise<ApiResponse<{ deleted: boolean; membershipId: string }>> => {
    try {
      const res = await apiClient.delete<
        ApiResponse<{ deleted: boolean; membershipId: string }>
      >(`/membership/${gymId}/${membershipId}`);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
