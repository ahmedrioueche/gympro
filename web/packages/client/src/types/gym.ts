import { AppSubscription } from "./appSubscription";
import { AuditInfo, PaymentMethod, TimeRange, WeeklyTimeRange } from "./common";
import { BaseSubscriptionType } from "./subscription";
import { User } from "./user";

export interface Gym extends AuditInfo {
  _id: string;
  name: string;
  address?: string; // Full address of the gym
  city?: string;
  state?: string;
  country?: string;
  phone?: string; // Contact number
  email?: string; // General contact email
  website?: string; // Gym website or landing page
  timezone?: string; // Useful for scheduling and notifications
  logoUrl?: string; // Gym logo for display in dashboards
  slogan?: string;
  isActive: boolean; // Gym is active or deactivated
  owner: User;
  defaultCurrency?: string; // For subscription/payment display (e.g., "DZD")
  settings?: GymSettings; // Optional nested settings object
  memberStats?: GymStats;
  appSubscription?: AppSubscription;
}

export type AccessControlType = "strict" | "flexible";

export interface GymSettings {
  paymentMethods: PaymentMethod[];
  allowCustomSubscriptions?: boolean; // Can owner create custom subscription types?
  notificationsEnabled?: boolean; // Enable gym-wide notifications
  subscriptionRenewalReminderDays?: number; // Days before expiry to notify members
  workingHours?: TimeRange; // Default gym hours (mixed or general)
  isMixed?: boolean; // Can males and females train toghether at the same time?
  femaleOnlyHours?: WeeklyTimeRange[]; // Specific time ranges reserved for female members
  servicesOffered?: BaseSubscriptionType[]; // List of services offered at the gym
  accessControlType?: AccessControlType; // How to handle expired subscriptions during check-in
}

export interface GymStats {
  total: number; // Total registered members
  checkedIn: number; // Members currently in the gym (real-time)
  withActiveSubscriptions: number; // Members with valid subscriptions
  withExpiredSubscriptions: number; // Members with expired subscriptions
  pendingApproval: number; // Members waiting for approval/verification
}

export const CLASS_BOOKING_STATUSES = ["booked", "cancelled", "waitlisted"];
export type classBookingStatus = (typeof CLASS_BOOKING_STATUSES)[number];

export interface ClassBooking extends AuditInfo {
  classId: string; // the scheduled class
  userId: string; // member booking
  status: classBookingStatus;
  bookedAt: string | Date;
}

export interface GymClass extends AuditInfo {
  gymId: string;
  name: string;
  coachId?: string;
  maxCapacity: number;
  scheduledAt: string | Date; // datetime of class
  bookings: ClassBooking[];
}
