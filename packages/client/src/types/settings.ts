import { AppCurrency } from "./common";

export const THEME_OPTIONS = ["light", "dark", "auto"] as const;
export type ThemeOption = (typeof THEME_OPTIONS)[number];

export interface NotificationSettings {
  enablePush: boolean;
  enableEmail: boolean;
  defaultReminderMinutes?: number;
}

export interface LocaleSettings {
  language: string;
  currency: AppCurrency;
  timezone?: string;
  region?: string;
  regionName?: string;
}

export interface AppSettings {
  theme: ThemeOption;
  notifications: NotificationSettings;
  locale?: LocaleSettings;
}
