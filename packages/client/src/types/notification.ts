export type NotificationStatus = "unread" | "read" | "archived";
export type NotificationPriority = "low" | "medium" | "high";

// Base notification interface
export interface BaseNotification {
  _id: string;
  userId: string; // recipient
  title: string;
  message: string;
  createdAt: string;
  status: NotificationStatus;
  priority?: NotificationPriority;
  type: NotificationType; // see below
  gymId?: string;
}

// Notification type can vary per role
export type NotificationType =
  | "subscription" // for subscription updates, renewal, expiry
  | "payment" // for payment confirmation/failure
  | "program" // program assignment, suggestions
  | "reminder" // general reminders
  | "alert" // urgent alert
  | "announcement" // gym-wide announcements
  | "membership"; // membership updates

// Specialized notifications per role
export interface MemberNotification extends BaseNotification {
  type: "subscription" | "program" | "reminder" | "alert";
  relatedProgramId?: string; // if notification is about a program
  relatedCoachId?: string; // if assigned by a coach
}

export interface CoachNotification extends BaseNotification {
  type: "program" | "reminder" | "alert" | "announcement";
  relatedMemberIds?: string[]; // members affected
}

export interface StaffNotification extends BaseNotification {
  type: "reminder" | "alert" | "announcement";
  relatedTaskId?: string; // optional, if about a task
}

export interface OwnerManagerNotification extends BaseNotification {
  type: "subscription" | "payment" | "reminder" | "alert" | "announcement";
}

// Union type for all notifications
export type AppNotification =
  | MemberNotification
  | CoachNotification
  | StaffNotification
  | OwnerManagerNotification;

export interface GetNotificationsResponseDto {
  data: AppNotification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}
