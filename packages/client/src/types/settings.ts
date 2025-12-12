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
  timezone?: string;
}

export interface AppSettings {
  theme: ThemeOption;
  notifications: NotificationSettings;
  currency: AppCurrency;
  locale?: LocaleSettings;
}
