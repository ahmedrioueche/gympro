import { AuditInfo } from './common';

// Export constants
export const THEME_OPTIONS = ['light', 'dark', 'auto'] as const;

// Derive types from constants
export type ThemeOption = (typeof THEME_OPTIONS)[number];

export interface NotificationSettings {
  enablePush: boolean;
  enableEmail: boolean;
  defaultReminderMinutes?: number;
}

export interface BillingSettings {
  defaultCurrency: string;
  autoRenewEnabled: boolean;
  trialDays?: number;
}

export interface FeaturesSettings {
  enableTrainingPrograms: boolean;
  enableEquipmentInventory: boolean;
  enableCoachAssignments: boolean;
  enableAttendanceTracking: boolean;
  enableGymBookings: boolean;
}

export interface LocaleSettings {
  language: string;
  timezone?: string;
}

export interface AppSettings extends AuditInfo {
  theme: ThemeOption;
  notifications: NotificationSettings;
  billing: BillingSettings;
  features: FeaturesSettings;
  locale?: LocaleSettings;
}
