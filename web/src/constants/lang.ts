import type { AvailableLanguages } from "../types/lang";

export const LANGUAGES: Record<
  AvailableLanguages,
  { label: string; rtl: boolean }
> = {
  en: { label: "English", rtl: false },
  fr: { label: "Français", rtl: false },
  ar: { label: "العربية", rtl: true },
};
