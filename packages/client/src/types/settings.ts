import { AppLanguage } from "./local";

export const THEME_OPTIONS = ["light", "dark", "auto"] as const;
export type ThemeOption = (typeof THEME_OPTIONS)[number];

export const VIEW_PREFERENCES = ["table", "cards"] as const;
export type ViewPreference = (typeof VIEW_PREFERENCES)[number];

export interface NotificationSettings {
  defaultReminderMinutes?: number;
}

export interface LocaleSettings {
  language: AppLanguage;
  currency: string;
  timezone?: string;
  region?: string;
  regionName?: string;
}

export interface AppSettings {
  theme: ThemeOption;
  viewPreference: ViewPreference;
  notifications?: NotificationSettings;
  locale?: LocaleSettings;
}
