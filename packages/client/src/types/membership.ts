import { AuditInfo } from "./common";
import { Gym } from "./gym";
import { RolePermissions } from "./role";
import { SubscriptionInfo } from "./subscription";
import { UserRole } from "./user";

export interface GymMembership extends AuditInfo {
  _id: string;
  gym: Gym;
  roles: UserRole[];
  joinedAt: string;
  membershipStatus: MembershipStatus;
  subscription?: SubscriptionInfo;
  customPermissions?: Partial<RolePermissions>;
}

export enum MembershipStatus {
  Active = "active",
  Pending = "pending",
  Banned = "banned",
  Left = "canceled",
  Expired = "expired",
}

/** Subscription view for member-facing pages with populated gym info */
export interface MemberSubscriptionView extends AuditInfo {
  _id: string;
  gym: {
    _id: string;
    name: string;
    location?: {
      address?: string;
      city?: string;
    };
    slogan?: string;
  };
  roles: UserRole[];
  joinedAt: string;
  membershipStatus: MembershipStatus;
  subscription?: SubscriptionInfo;
}
