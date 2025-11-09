import { AuditInfo } from "./common";

export interface AppSettings extends AuditInfo {
  // Appearance / Theme
  theme: "light" | "dark" | "auto";

  // Notifications (system-wide defaults)
  notifications: {
    enablePush: boolean;
    enableEmail: boolean;
    defaultReminderMinutes?: number; // minutes before a class/session
  };

  // Billing / Subscriptions (defaults for all gyms)
  billing: {
    defaultCurrency: string; // e.g., "USD", "EUR", "DZD"
    autoRenewEnabled: boolean; // default auto-renew for app subscriptions
    trialDays?: number; // default free trial period
  };

  // Features toggles (enable/disable features globally)
  features: {
    enableTrainingPrograms: boolean;
    enableEquipmentInventory: boolean;
    enableCoachAssignments: boolean;
    enableAttendanceTracking: boolean;
    enableGymBookings: boolean;
  };

  // Localization / Language
  locale?: {
    language: string; // e.g., "en", "fr", "ar"
    timezone?: string; // default timezone for the app
  };
}
