import { ApiResponse } from "../types/api";
import { DashboardType } from "../types/user";
import { apiClient, handleApiError } from "./helper";

export interface RequestCoachAccessDto {
  certificationDetails: string;
}

export interface AvailableDashboardsResponse {
  dashboards: DashboardType[];
  defaultDashboard: DashboardType;
  gymsPerDashboard: Record<DashboardType, { _id: string; name: string }[]>;
}

export const dashboardApi = {
  /**
   * Request access to the coach dashboard (self-certification form).
   */
  requestCoachAccess: async (
    dto: RequestCoachAccessDto
  ): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    try {
      const res = await apiClient.post<
        ApiResponse<{ success: boolean; message: string }>
      >("/dashboard/request-coach", dto);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get available dashboards for the current user.
   */
  getAvailableDashboards: async (): Promise<
    ApiResponse<AvailableDashboardsResponse>
  > => {
    try {
      const res = await apiClient.get<ApiResponse<AvailableDashboardsResponse>>(
        "/dashboard/available"
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
