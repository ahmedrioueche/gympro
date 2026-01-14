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
