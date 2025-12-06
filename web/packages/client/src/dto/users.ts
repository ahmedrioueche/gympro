export interface CompleteOnboardingDto {
  role: string;
  gymName?: string;
  ownerName?: string;
  experience?: string;
  username?: string;
  age?: string;
  gender?: string;
}

export interface CreateMemberDto {
  email?: string;
  phoneNumber?: string;
  name?: string;
  fullName?: string;
  gender?: string;
  age?: string;
  gymId: string;
}
