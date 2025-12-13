export const PAYMENT_METHODS = [
  "cash",
  "ccp",
  "dahabia",
  "card",
  "paypal",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const APP_CURRENCIES = ["USD", "EUR", "DZD"] as const;
export type AppCurrency = (typeof APP_CURRENCIES)[number];

export const CURRENCY_SYMBOLS: Record<AppCurrency, string> = {
  USD: "$",
  EUR: "€",
  DZD: "دج",
};

export const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const DAYS_PER_WEEK = [1, 2, 3, 4, 5, 6, 7] as const;

// Types derived from constants
export type WeekDay = (typeof WEEK_DAYS)[number];
export type DaysPerWeek = (typeof DAYS_PER_WEEK)[number];

export interface TimeRange {
  start: string;
  end: string;
}

export interface WeeklyTimeRange {
  days: WeekDay[];
  range: TimeRange;
}

export interface AuditInfo {
  createdAt: string | Date;
  createdBy?: string;
  updatedAt?: string | Date;
  updatedBy?: string;
}

export const SUPPORTED_REGIONS = {
  DZ: { name: "Algeria", currency: "DZD" as AppCurrency },
  US: { name: "United States", currency: "USD" as AppCurrency },
  FR: { name: "France", currency: "EUR" as AppCurrency },
  DE: { name: "Germany", currency: "EUR" as AppCurrency },
  IT: { name: "Italy", currency: "EUR" as AppCurrency },
  ES: { name: "Spain", currency: "EUR" as AppCurrency },
  BE: { name: "Belgium", currency: "EUR" as AppCurrency },
  NL: { name: "Netherlands", currency: "EUR" as AppCurrency },
  PT: { name: "Portugal", currency: "EUR" as AppCurrency },
  AT: { name: "Austria", currency: "EUR" as AppCurrency },
  IE: { name: "Ireland", currency: "EUR" as AppCurrency },
  GR: { name: "Greece", currency: "EUR" as AppCurrency },
} as const;

export type RegionCode = keyof typeof SUPPORTED_REGIONS;
