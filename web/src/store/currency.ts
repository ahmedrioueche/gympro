import {
  DEFAULT_CURRENCY,
  type AppCurrency,
} from "@ahmedrioueche/gympro-client";
import { create } from "zustand";

interface CurrencyState {
  currency: AppCurrency;
  setCurrency: (currency: AppCurrency) => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  currency: DEFAULT_CURRENCY,
  setCurrency: (currency) => set({ currency }),
}));
