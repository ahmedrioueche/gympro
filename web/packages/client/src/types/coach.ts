import { AuditInfo, Currency } from "./common";
import { SubscriptionPeriodUnit } from "./subscription";

// Coach request status
export const COACH_REQUEST_STATUSES = [
  "pending",
  "accepted",
  "declined",
  "cancelled",
] as const;
export type CoachRequestStatus = (typeof COACH_REQUEST_STATUSES)[number];

// Coach service types for pricing
export const COACH_SERVICE_TYPES = [
  "training",
  "nutrition",
  "training_nutrition",
  "online_coaching",
  "group_training",
  "consultation",
] as const;
export type CoachServiceType = (typeof COACH_SERVICE_TYPES)[number];

// Pricing tier for coach services
export interface CoachPricingTier extends AuditInfo {
  _id: string;
  coachId: string;
  serviceType: CoachServiceType;
  name: string;
  description?: string;
  duration: number;
  durationUnit: SubscriptionPeriodUnit;
  price: number;
  currency: Currency;
  isActive: boolean;
}

// DTO for creating/updating pricing
export interface CoachPricingTierDto {
  serviceType: CoachServiceType;
  name: string;
  description?: string;
  duration: number;
  durationUnit: SubscriptionPeriodUnit;
  price: number;
  currency: Currency;
  isActive?: boolean;
}

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
  pricing?: CoachPricingTier[];
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
