import type { SubscriptionPeriodUnit } from "@ahmedrioueche/gympro-client";

export const DURATION_PRESETS: {
  value: string;
  duration: number;
  unit: SubscriptionPeriodUnit;
}[] = [
  { value: "1 session", duration: 1, unit: "day" },
  { value: "1 week", duration: 1, unit: "week" },
  { value: "2 weeks", duration: 2, unit: "week" },
  { value: "3 weeks", duration: 3, unit: "week" },
  { value: "1 month", duration: 1, unit: "month" },
  { value: "2 months", duration: 2, unit: "month" },
  { value: "3 months", duration: 3, unit: "month" },
  { value: "6 months", duration: 6, unit: "month" },
  { value: "1 year", duration: 1, unit: "year" },
];

// Helper to get preset value from duration + unit
export const getDurationPresetValue = (
  duration: number,
  unit: SubscriptionPeriodUnit,
): string => {
  const preset = DURATION_PRESETS.find(
    (p) => p.duration === duration && p.unit === unit,
  );
  return preset?.value || "1 month";
};
