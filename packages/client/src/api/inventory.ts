import { CreateEquipmentDto, UpdateEquipmentDto } from "../dto/inventory";
import { ApiResponse } from "../types/api";
import { EquipmentItem } from "../types/inventory";
import { apiClient, handleApiError } from "./helper";

export const inventoryApi = {
  /**
   * Get all equipment for a gym (paginated)
   */
  findAll: async (
    gymId: string,
    options: {
      search?: string;
      category?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<ApiResponse<EquipmentItem[]>> => {
    try {
      const { search, category, page, limit } = options;
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());

      const res = await apiClient.get<ApiResponse<EquipmentItem[]>>(
        `/gyms/${gymId}/inventory?${params.toString()}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get equipment for gym members - doesn't require inventory:view permission
   */
  findAllForMembers: async (
    gymId: string,
    options: {
      search?: string;
      category?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<ApiResponse<EquipmentItem[]>> => {
    try {
      const { search, category, page, limit } = options;
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());

      const res = await apiClient.get<ApiResponse<EquipmentItem[]>>(
        `/gyms/${gymId}/inventory/member/equipment?${params.toString()}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single equipment item
   */
  findOne: async (
    gymId: string,
    id: string,
  ): Promise<ApiResponse<EquipmentItem>> => {
    try {
      const res = await apiClient.get<ApiResponse<EquipmentItem>>(
        `/gyms/${gymId}/inventory/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new equipment item
   */
  create: async (
    gymId: string,
    dto: CreateEquipmentDto,
  ): Promise<ApiResponse<EquipmentItem>> => {
    try {
      const res = await apiClient.post<ApiResponse<EquipmentItem>>(
        `/gyms/${gymId}/inventory`,
        dto,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an equipment item
   */
  update: async (
    gymId: string,
    id: string,
    dto: UpdateEquipmentDto,
  ): Promise<ApiResponse<EquipmentItem>> => {
    try {
      const res = await apiClient.put<ApiResponse<EquipmentItem>>(
        `/gyms/${gymId}/inventory/${id}`,
        dto,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Remove an equipment item
   */
  remove: async (
    gymId: string,
    id: string,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const res = await apiClient.delete<ApiResponse<{ success: boolean }>>(
        `/gyms/${gymId}/inventory/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
