import type { TFunction } from "i18next";

/** Formats stored session duration (whole minutes) for list/detail UI. */
export const formatSessionDurationMinutes = (
  minutes: number,
  t: TFunction,
): string => {
  if (minutes < 60) {
    return t("training.page.sessionDuration", {
      minutes,
      defaultValue: "{{minutes}} min",
    });
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (remainder === 0) {
    return t("training.page.sessionDurationHours", {
      hours,
      defaultValue: "{{hours}}h",
    });
  }

  return t("training.page.sessionDurationHoursMinutes", {
    hours,
    minutes: remainder,
    defaultValue: "{{hours}}h {{minutes}}m",
  });
};
