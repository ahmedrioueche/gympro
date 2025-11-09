import { AuditInfo } from "./common";
import { GymMembership } from "./membership";
import { AppNotification } from "./notification";
import { SubscriptionHistory } from "./subscription";
import { TrainingProgram, ProgramProgress, ProgramHistory } from "./training";

export enum UserRole {
  Owner = "owner",
  Manager = "manager",
  Staff = "staff",
  Coach = "coach",
  Member = "member",
}

export interface BaseUserProfile {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  age?: string;
  gender?: string;
  profileImageUrl?: string;
  phoneNumber?: string;
}

export interface BaseUser extends AuditInfo {
  profile: BaseUserProfile;
  memberships: GymMembership[];
  subscriptionHistory: SubscriptionHistory[];
  notifications: AppNotification[];
  attendanceHistory?: AttendanceRecord[];
}

export interface MemberUser extends BaseUser {
  role: "member";
  currentProgram?: TrainingProgram;
  programProgress?: ProgramProgress;
  programHistory?: ProgramHistory[];
  coachingInfo?: {
    coachId?: string;
    suggestedPrograms?: string[];
  };
}

export interface CoachUser extends BaseUser {
  role: "coach";
  coachingInfo: {
    coachedMembers: string[];
    suggestedPrograms: string[];
  };
  certifications?: string[];
}

export interface StaffUser extends BaseUser {
  role: "staff";
  staffType?: "reception" | "cleaning" | "admin";
  assignedTasks?: string[];
}

export interface OwnerManagerUser extends BaseUser {
  role: "owner" | "manager";
  gymAccess: {
    canManageSubscriptions: boolean;
    canManageMembers: boolean;
    canManageStaff: boolean;
  };
}

export interface AttendanceRecord extends AuditInfo {
  gymId: string;
  userId: string;
  checkIn: string; // ISO datetime
  checkOut?: string; // optional until the member leaves
  status: "checked_in" | "checked_out" | "missed";
  notes?: string; // optional, e.g., "late entry"
}

export type User = MemberUser | CoachUser | StaffUser | OwnerManagerUser;
