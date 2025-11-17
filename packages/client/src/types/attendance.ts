import { AuditInfo } from './common';

// Export constant
export const ATTENDANCE_STATUSES = ['checked_in', 'checked_out', 'missed'] as const;

// Derive type from constant
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export interface AttendanceRecord extends AuditInfo {
  gymId: string;
  userId: string;
  checkIn: string | Date;
  checkOut?: string | Date;
  status: AttendanceStatus;
  notes?: string; // optional, e.g., "late entry"
}
