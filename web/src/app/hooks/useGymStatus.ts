import type {
  GymSettings,
  TemporaryClosure,
} from "@ahmedrioueche/gympro-client";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export interface GymStatus {
  isOpen: boolean;
  isWomenOnly: boolean;
  nextStatusChange: string | null;
  currentSession: "mixed" | "womenOnly" | "menOnly" | "closed";
  isTemporaryClosure?: boolean;
  activeClosure?: TemporaryClosure;
}

/**
 * Hook to calculate gym open/closed status based on working hours
 */
export function useGymStatus(settings?: GymSettings) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<GymStatus>({
    isOpen: false,
    isWomenOnly: false,
    nextStatusChange: null,
    currentSession: "closed",
    isTemporaryClosure: false,
  });

  const calculateStatus = useCallback((): GymStatus => {
    if (!settings?.workingHours) {
      return {
        isOpen: false,
        isWomenOnly: false,
        nextStatusChange: null,
        currentSession: "closed",
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
            nextStatusChange: closure.reason || t("common.temporaryClosure", "Temporary Closure"),
            currentSession: "closed",
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
      : true;

    if (!isWorkingDay) {
      return {
        isOpen: false,
        isWomenOnly: false,
        nextStatusChange: t("common.gymStatus.closedToday", "Closed Today"),
        currentSession: "closed",
        isTemporaryClosure: false,
      };
    }

    let isOpen = false;
    let currentSession: GymStatus["currentSession"] = "closed";
    let nextStatusChange: string | null = null;
    let appliedEnd = settings.workingHours.end;

    if (settings.useAdvancedHours && settings.customWorkingHours?.length) {
      const todaySlots = settings.customWorkingHours.filter((slot) =>
        slot.days.some((day) => day.toLowerCase() === currentDay),
      );

      if (todaySlots.length > 0) {
        const currentSlot = todaySlots.find(
          (slot) =>
            currentTime >= slot.range.start && currentTime < slot.range.end,
        );

        if (currentSlot) {
          isOpen = true;
          appliedEnd = currentSlot.range.end;
        } else {
          const nextSlot = todaySlots
            .filter((slot) => slot.range.start > currentTime)
            .sort((a, b) => a.range.start.localeCompare(b.range.start))[0];

          if (nextSlot) {
            nextStatusChange = t("common.gymStatus.opensAt", {
              time: nextSlot.range.start,
              defaultValue: `Opens at ${nextSlot.range.start}`,
            });
          } else {
            nextStatusChange = t("common.gymStatus.closedForToday", "Closed for today");
          }
        }
      } else {
        nextStatusChange = t("common.gymStatus.closedToday", "Closed Today");
      }
    } else {
      isOpen =
        currentTime >= settings.workingHours.start &&
        currentTime < settings.workingHours.end;
      if (!isOpen) {
        nextStatusChange = t("common.gymStatus.opensAt", {
          time: settings.workingHours.start,
          defaultValue: `Opens at ${settings.workingHours.start}`,
        });
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
          if (currentTime >= slot.range.start && currentTime < slot.range.end) {
            isWomenOnly = true;
            break;
          }
        }
      }
    }

    if (isOpen) {
      if (settings.isMixed) {
        currentSession = "mixed";
      } else if (isWomenOnly) {
        currentSession = "womenOnly";
      } else {
        currentSession = "menOnly";
      }
      if (!nextStatusChange) {
        nextStatusChange = t("common.gymStatus.closesAt", {
          time: appliedEnd,
          defaultValue: `Closes at ${appliedEnd}`,
        });
      }
    }

    return {
      isOpen,
      isWomenOnly,
      nextStatusChange,
      currentSession,
      isTemporaryClosure: false,
    };
  }, [settings, t]);

  useEffect(() => {
    setStatus(calculateStatus());
    const interval = setInterval(() => {
      setStatus(calculateStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, [calculateStatus]);

  return status;
}
