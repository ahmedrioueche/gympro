import type { Gym } from './gym';

export interface UserProfile {
  _id: string;
  role: UserRole;
  username: string;
  fullName: string;
  email: string;
  gym: Gym;
  createdAt: string;
  isVerified?: boolean;
  isOnBoarded?: boolean;
  isActive?: boolean;
}

export type UserRole = 'owner' | 'manager' | 'coach' | 'member';
