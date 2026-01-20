import { AppSubscription } from "./appSubscription";
import { AttendanceRecord } from "./attendance";
import { AuditInfo } from "./common";
import { GymMembership } from "./membership";
import { AppNotification } from "./notification";
import { AppSettings } from "./settings";
import { SubscriptionHistory } from "./subscription";
import { ProgramHistory, ProgramProgress, TrainingProgram } from "./training";

export enum UserRole {
  Owner = "owner",
  Manager = "manager",
  Receptionist = "receptionist",
  Coach = "coach",
  Member = "member",
  Cleaner = "cleaner",
  Maintenance = "maintenance",
  Security = "security",
}

// Dashboard types (separate from UserRole - these determine which dashboards a user can access)
export const DASHBOARD_TYPES = ["member", "coach", "manager"] as const;
export type DashboardType = (typeof DASHBOARD_TYPES)[number];

// Coach verification status for future admin approval flow
export const COACH_VERIFICATION_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;
export type CoachVerificationStatus =
  (typeof COACH_VERIFICATION_STATUSES)[number];

export interface CoachVerification {
  status: CoachVerificationStatus;
  submittedAt?: string;
  certificationDetails?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface BaseUserProfile extends AuditInfo {
  username: string;
  email?: string;
  fullName?: string;
  bio?: string;
  age?: string;
  gender?: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  accountStatus?: "active" | "pending_setup";
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  isValidated?: boolean;
  isOnBoarded?: boolean;
}

export interface BaseUser extends AuditInfo {
  _id: string;
  profile: BaseUserProfile;
  appSubscription?: AppSubscription;
  appSettings?: AppSettings;
  memberships: GymMembership[];
  subscriptionHistory: SubscriptionHistory[];
  notifications: AppNotification[];
  attendanceHistory?: AttendanceRecord[];

  // Multi-dashboard access: which dashboards this user can access
  dashboardAccess?: DashboardType[];

  // Coach verification for coach dashboard access requests
  coachVerification?: CoachVerification;
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

export const STAFF_TYPES = ["manager", "reception"] as const;
export type StaffType = (typeof STAFF_TYPES)[number];

export interface ReceptionistUser extends BaseUser {
  role: "receptionist";
  staffType?: StaffType;
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

export type User = MemberUser | CoachUser | ReceptionistUser | OwnerManagerUser;
