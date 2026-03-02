import { ApiResponse } from "../types/api";
import { CreateReportDto, Report } from "../types/report";
import { apiClient, handleApiError } from "./helper";

export const reportsApi = {
  createReport: async (data: CreateReportDto): Promise<ApiResponse<Report>> => {
    try {
      const res = await apiClient.post<ApiResponse<Report>>("/reports", data);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getMyReports: async (): Promise<ApiResponse<Report[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<Report[]>>("/reports/my");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getReport: async (id: string): Promise<ApiResponse<Report>> => {
    try {
      const res = await apiClient.get<ApiResponse<Report>>(`/reports/${id}`);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  addResponse: async (
    reportId: string,
    data: import("../types/report").AddReportResponseDto,
  ): Promise<ApiResponse<Report>> => {
    try {
      const res = await apiClient.post<ApiResponse<Report>>(
        `/reports/${reportId}/response`,
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  addAttachments: async (
    reportId: string,
    attachments: string[],
  ): Promise<ApiResponse<Report>> => {
    try {
      const res = await apiClient.post<ApiResponse<Report>>(
        `/reports/${reportId}/attachments`,
        { attachments },
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
