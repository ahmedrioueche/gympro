import { PaymentMethod, SupportedCurrency } from "../types/common";

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
}

export interface RegionDetectionResult {
  region: string;
  regionName: string;
  currency: SupportedCurrency;
  timezone?: string;
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
  subscriptionStartDate?: string;
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
