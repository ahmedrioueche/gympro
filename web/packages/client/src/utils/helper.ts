import { SupportedCurrency, CURRENCY_SYMBOLS } from "../types/common";
import { AppLanguage, LANGUAGES } from "../types/local";

export function getCurrencySymbol(currency: SupportedCurrency): string {
  return CURRENCY_SYMBOLS[currency];
}

export const formatPrice = (
  amount: number,
  currency: SupportedCurrency,
  language: AppLanguage,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 0
) => {
  const locale = LANGUAGES[language].locale || "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  }).format(amount);
};
