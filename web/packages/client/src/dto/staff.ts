export type StaffRole = "manager" | "staff" | "coach";

export interface AddStaffDto {
  gymId: string;
  email?: string;
  phoneNumber?: string;
  fullName: string;
  role: StaffRole;
}

export interface UpdateStaffDto {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: StaffRole;
}

export interface StaffMember {
  membershipId: string;
  userId: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  role: StaffRole;
  joinedAt: string;
  accountStatus?: "active" | "pending_setup";
}
