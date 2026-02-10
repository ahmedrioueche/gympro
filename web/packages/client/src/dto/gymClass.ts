import { classBookingStatus } from "../types/gym";

export interface CreateGymClassDto {
  name: string;
  coachId?: string;
  maxCapacity: number;
  duration: number; // minutes
  scheduledAt: string | Date;
  service: string;
}

export interface UpdateGymClassDto {
  name?: string;
  coachId?: string;
  maxCapacity?: number;
  duration?: number;
  scheduledAt?: string | Date;
  service?: string;
}

export interface CreateClassBookingDto {
  classId: string;
}

export interface UpdateClassBookingDto {
  status: classBookingStatus;
}
