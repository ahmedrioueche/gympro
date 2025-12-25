import type { UserRole } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { getRoleHomePage } from "./roles";

export const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

export const setLocalStorageItem = <T>(key: string, value: T) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

export const redirectToHomePageAfterTimeout = (
  role: UserRole,
  timeout: number,
  navigate: (options: any) => void
) => {
  const redirectUrl = getRoleHomePage(role);

  redirectAfterTimeout(redirectUrl, timeout, navigate);
};

export const redirectAfterTimeout = (
  redirectUrl: string,
  timeout: number,
  navigate: (options: any) => void
) => {
  setTimeout(() => {
    navigate({ to: redirectUrl });
  }, timeout);
};

export function capitalize(input: string): string {
  return input
    .toLocaleLowerCase()
    .replace(/(^|\s)\p{L}/gu, (m) => m.toLocaleUpperCase());
}

export function getTwoHourBucket(date: Date) {
  const hours = date.getHours();
  const bucketStartHour = Math.floor(hours / 2) * 2;

  const bucketDate = new Date(date);
  bucketDate.setHours(bucketStartHour, 0, 0, 0);

  return format(bucketDate, "yyyy-MM-dd-HH");
}
