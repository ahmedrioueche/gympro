import {
  BASE_SUBSCRIPTION_TYPES,
  PAYMENT_METHODS,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";

// Duration options with calculation metadata
export const DURATION_OPTIONS = [
  { value: "1_session", days: 1 },
  { value: "1_week", weeks: 1 },
  { value: "2_weeks", weeks: 2 },
  { value: "3_weeks", weeks: 3 },
  { value: "1_month", months: 1 },
  { value: "2_months", months: 2 },
  { value: "3_months", months: 3 },
  { value: "6_months", months: 6 },
  { value: "1_year", years: 1 },
] as const;

export type DurationValue = (typeof DURATION_OPTIONS)[number]["value"];

/**
 * Hook providing translated subscription-related select options
 */
export function useSubscriptionOptions() {
  const { t } = useTranslation();

  const subscriptionTypeOptions = BASE_SUBSCRIPTION_TYPES.map((type) => ({
    value: type,
    label: t(
      `createMember.form.subscription.${type}`,
      type.charAt(0).toUpperCase() + type.slice(1)
    ),
  }));

  const durationOptions = DURATION_OPTIONS.map((d) => ({
    value: d.value,
    label: t(
      `renewSubscription.duration.${d.value}`,
      d.value.replace("_", " ")
    ),
  }));

  const paymentMethodOptions = PAYMENT_METHODS.map((method) => ({
    value: method,
    label: t(
      `createMember.form.payment.${method}`,
      method.charAt(0).toUpperCase() + method.slice(1)
    ),
  }));

  return {
    subscriptionTypeOptions,
    durationOptions,
    paymentMethodOptions,
  };
}
