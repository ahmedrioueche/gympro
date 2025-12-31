import type { ApiResponse } from "../types/api";
import type { AttendanceRecord } from "../types/attendance";
import { apiClient, handleApiError } from "./helper";

export const attendanceApi = {
  /** Check-in member using QR token */
  checkIn: async (
    token: string,
    gymId: string
  ): Promise<ApiResponse<AttendanceRecord>> => {
    try {
      const res = await apiClient.post<ApiResponse<AttendanceRecord>>(
        "/attendance/check-in",
        { token, gymId }
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Generate access token for member QR code */
  getAccessToken: async (
    gymId: string
  ): Promise<ApiResponse<{ token: string; expiresAt: number }>> => {
    try {
      const res = await apiClient.get<
        ApiResponse<{ token: string; expiresAt: number }>
      >(`/attendance/access-token/${gymId}`);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get recent attendance logs for a gym */
  getLogs: async (gymId: string): Promise<ApiResponse<AttendanceRecord[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<AttendanceRecord[]>>(
        `/attendance/logs/${gymId}`
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default attendanceApi;
