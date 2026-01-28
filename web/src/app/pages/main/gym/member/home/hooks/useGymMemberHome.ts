import type { GymSettings } from "@ahmedrioueche/gympro-client";
import { useCallback, useEffect, useState } from "react";

export interface GymStatus {
  isOpen: boolean;
  isWomenOnly: boolean;
  nextStatusChange: string | null; // e.g., "Opens at 08:00" or "Closes at 22:00"
  currentSession: "mixed" | "womenOnly" | "menOnly" | "closed";
}

/**
 * Hook to calculate gym open/closed status based on working hours
 */
export function useGymMemberHome(settings?: GymSettings) {
  const [status, setStatus] = useState<GymStatus>({
    isOpen: false,
    isWomenOnly: false,
    nextStatusChange: null,
    currentSession: "closed",
  });

  const calculateStatus = useCallback(() => {
    if (!settings?.workingHours) {
      return {
        isOpen: false,
        isWomenOnly: false,
        nextStatusChange: null,
        currentSession: "closed" as const,
      };
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
    const currentDay = now
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    const { start, end } = settings.workingHours;

    // Check if gym is open
    const isOpen = currentTime >= start && currentTime < end;

    // Check for women-only hours
    let isWomenOnly = false;
    if (!settings.isMixed && settings.femaleOnlyHours?.length) {
      for (const slot of settings.femaleOnlyHours) {
        const dayMatches = slot.days.some(
          (day) => day.toLowerCase() === currentDay,
        );
        if (dayMatches) {
          const slotStart = slot.range.start;
          const slotEnd = slot.range.end;
          if (currentTime >= slotStart && currentTime < slotEnd) {
            isWomenOnly = true;
            break;
          }
        }
      }
    }

    // Determine current session type
    let currentSession: GymStatus["currentSession"] = "closed";
    if (isOpen) {
      if (settings.isMixed) {
        currentSession = "mixed";
      } else if (isWomenOnly) {
        currentSession = "womenOnly";
      } else {
        currentSession = "menOnly";
      }
    }

    // Calculate next status change
    let nextStatusChange: string | null = null;
    if (!isOpen) {
      nextStatusChange = `Opens at ${start}`;
    } else {
      nextStatusChange = `Closes at ${end}`;
    }

    return {
      isOpen,
      isWomenOnly,
      nextStatusChange,
      currentSession,
    };
  }, [settings]);

  useEffect(() => {
    // Calculate immediately
    setStatus(calculateStatus());

    // Update every minute
    const interval = setInterval(() => {
      setStatus(calculateStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, [calculateStatus]);

  return status;
}

/**
 * Generate Google Maps URL from address components
 */
export function getGoogleMapsUrl(gym: {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}): string {
  const parts = [gym.address, gym.city, gym.state, gym.country].filter(Boolean);
  const query = encodeURIComponent(parts.join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/**
 * Format full address from components
 */
export function formatAddress(gym: {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}): string {
  return [gym.address, gym.city, gym.state, gym.country]
    .filter(Boolean)
    .join(", ");
}
