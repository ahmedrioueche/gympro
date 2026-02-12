import { classBookingStatus } from "../types/gym";

export interface CreateGymClassDto {
  name: string;
  coachId?: string;
  maxCapacity: number;
  duration: number; // minutes
  scheduledAt: string | Date;
  service: string;
  facilityId?: string;
  recurrence?: {
    type: "none" | "daily" | "weekly" | "biweekly" | "monthly" | "custom";
    endDate?: string | Date;
    days?: number[]; // For custom recurrence
    count?: number; // Optional: Create X occurrences
  };
}

export interface UpdateGymClassDto {
  name?: string;
  coachId?: string;
  maxCapacity?: number;
  duration?: number;
  scheduledAt?: string | Date;
  service?: string;
  facilityId?: string;
}

export interface CreateClassBookingDto {
  classId: string;
}

export interface UpdateClassBookingDto {
  status: classBookingStatus;
}
