import type { CoachQueryDto, RequestCoachDto } from "../dto/coach";
import type { ApiResponse } from "../types/api";
import type { CoachProfile, CoachRequest } from "../types/coach";
import { getApiClient } from "./config";

export const coachApi = {
  /**
   * Get nearby coaches based on location
   */
  getNearbyCoaches: async (
    query?: CoachQueryDto
  ): Promise<ApiResponse<CoachProfile[]>> => {
    try {
      const params = new URLSearchParams();
      if (query?.city) params.append("city", query.city);
      if (query?.state) params.append("state", query.state);
      if (query?.country) params.append("country", query.country);
      if (query?.specialization)
        params.append("specialization", query.specialization);
      if (query?.limit) params.append("limit", query.limit.toString());
      if (query?.offset) params.append("offset", query.offset.toString());

      const queryString = params.toString();
      const url = `/coaches/nearby${queryString ? `?${queryString}` : ""}`;

      const response = await getApiClient().get(url);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "COACH_001",
        message: error.response?.data?.message || "Failed to fetch coaches",
      };
    }
  },

  /**
   * Request a coach's services
   */
  requestCoach: async (
    coachId: string,
    data: RequestCoachDto
  ): Promise<ApiResponse<CoachRequest>> => {
    try {
      const response = await getApiClient().post(
        `/coaches/${coachId}/request`,
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "COACH_002",
        message:
          error.response?.data?.message || "Failed to send coach request",
      };
    }
  },

  /**
   * Get my coach requests (as a member)
   */
  getMyCoachRequests: async (): Promise<ApiResponse<CoachRequest[]>> => {
    try {
      const response = await getApiClient().get("/coaches/requests/my");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "COACH_003",
        message:
          error.response?.data?.message || "Failed to fetch coach requests",
      };
    }
  },
};

export default coachApi;
