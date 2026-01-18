export enum AffiliationStatus {
  PENDING = "pending",
  ACTIVE = "active",
  SUSPENDED = "suspended",
  TERMINATED = "terminated",
  DECLINED = "declined",
}

export interface GymCoachAffiliation {
  _id: string;
  gymId: string;
  coachId: string;
  status: AffiliationStatus;
  initiatedBy: "gym" | "coach";
  startDate: string | Date;
  endDate?: string | Date;
  permissions: {
    canScheduleSessions: boolean;
    canAccessFacilities: boolean;
  };
  isExclusive: boolean;
  commissionRate?: number;
  createdAt: string | Date;
  updatedAt: string | Date;

  // Populated fields
  gym?: {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
  coach?: {
    _id: string;
    fullName: string;
    username: string;
    profileImageUrl?: string;
    specializations?: string[];
  };
}

export interface InviteCoachDto {
  coachId: string;
  message?: string;
  permissions?: {
    canScheduleSessions?: boolean;
    canAccessFacilities?: boolean;
  };
  isExclusive?: boolean;
  commissionRate?: number;
}

export interface RequestGymAffiliationDto {
  message?: string;
}

export interface RespondToAffiliationDto {
  accept: boolean;
  message?: string;
}

export interface UpdateAffiliationDto {
  permissions?: {
    canScheduleSessions?: boolean;
    canAccessFacilities?: boolean;
  };
  isExclusive?: boolean;
  commissionRate?: number;
  status?: AffiliationStatus;
}
