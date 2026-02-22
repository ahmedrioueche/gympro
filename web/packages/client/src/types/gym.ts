import { AppSubscription } from "./appSubscription";
import {
  AuditInfo,
  Currency,
  PaymentMethod,
  TimeRange,
  WeeklyTimeRange,
} from "./common";
import { User } from "./user";

export interface Facility {
  _id: string;
  name: string;
  capacity?: number;
  description?: string;
  createdAt?: string | Date;
}

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
  settings?: GymSettings; // Optional nested settings object
  memberStats?: GymStats;
  appSubscription?: AppSubscription;
  media?: GymMedia[];
  facilities?: Facility[];
  bannerUrl?: string;
  bannerPublicId?: string;
}

export const GYM_MEDIA_TYPES = ["image", "video", "document"] as const;
export type GymMediaType = (typeof GYM_MEDIA_TYPES)[number];

export const GYM_MEDIA_CATEGORIES = [
  "marketing",
  "facility",
  "class",
  "social",
] as const;
export type GymMediaCategory = (typeof GYM_MEDIA_CATEGORIES)[number];

export interface GymMedia {
  url: string;
  publicId: string;
  type: GymMediaType;
  category: GymMediaCategory;
  title?: string;
  description?: string;
  createdAt?: string | Date;
}

export type AccessControlType = "strict" | "flexible";

export interface GymService {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface GymSettings {
  paymentMethods: PaymentMethod[];
  defaultCurrency?: Currency; // For subscription/payment display (e.g., "DZD")
  allowCustomSubscriptions?: boolean; // Can owner create custom subscription types?
  notificationsEnabled?: boolean; // Enable gym-wide notifications
  notifyExpiringMembers?: boolean; // Enable manager notifications for expiring members
  reminderSettings?: {
    preExpiry?: {
      day3?: boolean;
      day1?: boolean; // Tomorrow
      today?: boolean; // Expires Today
    };
    postExpiry?: {
      day3?: boolean;
      day7?: boolean;
      day30?: boolean;
      day60?: boolean;
      day90?: boolean;
    };
  };
  subscriptionRenewalReminderDays?: number; // Days before expiry to notify members
  workingHours?: TimeRange; // Default gym hours (mixed or general)
  useAdvancedHours?: boolean; // If true, customWorkingHours are used instead of workingHours
  customWorkingHours?: WeeklyTimeRange[]; // Advanced/dynamic gym hours with multiple slots
  isMixed?: boolean; // Can males and females train toghether at the same time?
  femaleOnlyHours?: WeeklyTimeRange[]; // Specific time ranges reserved for female members
  servicesOffered?: GymService[]; // List of services offered at the gym
  accessControlType?: AccessControlType; // How to handle expired subscriptions during check-in
  rules?: string[]; // List of gym rules
  temporaryClosures?: TemporaryClosure[];
  workingDays?: number[]; // 0-6 (Sunday to Saturday)
  notifyScheduleChanges?: boolean; // Automatically notify members of schedule changes
}

export interface TemporaryClosure {
  start: string | Date;
  end: string | Date;
  reason?: string;
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
  _id: string;
  classId: string; // the scheduled class
  userId: string; // member booking
  status: classBookingStatus;
  bookedAt: string | Date;
}

export interface GymClass extends AuditInfo {
  _id: string;
  gymId: string;
  name: string;
  service: string;
  coachId?: string;
  maxCapacity: number;
  duration: number; // Duration in minutes
  scheduledAt: string | Date; // datetime of class
  bookings: ClassBooking[];
  status: "active" | "cancelled" | "completed";
  facilityId?: string;
  recurrence?: {
    type: "none" | "daily" | "weekly" | "biweekly" | "monthly" | "custom";
    endDate?: string | Date;
    days?: number[]; // For custom recurrence
  };
  seriesId?: string; // To link recurring classes
  isSeries?: boolean; // If true, this is a template for recurring classes
  equipment?: { itemId: string | any; quantity: number }[];
}
