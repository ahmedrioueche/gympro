import type {
  CoachQueryDto,
  ProspectiveMembersQueryDto,
  RequestCoachDto,
  RespondToRequestDto,
  SendCoachRequestDto,
} from "../dto/coach";
import type { ApiResponse } from "../types/api";
import type {
  CoachClient,
  CoachProfile,
  CoachRequest,
  CoachRequestWithDetails,
  ProspectiveMember,
} from "../types/coach";
import { getApiClient } from "./config";

export const coachApi = {
  /**
   * Get a single coach profile by userId
   */
  getCoachProfile: async (
    coachId: string
  ): Promise<ApiResponse<CoachProfile>> => {
    try {
      const response = await getApiClient().get(`/coaches/${coachId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "COACH_001",
        message:
          error.response?.data?.message || "Failed to fetch coach profile",
      };
    }
  },

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

  // ============================================
  // COACH-SIDE CLIENT MANAGEMENT
  // ============================================

  /**
   * Get pending requests (received by coach)
   */
  getPendingRequests: async (): Promise<
    ApiResponse<CoachRequestWithDetails[]>
  > => {
    try {
      const response = await getApiClient().get("/coaches/requests/pending");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "COACH_003",
        message:
          error.response?.data?.message || "Failed to fetch pending requests",
      };
    }
  },

  /**
   * Respond to a coaching request (accept or decline)
   */
  respondToRequest: async (
    requestId: string,
    data: RespondToRequestDto
  ): Promise<ApiResponse<CoachRequest>> => {
    try {
      const response = await getApiClient().patch(
        `/coaches/requests/${requestId}/respond`,
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "COACH_006",
        message:
          error.response?.data?.message || "Failed to respond to request",
      };
    }
  },

  /**
   * Get active clients (members being coached)
   */
  getActiveClients: async (): Promise<ApiResponse<CoachClient[]>> => {
    try {
      const response = await getApiClient().get("/coaches/clients");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "COACH_007",
        message:
          error.response?.data?.message || "Failed to fetch active clients",
      };
    }
  },

  /**
   * Get prospective members (members looking for a coach)
   */
  getProspectiveMembers: async (
    query?: ProspectiveMembersQueryDto
  ): Promise<ApiResponse<ProspectiveMember[]>> => {
    try {
      const params = new URLSearchParams();
      if (query?.gymId) params.append("gymId", query.gymId);
      if (query?.city) params.append("city", query.city);
      if (query?.state) params.append("state", query.state);
      if (query?.country) params.append("country", query.country);
      if (query?.limit) params.append("limit", query.limit.toString());
      if (query?.offset) params.append("offset", query.offset.toString());

      const queryString = params.toString();
      const url = `/coaches/prospective-members${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await getApiClient().get(url);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "COACH_008",
        message:
          error.response?.data?.message ||
          "Failed to fetch prospective members",
      };
    }
  },

  /**
   * Send coaching request to a member (coach initiates)
   */
  sendRequestToMember: async (
    memberId: string,
    data: SendCoachRequestDto
  ): Promise<ApiResponse<CoachRequest>> => {
    try {
      const response = await getApiClient().post(
        `/coaches/members/${memberId}/request`,
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "COACH_002",
        message:
          error.response?.data?.message || "Failed to send coaching request",
      };
    }
  },

  /**
   * Get coach analytics data
   */
  getAnalytics: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await getApiClient().get("/coaches/analytics");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "COACH_001",
        message: error.response?.data?.message || "Failed to fetch analytics",
      };
    }
  },
  /**
   * Assign a program to a client
   */
  assignProgram: async (
    clientId: string,
    programId: string
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await getApiClient().post(
        `/coaches/clients/${clientId}/program`,
        { programId }
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "COACH_ACTION_FAILED",
        message: error.response?.data?.message || "Failed to assign program",
      };
    }
  },
};

export default coachApi;
