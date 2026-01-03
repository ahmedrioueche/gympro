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

export const parseAiResponse = <T>(response: any): T | null => {
  try {
    const content = response?.data;
    if (typeof content === "string") {
      const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(jsonStr);
      return parsed as T;
    }
    return null;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return null;
  }
};

// Convert YouTube watch URLs to embed format
export const getEmbedUrl = (url: string | undefined): string | null => {
  if (!url) return null;

  // Filter out common invalid/redirected URLs
  if (url.includes("embeds_referring_euri")) return null;

  // Handle youtube.com/watch?v= format
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
  );
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Handle youtube.com/shorts/ format
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^&\s?]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  // If it's already an embed link
  if (url.includes("youtube.com/embed/")) return url;

  // Allow other URLs (e.g. Vimeo) but standard YouTube links should be caught above
  return url;
};
