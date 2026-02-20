import type {
  GymSettings,
  TemporaryClosure,
} from "@ahmedrioueche/gympro-client";
import { useCallback, useEffect, useState } from "react";

export interface GymStatus {
  isOpen: boolean;
  isWomenOnly: boolean;
  nextStatusChange: string | null; // e.g., "Opens at 08:00" or "Closes at 22:00"
  currentSession: "mixed" | "womenOnly" | "menOnly" | "closed";
  isTemporaryClosure?: boolean;
  activeClosure?: TemporaryClosure;
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
    isTemporaryClosure: false,
  });

  const calculateStatus = useCallback(() => {
    if (!settings?.workingHours) {
      return {
        isOpen: false,
        isWomenOnly: false,
        nextStatusChange: null,
        currentSession: "closed" as const,
        isTemporaryClosure: false,
      };
    }

    const { start, end } = settings.workingHours;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
    const currentDay = now
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    // Check for temporary closures first
    if (settings.temporaryClosures?.length) {
      for (const closure of settings.temporaryClosures) {
        const closureStart = new Date(closure.start);
        const closureEnd = new Date(closure.end);
        if (now >= closureStart && now <= closureEnd) {
          return {
            isOpen: false,
            isWomenOnly: false,
            nextStatusChange: closure.reason || "Temporary Closure",
            currentSession: "closed" as const,
            isTemporaryClosure: true,
            activeClosure: closure,
          };
        }
      }
    }

    // Check if today is a working day
    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const isWorkingDay = settings.workingDays
      ? settings.workingDays.includes(dayOfWeek)
      : true; // Default to open if not specified

    if (!isWorkingDay) {
      return {
        isOpen: false,
        isWomenOnly: false,
        nextStatusChange: "Closed Today",
        currentSession: "closed" as const,
        isTemporaryClosure: false,
      };
    }

    // Check for today's working hours
    let isOpen = false;
    let currentSession: GymStatus["currentSession"] = "closed";
    let nextStatusChange: string | null = null;
    let appliedStart = settings.workingHours.start;
    let appliedEnd = settings.workingHours.end;

    if (settings.useAdvancedHours && settings.customWorkingHours?.length) {
      // Advanced Mode: Check custom slots
      const todaySlots = settings.customWorkingHours.filter((slot) =>
        slot.days.some((day) => day.toLowerCase() === currentDay),
      );

      if (todaySlots.length > 0) {
        // Find if we are in any slot
        const currentSlot = todaySlots.find(
          (slot) =>
            currentTime >= slot.range.start && currentTime < slot.range.end,
        );

        if (currentSlot) {
          isOpen = true;
          appliedStart = currentSlot.range.start;
          appliedEnd = currentSlot.range.end;
        } else {
          // Find next opening today
          const nextSlot = todaySlots
            .filter((slot) => slot.range.start > currentTime)
            .sort((a, b) => a.range.start.localeCompare(b.range.start))[0];

          if (nextSlot) {
            nextStatusChange = `Opens at ${nextSlot.range.start}`;
          } else {
            nextStatusChange = "Closed for today";
          }
        }
      } else {
        nextStatusChange = "Closed Today";
      }
    } else {
      // Standard Mode
      isOpen =
        currentTime >= settings.workingHours.start &&
        currentTime < settings.workingHours.end;
      if (!isOpen) {
        nextStatusChange = `Opens at ${settings.workingHours.start}`;
      } else {
        nextStatusChange = `Closes at ${settings.workingHours.end}`;
      }
    }

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
    if (isOpen) {
      if (settings.isMixed) {
        currentSession = "mixed";
      } else if (isWomenOnly) {
        currentSession = "womenOnly";
      } else {
        currentSession = "menOnly";
      }
    }

    // Calculate next status change if not already set (for closed state)
    if (isOpen && !nextStatusChange) {
      nextStatusChange = `Closes at ${appliedEnd}`;
    }

    return {
      isOpen,
      isWomenOnly,
      nextStatusChange,
      currentSession,
      isTemporaryClosure: false,
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
