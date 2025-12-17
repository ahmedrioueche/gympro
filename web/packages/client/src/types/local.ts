import { SupportedCurrency } from "./common";

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

export const DEFAULT_CURRENCY: SupportedCurrency = "USD";

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

export const SUPPORTED_REGIONS = {
  DZ: { name: "Algeria", currency: "DZD" as SupportedCurrency },
  US: { name: "United States", currency: "USD" as SupportedCurrency },
  FR: { name: "France", currency: "EUR" as SupportedCurrency },
  DE: { name: "Germany", currency: "EUR" as SupportedCurrency },
  IT: { name: "Italy", currency: "EUR" as SupportedCurrency },
  ES: { name: "Spain", currency: "EUR" as SupportedCurrency },
  BE: { name: "Belgium", currency: "EUR" as SupportedCurrency },
  NL: { name: "Netherlands", currency: "EUR" as SupportedCurrency },
  PT: { name: "Portugal", currency: "EUR" as SupportedCurrency },
  AT: { name: "Austria", currency: "EUR" as SupportedCurrency },
  IE: { name: "Ireland", currency: "EUR" as SupportedCurrency },
  GR: { name: "Greece", currency: "EUR" as SupportedCurrency },
} as const;

export type RegionCode = keyof typeof SUPPORTED_REGIONS;

export const DEFAULT_REGION = {
  region: "US",
  regionName: "United States",
  currency: DEFAULT_CURRENCY,
  timezone: "America/New_York",
  language: DEFAULT_LANGUAGE,
};
