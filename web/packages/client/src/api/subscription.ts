import {
  CreateSubscriptionTypeDto,
  UpdateSubscriptionTypeDto,
} from "../dto/subscription";
import { ApiResponse } from "../types/api";
import { SubscriptionType } from "../types/subscription";
import { apiClient, handleApiError } from "./helper";

export const subscriptionApi = {
  getSubscriptionTypes: async (
    gymId: string
  ): Promise<ApiResponse<SubscriptionType[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<SubscriptionType[]>>(
        `/gyms/${gymId}/subscription-types`
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createSubscriptionType: async (
    gymId: string,
    data: CreateSubscriptionTypeDto
  ): Promise<ApiResponse<SubscriptionType>> => {
    try {
      const res = await apiClient.post<ApiResponse<SubscriptionType>>(
        `/gyms/${gymId}/subscription-types`,
        data
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateSubscriptionType: async (
    gymId: string,
    id: string,
    data: UpdateSubscriptionTypeDto
  ): Promise<ApiResponse<SubscriptionType>> => {
    try {
      const res = await apiClient.put<ApiResponse<SubscriptionType>>(
        `/gyms/${gymId}/subscription-types/${id}`,
        data
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteSubscriptionType: async (
    gymId: string,
    id: string
  ): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.delete<ApiResponse<void>>(
        `/gyms/${gymId}/subscription-types/${id}`
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
