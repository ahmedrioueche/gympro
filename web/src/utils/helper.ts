import type { UserRole } from "@ahmedrioueche/gympro-client";
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

export const redirectUserToHomePageAfterTimeout = (
  role: UserRole,
  timeout: number,
  navigate: (options: any) => void
) => {
  const redirectUrl = getRoleHomePage(role);
  setTimeout(() => {
    navigate({ to: redirectUrl });
  }, timeout);
};
