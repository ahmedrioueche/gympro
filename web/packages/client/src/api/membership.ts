import type { ApiResponse } from "../types/api";
import type { MemberSubscriptionView } from "../types/membership";
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
};

export default membershipApi;
