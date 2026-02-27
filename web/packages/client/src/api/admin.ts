import {
  AppFeaturePackage,
  CreateAppFeaturePackageDto,
  CreateAppPlanDto,
  UpdateAppFeaturePackageDto,
  UpdateAppPlanDto,
} from "../dto/appSubscription";
import { CreateEditorDto } from "../dto/user";
import { ApiResponse } from "../types/api";
import { AdminPaymentView } from "../types/appPayment";
import { AdminSubscriptionView, AppPlan } from "../types/appSubscription";
import { Gym } from "../types/gym";
import { Report, ReportStatus } from "../types/report";
import { AdminDashboardStats } from "../types/stats";
import { AppEditorUser, User } from "../types/user";
import { apiClient, handleApiError } from "./helper";

export const adminApi = {
  getDashboardStats: async (): Promise<ApiResponse<AdminDashboardStats>> => {
    try {
      const res = await apiClient.get<ApiResponse<AdminDashboardStats>>(
        "/admin/dashboard-stats",
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createEditor: async (
    data: CreateEditorDto,
  ): Promise<ApiResponse<AppEditorUser>> => {
    try {
      const res = await apiClient.post<ApiResponse<AppEditorUser>>(
        "/admin/editors",
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getEditors: async (): Promise<ApiResponse<AppEditorUser[]>> => {
    try {
      const res =
        await apiClient.get<ApiResponse<AppEditorUser[]>>("/admin/editors");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateEditorPermissions: async (
    id: string,
    permissions: string[],
  ): Promise<ApiResponse<AppEditorUser>> => {
    try {
      const res = await apiClient.put<ApiResponse<AppEditorUser>>(
        `/admin/editors/${id}/permissions`,
        { permissions },
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteEditor: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.delete<ApiResponse<void>>(
        `/admin/editors/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCoachRequests: async (): Promise<ApiResponse<User[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<User[]>>(
        "/admin/coach-requests",
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  approveCoachRequest: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.post<ApiResponse<void>>(
        `/admin/coach-requests/${userId}/approve`,
        {},
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  rejectCoachRequest: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.post<ApiResponse<void>>(
        `/admin/coach-requests/${userId}/reject`,
        {},
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCoaches: async (): Promise<ApiResponse<User[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<User[]>>("/admin/coaches");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  removeCoach: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.delete<ApiResponse<void>>(
        `/admin/coaches/${userId}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Admin: Create Plan */
  createPlan: async (data: CreateAppPlanDto): Promise<ApiResponse<AppPlan>> => {
    try {
      const res = await apiClient.post<ApiResponse<AppPlan>>(
        "/app-plans",
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Admin: Update Plan */
  updatePlan: async (
    id: string,
    data: UpdateAppPlanDto,
  ): Promise<ApiResponse<AppPlan>> => {
    try {
      const res = await apiClient.put<ApiResponse<AppPlan>>(
        `/app-plans/${id}`,
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Admin: Delete Plan */
  deletePlan: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.delete<ApiResponse<void>>(`/app-plans/${id}`);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  /** Admin: Get all subscriptions */
  getSubscriptions: async (): Promise<ApiResponse<AdminSubscriptionView[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<AdminSubscriptionView[]>>(
        "/admin/subscriptions",
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  /** Admin: Get all payments */
  getPayments: async (): Promise<ApiResponse<AdminPaymentView[]>> => {
    try {
      const res =
        await apiClient.get<ApiResponse<AdminPaymentView[]>>("/admin/payments");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  /** Admin: Get all users */
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<User[]>>("/admin/users");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  /** Admin: Toggle user status (active/inactive) */
  updateUserStatus: async (userId: string): Promise<ApiResponse<any>> => {
    try {
      const res = await apiClient.put<ApiResponse<any>>(
        `/admin/users/${userId}/status`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  /** Admin: Get all gyms */
  getGyms: async (): Promise<ApiResponse<Gym[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<Gym[]>>("/admin/gyms");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  /** Admin: Toggle gym status (active/inactive) */
  updateGymStatus: async (gymId: string): Promise<ApiResponse<any>> => {
    try {
      const res = await apiClient.put<ApiResponse<any>>(
        `/admin/gyms/${gymId}/status`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  /** Admin: Get all reports */
  getReports: async (): Promise<ApiResponse<Report[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<Report[]>>("/reports/admin");
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  /** Admin: Update report status */
  updateReportStatus: async (
    id: string,
    status: ReportStatus,
  ): Promise<ApiResponse<Report>> => {
    try {
      const res = await apiClient.patch<ApiResponse<Report>>(
        `/reports/admin/${id}/status`,
        { status },
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Admin: Get all alerts */
  getAlerts: async (): Promise<
    ApiResponse<import("../types/alert").Alert[]>
  > => {
    try {
      const res =
        await apiClient.get<ApiResponse<import("../types/alert").Alert[]>>(
          "/admin/alerts",
        );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Admin: Update alert status */
  updateAlertStatus: async (
    id: string,
    status: import("../types/alert").AlertStatus,
  ): Promise<ApiResponse<import("../types/alert").Alert>> => {
    try {
      const res = await apiClient.patch<
        ApiResponse<import("../types/alert").Alert>
      >(`/admin/alerts/${id}/status`, { status });
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Admin: Add response to report */
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

  /** Admin: Feature Packages */
  getFeaturePackages: async (
    activeOnly = false,
  ): Promise<ApiResponse<AppFeaturePackage[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<AppFeaturePackage[]>>(
        `/admin/feature-packages`,
        { params: { activeOnly } },
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getFeaturePackage: async (
    id: string,
  ): Promise<ApiResponse<AppFeaturePackage>> => {
    try {
      const res = await apiClient.get<ApiResponse<AppFeaturePackage>>(
        `/admin/feature-packages/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createFeaturePackage: async (
    data: CreateAppFeaturePackageDto,
  ): Promise<ApiResponse<AppFeaturePackage>> => {
    try {
      const res = await apiClient.post<ApiResponse<AppFeaturePackage>>(
        `/admin/feature-packages`,
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateFeaturePackage: async (
    id: string,
    data: UpdateAppFeaturePackageDto,
  ): Promise<ApiResponse<AppFeaturePackage>> => {
    try {
      const res = await apiClient.put<ApiResponse<AppFeaturePackage>>(
        `/admin/feature-packages/${id}`,
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteFeaturePackage: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.delete<ApiResponse<void>>(
        `/admin/feature-packages/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
