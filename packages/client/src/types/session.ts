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
  endTime: Date | string;
  type: SessionType;
  status: SessionStatus;
  notes?: string;
  meetingLink?: string;
  location?: string;
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
  endTime: string; // ISO String
  type: SessionType;
  notes?: string;
  meetingLink?: string;
  location?: string;
}

export interface UpdateSessionDto {
  startTime?: string;
  endTime?: string;
  status?: SessionStatus;
  notes?: string;
  meetingLink?: string;
  location?: string;
}

export interface SessionQueryDto {
  startDate?: string;
  endDate?: string;
  coachId?: string;
  memberId?: string;
  status?: SessionStatus;
}
