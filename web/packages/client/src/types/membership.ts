import { AuditInfo } from "./common";
import { Gym } from "./gym";
import { PaymentTransaction } from "./payment";
import { RolePermissions } from "./role";
import { SubscriptionInfo, SubscriptionType } from "./subscription";
import { User, UserRole } from "./user";

export interface MembershipSettings {
  general: {
    weightUnit: "kg" | "lbs";
  };
  notifications: {
    classReminders: boolean;
    subscriptionRenewal: boolean;
    announcements: boolean;
  };
  privacy: {
    publicProfile: boolean;
    shareProgressWithCoaches: boolean;
  };
}

export interface GymMembership extends AuditInfo {
  _id: string;
  gym: Gym;
  roles: UserRole[];
  joinedAt: string;
  membershipStatus: MembershipStatus;
  subscription?: SubscriptionInfo;
  customPermissions?: Partial<RolePermissions>;
  settings?: MembershipSettings;
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
  settings?: MembershipSettings;
}

/** Member profile view for gym manager member profile page */
export interface MemberProfileView {
  membership: {
    _id: string;
    joinedAt: string;
    membershipStatus: MembershipStatus;
    roles: UserRole[];
    subscription?: SubscriptionInfo;
  };
  user: User;
  payments: PaymentTransaction[];
  subscriptionType?: SubscriptionType;
}
