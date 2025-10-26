import type { AvailableLanguages } from "../types/api";

export const LANGUAGES: Record<
  AvailableLanguages,
  { rtl: boolean; label: string }
> = {
  en: { rtl: false, label: "English" },
  fr: { rtl: false, label: "Français" },
  ar: { rtl: true, label: "العربية" },
};

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
