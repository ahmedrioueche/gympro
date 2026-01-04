import { ApiResponse } from "../types/api";
import { apiClient, handleApiError } from "./helper";

export const aiApi = {
  getResponse: async (prompt: string): Promise<ApiResponse<string>> => {
    try {
      const res = await apiClient.post<ApiResponse<string>>("/ai", {
        prompt,
      });
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
