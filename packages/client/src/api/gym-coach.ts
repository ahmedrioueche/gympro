import type { ApiResponse } from "../types/api";
import type {
  GymCoachAffiliation,
  InviteCoachDto,
  RequestGymAffiliationDto,
  RespondToAffiliationDto,
  UpdateAffiliationDto,
} from "../types/gym-coach-affiliation";
import { getApiClient } from "./config";

export const gymCoachApi = {
  /**
   * Get all coaches affiliated with a gym (for gym managers)
   */
  getGymCoaches: async (
    gymId: string
  ): Promise<ApiResponse<GymCoachAffiliation[]>> => {
    try {
      const response = await getApiClient().get(`/gyms/${gymId}/coaches`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "AFFILIATION_001",
        message: error.response?.data?.message || "Failed to fetch gym coaches",
      };
    }
  },

  /**
   * Get all gyms a coach is affiliated with (for coaches)
   */
  getCoachGyms: async (): Promise<ApiResponse<GymCoachAffiliation[]>> => {
    try {
      const response = await getApiClient().get("/coaches/affiliations");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "AFFILIATION_002",
        message:
          error.response?.data?.message || "Failed to fetch coach affiliations",
      };
    }
  },

  /**
   * Get pending affiliation requests (for both gym and coach)
   */
  getPendingAffiliations: async (): Promise<
    ApiResponse<GymCoachAffiliation[]>
  > => {
    try {
      const response = await getApiClient().get("/affiliations/pending");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "AFFILIATION_003",
        message:
          error.response?.data?.message ||
          "Failed to fetch pending affiliations",
      };
    }
  },

  /**
   * Gym invites a coach to affiliate
   */
  inviteCoach: async (
    gymId: string,
    data: InviteCoachDto
  ): Promise<ApiResponse<GymCoachAffiliation>> => {
    try {
      const response = await getApiClient().post(
        `/gyms/${gymId}/coaches/invite`,
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "AFFILIATION_004",
        message: error.response?.data?.message || "Failed to invite coach",
      };
    }
  },

  /**
   * Coach requests to join a gym
   */
  requestGymAffiliation: async (
    gymId: string,
    data?: RequestGymAffiliationDto
  ): Promise<ApiResponse<GymCoachAffiliation>> => {
    try {
      const response = await getApiClient().post(
        `/gyms/${gymId}/coaches/request`,
        data || {}
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "AFFILIATION_005",
        message:
          error.response?.data?.message || "Failed to request affiliation",
      };
    }
  },

  /**
   * Respond to an affiliation request (accept/decline)
   */
  respondToAffiliation: async (
    affiliationId: string,
    data: RespondToAffiliationDto
  ): Promise<ApiResponse<GymCoachAffiliation>> => {
    try {
      const response = await getApiClient().patch(
        `/affiliations/${affiliationId}/respond`,
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "AFFILIATION_006",
        message:
          error.response?.data?.message ||
          "Failed to respond to affiliation request",
      };
    }
  },

  /**
   * Update an affiliation (permissions, commission, etc.)
   */
  updateAffiliation: async (
    affiliationId: string,
    data: UpdateAffiliationDto
  ): Promise<ApiResponse<GymCoachAffiliation>> => {
    try {
      const response = await getApiClient().patch(
        `/affiliations/${affiliationId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "AFFILIATION_007",
        message:
          error.response?.data?.message || "Failed to update affiliation",
      };
    }
  },

  /**
   * Terminate an affiliation
   */
  terminateAffiliation: async (
    affiliationId: string
  ): Promise<ApiResponse<void>> => {
    try {
      const response = await getApiClient().delete(
        `/affiliations/${affiliationId}`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        errorCode: error.response?.data?.errorCode || "AFFILIATION_008",
        message:
          error.response?.data?.message || "Failed to terminate affiliation",
      };
    }
  },
};

export default gymCoachApi;
