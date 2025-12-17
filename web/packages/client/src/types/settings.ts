import { SupportedCurrency } from "./common";
import { AppLanguage } from "./local";

export const THEME_OPTIONS = ["light", "dark", "auto"] as const;
export type ThemeOption = (typeof THEME_OPTIONS)[number];

export interface NotificationSettings {
  enablePush: boolean;
  enableEmail: boolean;
  defaultReminderMinutes?: number;
}

export interface LocaleSettings {
  language: AppLanguage;
  currency: SupportedCurrency;
  timezone?: string;
  region?: string;
  regionName?: string;
}

export interface AppSettings {
  theme: ThemeOption;
  notifications: NotificationSettings;
  locale?: LocaleSettings;
}
