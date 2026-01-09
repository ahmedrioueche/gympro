import type { ApiResponse } from "../types/api";
import type {
  MemberProfileView,
  MemberSubscriptionView,
} from "../types/membership";
import { apiClient, handleApiError } from "./helper";

export const membershipApi = {
  /** Get current user's memberships with gym and subscription details */
  getMyMemberships: async (): Promise<
    ApiResponse<MemberSubscriptionView[]>
  > => {
    try {
      const res = await apiClient.get<ApiResponse<MemberSubscriptionView[]>>(
        "/membership/my"
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get current user's membership for a specific gym */
  getMyMembershipByGym: async (
    gymId: string
  ): Promise<
    ApiResponse<{
      membership: any;
      memberships: MemberSubscriptionView[];
      history: any[];
    }>
  > => {
    try {
      const res = await apiClient.get<
        ApiResponse<{
          membership: any;
          memberships: MemberSubscriptionView[];
          history: any[];
        }>
      >(`/membership/my/${gymId}`);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get member profile with subscription and payment details (for gym managers) */
  getMemberProfile: async (
    gymId: string,
    membershipId: string
  ): Promise<ApiResponse<MemberProfileView>> => {
    try {
      const res = await apiClient.get<ApiResponse<MemberProfileView>>(
        `/membership/${gymId}/${membershipId}/profile`
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Update membership settings for the current user in a specific gym */
  updateMembershipSettings: async (
    gymId: string,
    settings: any
  ): Promise<ApiResponse<any>> => {
    try {
      const res = await apiClient.patch<ApiResponse<any>>(
        `/membership/my/${gymId}/settings`,
        { settings }
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Reactivate/renew a member's subscription (for gym managers) */
  reactivateSubscription: async (
    gymId: string,
    membershipId: string,
    data: {
      subscriptionTypeId: string;
      startDate: string;
      duration: string;
      paymentMethod?: string;
      notes?: string;
    }
  ): Promise<ApiResponse<any>> => {
    try {
      const res = await apiClient.post<ApiResponse<any>>(
        `/membership/${gymId}/${membershipId}/reactivate`,
        data
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default membershipApi;
