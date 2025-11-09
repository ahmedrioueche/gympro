import { AppSubscription } from "./appBilling";
import { AuditInfo, TimeRange, WeeklyTimeRange } from "./common";
import { BaseSubscriptionType } from "./subscription";

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
  createdAt: string; // Timestamp of gym creation
  updatedAt?: string; // Timestamp of last update
  isActive: boolean; // Gym is active or deactivated
  ownerId: string; // ID of the gym owner
  defaultCurrency?: string; // For subscription/payment display (e.g., "DZD")
  settings?: GymSettings; // Optional nested settings object
  appSubscription?: AppSubscription;
}

export interface GymSettings {
  allowCustomSubscriptions?: boolean; // Can owner create custom subscription types?
  notificationsEnabled?: boolean; // Enable gym-wide notifications
  subscriptionRenewalReminderDays?: number; // Days before expiry to notify members
  workingHours?: TimeRange; // Default gym hours (mixed or general)
  isMixed?: boolean; // Can males and females train toghether at the same time?
  femaleOnlyHours?: WeeklyTimeRange[]; // Specific time ranges reserved for female members
  servicesOffered?: BaseSubscriptionType[]; // List of services offered at the gym
}

export interface ClassBooking extends AuditInfo {
  classId: string; // the scheduled class
  userId: string; // member booking
  status: "booked" | "cancelled" | "waitlisted";
  bookedAt: string;
}

export interface GymClass extends AuditInfo {
  gymId: string;
  name: string;
  coachId?: string;
  maxCapacity: number;
  scheduledAt: string; // datetime of class
  bookings: ClassBooking[];
}
