import {
  AppPaymentFilterDto,
  AppPaymentStatsDto,
  GetAppPaymentDto,
  GetAppPaymentsResponseDto,
} from "../dto/appPayment";
import { apiClient, handleApiError } from "./helper";

export const appPaymentsApi = {
  /**
   * Get current user's payments with filtering and pagination
   */
  getMyPayments: async (
    params: AppPaymentFilterDto = {}
  ): Promise<GetAppPaymentsResponseDto> => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);
      if (params.provider) queryParams.append("provider", params.provider);
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const response = await apiClient.get(
        `/app-payments/me?${queryParams.toString()}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || "Failed to fetch payments");
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get payment statistics for current user
   */
  getMyPaymentStats: async (): Promise<AppPaymentStatsDto> => {
    try {
      const response = await apiClient.get("/app-payments/stats");

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || "Failed to fetch payment stats");
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single payment by ID
   */
  getPaymentById: async (id: string): Promise<GetAppPaymentDto> => {
    try {
      const response = await apiClient.get(`/app-payments/${id}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || "Failed to fetch payment");
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
