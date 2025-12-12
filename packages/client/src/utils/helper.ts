import { AppCurrency, CURRENCY_SYMBOLS } from "../types/common";
import { AppLanguage, LANGUAGES } from "../types/lang";

export function getCurrencySymbol(currency: AppCurrency): string {
  return CURRENCY_SYMBOLS[currency];
}

export const formatPrice = (
  amount: number,
  currency: AppCurrency,
  language: AppLanguage
) => {
  const locale = LANGUAGES[language].locale || "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
