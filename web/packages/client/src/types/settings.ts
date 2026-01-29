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

export interface TimerSettings {
  defaultRestTime: number; // in seconds
  sound: "beep" | "vibrate" | "silent";
  soundTrack?: string; // e.g. "beep_1", "beep_2" - used when sound is "beep"
  alarmDuration: number; // in seconds
  // Warning countdown settings
  warningSeconds?: number; // seconds before timer ends to play warning (default: 5)
  warningSoundTrack?: string; // separate sound for warning
}

export const TIMER_SOUND_TRACKS = [
  { id: "beep_1", label: "Classic" },
  { id: "beep_2", label: "Warning" },
  { id: "beep_3", label: "Waterdrop" },
  { id: "beep_4", label: "Alarm 1" },
  { id: "beep_5", label: "Alarm 2" },
  { id: "beep_6", label: "Alarm 3" },
] as const;

export interface AppSettings {
  theme: ThemeOption;
  viewPreference: ViewPreference;
  notifications?: NotificationSettings;
  locale?: LocaleSettings;
  timer?: TimerSettings;
}
