export type AppLanguage = "en" | "fr" | "ar";

export const LANGUAGES = {
  en: {
    label: "English",
    locale: "en-US",
    flag: "🇺🇸",
    icon: "us",
    dir: "ltr",
  },
  fr: {
    label: "Français",
    locale: "fr-FR",
    flag: "🇫🇷",
    icon: "fr",
    dir: "ltr",
  },
  ar: {
    label: "العربية",
    locale: "ar-DZ",
    flag: "🇩🇿",
    icon: "dz",
    dir: "rtl",
  },
} satisfies Record<
  AppLanguage,
  {
    label: string;
    locale: string;
    flag: string;
    icon: string;
    dir: "ltr" | "rtl";
  }
>;

// Derived constants
export const DEFAULT_LANGUAGE: AppLanguage = "en";
export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGES) as AppLanguage[];
export const RTL_LANGUAGES = SUPPORTED_LANGUAGES.filter(
  (lng) => LANGUAGES[lng].dir === "rtl"
);
export const SUPPORTED_TIMEZONES = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Riyadh",
  "Africa/Cairo",
  "Africa/Casablanca",
  "Africa/Algiers",
  "Africa/Tunis",
  "Africa/Tripoli",
  "Africa/Khartoum",
  "Africa/Nairobi",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "Africa/Accra",
  "Africa/Abidjan",
  "Africa/Addis_Ababa",
  "Africa/Luanda",
];
