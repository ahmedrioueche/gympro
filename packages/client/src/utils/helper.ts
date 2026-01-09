import { Currency } from "../types/common";
import { AppLanguage, LANGUAGES } from "../types/local";

export const formatPrice = (
  amount: number,
  currency: Currency,
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
