import { PaymentMethod } from "../types/common";

export interface CompleteOnboardingDto {
  role: string;
  gymName?: string;
  ownerName?: string;
  experience?: string;
  username?: string;
  age?: string;
  gender?: string;
  region?: string;
  regionName?: string;
  currency?: string;
  timezone?: string;

  // Location
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;

  // Coach-specific
  certifications?: string[];
  socialMediaLinks?: string[];
  bio?: string;
  documents?: { url: string; description: string; type: string }[];

  // Gym Owner-specific
  gymAddress?: string;
  gymCity?: string;
  gymCountry?: string;
  gymPhone?: string;
  gymLatitude?: number;
  gymLongitude?: number;
}

export interface CreateMemberDto {
  email?: string;
  phoneNumber?: string;
  fullName?: string;
  gender?: string;
  age?: string;
  gymId: string;
  // Subscription fields
  subscriptionTypeId?: string;
  subscriptionStartDate?: string | Date;
  subscriptionEndDate?: string | Date;
  paymentMethod?: PaymentMethod;
}

export interface EditUserDto {
  fullName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  age?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  profileImageUrl?: string;
}
