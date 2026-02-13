import {
  CreateClassBookingDto,
  CreateGymClassDto,
  UpdateGymClassDto,
} from "../dto/gymClass";
import { ApiResponse } from "../types/api";
import { GymClass } from "../types/gym";
import { apiClient, handleApiError } from "./helper";

export const gymClassApi = {
  /** Get all classes for a gym */
  getGymClasses: async (gymId: string): Promise<ApiResponse<GymClass[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<GymClass[]>>(
        `/gym-class/gym/${gymId}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get all classes for the logged-in coach */
  getCoachClasses: async (): Promise<ApiResponse<GymClass[]>> => {
    try {
      const res =
        await apiClient.get<ApiResponse<GymClass[]>>(`/gym-class/coach/me`);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get all classes the logged-in member has booked */
  getMemberClasses: async (): Promise<ApiResponse<GymClass[]>> => {
    try {
      const res =
        await apiClient.get<ApiResponse<GymClass[]>>(`/gym-class/member/me`);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get a single class */
  getClass: async (id: string): Promise<ApiResponse<GymClass>> => {
    try {
      const res = await apiClient.get<ApiResponse<GymClass>>(
        `/gym-class/${id}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Create a new class */
  createClass: async (
    gymId: string,
    dto: CreateGymClassDto,
  ): Promise<ApiResponse<GymClass>> => {
    try {
      const res = await apiClient.post<ApiResponse<GymClass>>(
        `/gym-class/gym/${gymId}`,
        dto,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Update a class */
  updateClass: async (
    id: string,
    dto: UpdateGymClassDto,
    updateSeries = false,
  ): Promise<ApiResponse<GymClass>> => {
    try {
      const res = await apiClient.patch<ApiResponse<GymClass>>(
        `/gym-class/${id}${updateSeries ? "?updateSeries=true" : ""}`,
        dto,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Delete a class */
  deleteClass: async (
    id: string,
    deleteSeries = false,
    hardDelete = false,
  ): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.delete<ApiResponse<void>>(
        `/gym-class/${id}?deleteSeries=${deleteSeries}&hardDelete=${hardDelete}`,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Restore a class */
  restoreClass: async (
    id: string,
    restoreSeries = false,
  ): Promise<ApiResponse<void>> => {
    try {
      const res = await apiClient.patch<ApiResponse<void>>(
        `/gym-class/${id}/restore?restoreSeries=${restoreSeries}`,
        {},
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Book a spot in a class */
  bookClass: async (
    dto: CreateClassBookingDto,
  ): Promise<ApiResponse<GymClass>> => {
    try {
      const res = await apiClient.post<ApiResponse<GymClass>>(
        `/gym-class/book`,
        dto,
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Cancel a booking */
  cancelBooking: async (classId: string): Promise<ApiResponse<GymClass>> => {
    try {
      const res = await apiClient.post<ApiResponse<GymClass>>(
        `/gym-class/cancel-booking`,
        { classId },
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
