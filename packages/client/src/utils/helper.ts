import { Currency } from "../types/common";
import { AppLanguage, LANGUAGES } from "../types/local";

export const formatPrice = (
  amount: number,
  currency: Currency,
  language: AppLanguage,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 0,
) => {
  const locale = LANGUAGES[language].locale || "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  }).format(amount);
};

export const resolveLocalizedString = (
  value: string | Partial<Record<AppLanguage, string>> | undefined,
  language: AppLanguage,
  translateFn?: (key: string) => string,
): string => {
  if (!value) return "";
  if (typeof value === "string") {
    return translateFn ? translateFn(value) : value;
  }
  if (typeof value === "object" && value !== null) {
    return value[language] || value["en"] || Object.values(value)[0] || "";
  }
  return "";
};
