import { UpdateSettingsDto } from "../dto/settings";
import { ApiResponse } from "../types/api";
import { AppSettings } from "../types/settings";
import { apiClient, handleApiError } from "./helper";

export const settingsApi = {
  /** Get current user settings */
  getSettings: async (): Promise<ApiResponse<AppSettings>> => {
    try {
      const res = await apiClient.get<ApiResponse<AppSettings>>("/settings");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Update current user settings */
  updateSettings: async (
    data: UpdateSettingsDto
  ): Promise<ApiResponse<AppSettings>> => {
    try {
      const res = await apiClient.patch<ApiResponse<AppSettings>>(
        "/settings",
        data
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
