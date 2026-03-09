import type { AppLanguage } from "@ahmedrioueche/gympro-client";
import { create } from "zustand";
import i18n from "../i18n";

interface LanguageState {
  language: AppLanguage;
  isRtl: boolean;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: "en",
  isRtl: false,

  setLanguage: (lang: AppLanguage) => {
    if (get().language === lang) return;
    i18n.changeLanguage(lang);
    set({ language: lang, isRtl: lang === "ar" });
  },

  toggleLanguage: () => {
    const current = get().language;
    const next: AppLanguage =
      current === "en" ? "fr" : current === "fr" ? "ar" : "en";
    i18n.changeLanguage(next);
    set({ language: next, isRtl: next === "ar" });
  },
}));
