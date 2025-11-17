import { AttendanceRecord } from './attendance';
import { AuditInfo } from './common';
import { GymMembership } from './membership';
import { AppNotification } from './notification';
import { SubscriptionHistory } from './subscription';
import { ProgramHistory, ProgramProgress, TrainingProgram } from './training';

export enum UserRole {
  Owner = 'owner',
  Manager = 'manager',
  Staff = 'staff',
  Coach = 'coach',
  Member = 'member',
}

export interface BaseUserProfile extends AuditInfo {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  age?: string;
  gender?: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  isValidated?: boolean;
  isOnBoarded?: boolean;
}

export interface BaseUser extends AuditInfo {
  profile: BaseUserProfile;
  memberships: GymMembership[];
  subscriptionHistory: SubscriptionHistory[];
  notifications: AppNotification[];
  attendanceHistory?: AttendanceRecord[];
}

export interface MemberUser extends BaseUser {
  role: 'member';
  currentProgram?: TrainingProgram;
  programProgress?: ProgramProgress;
  programHistory?: ProgramHistory[];
  coachingInfo?: {
    coachId?: string;
    suggestedPrograms?: string[];
  };
}

export interface CoachUser extends BaseUser {
  role: 'coach';
  coachingInfo: {
    coachedMembers: string[];
    suggestedPrograms: string[];
  };
  certifications?: string[];
}

export const STAFF_TYPES = ['reception', 'cleaning', 'admin'] as const;
export type StaffType = (typeof STAFF_TYPES)[number];

export interface StaffUser extends BaseUser {
  role: 'staff';
  staffType?: StaffType;
  assignedTasks?: string[];
}

export interface OwnerManagerUser extends BaseUser {
  role: 'owner' | 'manager';
  gymAccess: {
    canManageSubscriptions: boolean;
    canManageMembers: boolean;
    canManageStaff: boolean;
  };
}

export type User = MemberUser | CoachUser | StaffUser | OwnerManagerUser;
