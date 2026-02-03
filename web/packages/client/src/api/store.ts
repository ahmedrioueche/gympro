import { ApiResponse } from "../types/api";
import { CreateProductDto, Product, UpdateProductDto } from "../types/product";
import { apiClient, handleApiError } from "./helper";

export const storeApi = {
  getProducts: async (
    gymId: string,
    params: {
      search?: string;
      category?: string;
      status?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<
    ApiResponse<{ data: Product[]; total: number; totalPages: number }>
  > => {
    try {
      const res = await apiClient.get<
        ApiResponse<{ data: Product[]; total: number; totalPages: number }>
      >(`/gyms/${gymId}/store`, { params });
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getProduct: async (
    gymId: string,
    id: string,
  ): Promise<ApiResponse<Product>> => {
    try {
      const res = await apiClient.get<ApiResponse<Product>>(
        `/gyms/${gymId}/store/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createProduct: async (
    gymId: string,
    data: CreateProductDto,
  ): Promise<ApiResponse<Product>> => {
    try {
      const res = await apiClient.post<ApiResponse<Product>>(
        `/gyms/${gymId}/store`,
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateProduct: async (
    gymId: string,
    id: string,
    data: UpdateProductDto,
  ): Promise<ApiResponse<Product>> => {
    try {
      const res = await apiClient.patch<ApiResponse<Product>>(
        `/gyms/${gymId}/store/${id}`,
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteProduct: async (
    gymId: string,
    id: string,
  ): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.delete<ApiResponse<void>>(
        `/gyms/${gymId}/store/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
