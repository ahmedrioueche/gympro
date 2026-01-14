import type { GymPermission } from "../types/permissions";

export type StaffRole =
  | "manager"
  | "receptionist"
  | "coach"
  | "cleaner"
  | "maintenance";

export interface AddStaffDto {
  gymId: string;
  email?: string;
  phoneNumber?: string;
  fullName: string;
  role: StaffRole;
  permissions?: GymPermission[];
}

export interface UpdateStaffDto {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: StaffRole;
  permissions?: GymPermission[];
}

export interface StaffMember {
  membershipId: string;
  userId: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  role: StaffRole;
  permissions?: GymPermission[];
  joinedAt: string;
  accountStatus?: "active" | "pending_setup";
}
