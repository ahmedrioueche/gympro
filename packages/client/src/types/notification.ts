export type NotificationStatus = "unread" | "read" | "archived";
export type NotificationPriority = "low" | "medium" | "high";

// Action definition for notifications
export interface NotificationAction {
  type: "link" | "modal";
  payload: string; // URL path or modal key
  data?: Record<string, unknown>; // Extra data for the modal or route state
  label?: string; // Optional label for UI
  expiresAt?: string; // ISO date when action becomes invalid
  referenceId?: string; // ID to validate (e.g., affiliationId)
  referenceType?: "affiliation" | "subscription" | "program" | "session"; // Type for validation
}

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
  action?: NotificationAction; // Action to perform on click
}

// Notification type can vary per role
export type NotificationType =
  | "subscription" // for subscription updates, renewal, expiry
  | "payment" // for payment confirmation/failure
  | "program" // program assignment, suggestions
  | "reminder" // general reminders
  | "alert" // urgent alert
  | "announcement" // gym-wide announcements
  | "membership" // membership updates
  | "invitation"; // gym invitations

// Specialized notifications per role
export interface MemberNotification extends BaseNotification {
  type: "subscription" | "program" | "reminder" | "alert" | "invitation";
  relatedProgramId?: string; // if notification is about a program
  relatedCoachId?: string; // if assigned by a coach
}

export interface CoachNotification extends BaseNotification {
  type: "program" | "reminder" | "alert" | "announcement" | "invitation";
  relatedMemberIds?: string[]; // members affected
}

export interface StaffNotification extends BaseNotification {
  type: "reminder" | "alert" | "announcement" | "invitation";
  relatedTaskId?: string; // optional, if about a task
}

export interface OwnerManagerNotification extends BaseNotification {
  type:
    | "subscription"
    | "payment"
    | "reminder"
    | "alert"
    | "announcement"
    | "invitation";
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
