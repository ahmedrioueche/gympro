import {
  CreateAnnouncementDto,
  GymAnnouncement,
  UpdateAnnouncementDto,
} from "../types/announcement";
import { PaginatedResponse } from "../types/api";
import { apiClient, handleApiError } from "./helper";

export const announcementApi = {
  /** Get all announcements for a gym */
  getAll: async (
    gymId: string,
    params?: { page?: number; limit?: number; isActive?: boolean },
  ): Promise<PaginatedResponse<GymAnnouncement>> => {
    try {
      const queryParams: Record<string, any> = {
        gymId,
        page: params?.page || 1,
        limit: params?.limit || 20,
      };

      if (params?.isActive !== undefined) {
        queryParams.isActive = params.isActive;
      }

      const res = await apiClient.get<PaginatedResponse<GymAnnouncement>>(
        "/gym-announcements",
        { params: queryParams },
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Create a new announcement */
  create: async (data: CreateAnnouncementDto): Promise<GymAnnouncement> => {
    try {
      const res = await apiClient.post<GymAnnouncement>(
        "/gym-announcements",
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get a single announcement by ID */
  findOne: async (id: string): Promise<GymAnnouncement> => {
    try {
      const res = await apiClient.get<GymAnnouncement>(
        `/gym-announcements/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Update an announcement */
  update: async (
    id: string,
    data: UpdateAnnouncementDto,
  ): Promise<GymAnnouncement> => {
    try {
      const res = await apiClient.patch<GymAnnouncement>(
        `/gym-announcements/${id}`,
        data,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Delete an announcement */
  delete: async (id: string): Promise<GymAnnouncement> => {
    try {
      const res = await apiClient.delete<GymAnnouncement>(
        `/gym-announcements/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
