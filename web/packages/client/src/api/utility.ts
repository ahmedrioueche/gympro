import { ApiResponse } from "../types/api";
import { apiClient, handleApiError } from "./helper";

export const utilityApi = {
  /** Wake up server */
  wakeUpServer: async (): Promise<ApiResponse<null>> => {
    try {
      const res = await apiClient.post<ApiResponse<null>>("/wake-up");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
