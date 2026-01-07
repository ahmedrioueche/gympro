import { AuditInfo } from "./common";

// Export constant
export const ATTENDANCE_STATUSES = [
  "checked_in",
  "checked_out",
  "missed",
  "denied",
] as const;

// Derive type from constant
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export interface AttendanceRecord extends AuditInfo {
  _id?: string;
  gymId: string;
  userId?: string;
  checkIn: string | Date;
  checkOut?: string | Date;
  status: AttendanceStatus;
  notes?: string; // optional, e.g., "late entry"
  expiryDate?: string | Date;
}

/** Attendance record with populated gym info for member view */
export interface MemberAttendanceRecord
  extends Omit<AttendanceRecord, "gymId"> {
  gymId: {
    _id: string;
    name: string;
    location?: {
      address?: string;
      city?: string;
    };
  };
}

/** Attendance record with populated user info for gym manager view */
export interface GymAttendanceRecord extends Omit<AttendanceRecord, "userId"> {
  userId?: {
    _id: string;
    profile?: {
      fullName?: string;
      profileImageUrl?: string;
    };
  };
}
