import type { AppLanguage } from "@ahmedrioueche/gympro-client";
import { create } from "zustand";
import i18n from "../i18n";

interface LanguageState {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: "en",

  setLanguage: (lang: AppLanguage) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  },

  toggleLanguage: () => {
    const current = get().language;
    const next: AppLanguage =
      current === "en" ? "fr" : current === "fr" ? "ar" : "en";
    i18n.changeLanguage(next);
    set({ language: next });
  },
}));
