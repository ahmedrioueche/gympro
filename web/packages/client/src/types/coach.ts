import { AuditInfo } from "./common";

// Coach request status
export const COACH_REQUEST_STATUSES = [
  "pending",
  "accepted",
  "declined",
  "cancelled",
] as const;
export type CoachRequestStatus = (typeof COACH_REQUEST_STATUSES)[number];

// Coach request from a member to a coach
export interface CoachRequest extends AuditInfo {
  _id: string;
  memberId: string;
  coachId: string;
  message?: string;
  status: CoachRequestStatus;
  respondedAt?: string;
  response?: string;
}

// Coach request with member/coach details
export interface CoachRequestWithDetails extends CoachRequest {
  memberDetails?: {
    username: string;
    fullName?: string;
    profileImageUrl?: string;
    location?: string;
  };
  coachDetails?: {
    username: string;
    fullName?: string;
    profileImageUrl?: string;
  };
}

// Coach profile info for discovery
export interface CoachProfile {
  userId: string;
  username: string;
  fullName?: string;
  profileImageUrl?: string;
  bio?: string;
  specializations?: string[];
  yearsOfExperience?: number;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  certifications?: Array<{
    name: string;
    organization?: string;
    year?: number;
  }>;
  rating?: number;
  totalClients?: number;
  isVerified?: boolean;
}

// Active client profile (for coaches)
export interface CoachClient {
  userId: string;
  username: string;
  fullName?: string;
  profileImageUrl?: string;
  email?: string;
  age?: string;
  gender?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  joinedAt?: string;
  currentProgram?: {
    programId: string;
    programName: string;
  };
  lastWorkoutDate?: string;
}

// Prospective member (looking for coach)
export interface ProspectiveMember {
  userId: string;
  username: string;
  fullName?: string;
  profileImageUrl?: string;
  age?: string;
  gender?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  gymMemberships?: string[];
  hasCoach: boolean;
}
