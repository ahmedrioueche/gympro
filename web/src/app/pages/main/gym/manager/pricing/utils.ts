import type { SubscriptionPeriodUnit } from "@ahmedrioueche/gympro-client";

export const DURATION_PRESETS: {
  value: string;
  duration: number;
  unit: SubscriptionPeriodUnit;
}[] = [
  { value: "1_session", duration: 1, unit: "day" },
  { value: "1_week", duration: 1, unit: "week" },
  { value: "2_weeks", duration: 2, unit: "week" },
  { value: "3_weeks", duration: 3, unit: "week" },
  { value: "1_month", duration: 1, unit: "month" },
  { value: "2_months", duration: 2, unit: "month" },
  { value: "3_months", duration: 3, unit: "month" },
  { value: "6_months", duration: 6, unit: "month" },
  { value: "1_year", duration: 1, unit: "year" },
];

// Helper to get preset value from duration + unit
export const getDurationPresetValue = (
  duration: number,
  unit: SubscriptionPeriodUnit
): string => {
  const preset = DURATION_PRESETS.find(
    (p) => p.duration === duration && p.unit === unit
  );
  return preset?.value || "1_month";
};
