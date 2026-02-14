export enum SessionType {
  ONE_ON_ONE = "one_on_one",
  CONSULTATION = "consultation",
  CHECK_IN = "check_in",
  ASSESSMENT = "assessment",
}

export enum SessionStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
  PENDING = "pending",
}

export interface Session {
  _id: string;
  coachId: string;
  memberId: string;
  startTime: Date | string; // ISO string in JSON
  duration: number; // minutes
  endTime: Date | string;
  type: SessionType;
  status: SessionStatus;
  notes?: string;
  meetingLink?: string;
  location?: string;
  facilityId?: string;
  price?: number;
  currency?: string;
  gymId?: string;
  seriesId?: string;
  recurrence?: {
    type: "none" | "daily" | "weekly" | "biweekly" | "monthly" | "custom";
    endDate?: string | Date;
    days?: number[];
  };
  equipment?: { itemId: string | any; quantity: number }[];
  createdAt: Date | string;
  updatedAt: Date | string;

  // Optional populated fields for UI
  member?: {
    _id: string;
    fullName: string;
    username: string;
    profileImageUrl?: string;
  };
  coach?: {
    _id: string;
    fullName: string;
    username: string;
    profileImageUrl?: string;
  };
}

export interface CreateSessionDto {
  memberId: string;
  startTime: string; // ISO String
  duration: number; // minutes
  type: SessionType;
  notes?: string;
  meetingLink?: string;
  location?: string;
  facilityId?: string;
  gymId?: string;
  recurrence?: {
    type: "none" | "daily" | "weekly" | "biweekly" | "monthly" | "custom";
    endDate?: string | Date;
    days?: number[];
  };
  equipment?: { itemId: string; quantity: number }[];
}

export interface UpdateSessionDto {
  startTime?: string;
  duration?: number;
  status?: SessionStatus;
  notes?: string;
  meetingLink?: string;
  location?: string;
  facilityId?: string;
  equipment?: { itemId: string; quantity: number }[];
}

export interface SessionQueryDto {
  startDate?: string;
  endDate?: string;
  coachId?: string;
  memberId?: string;
  status?: SessionStatus;
  gymId?: string;
}
