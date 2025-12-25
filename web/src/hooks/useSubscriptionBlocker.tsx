import { useCallback, useMemo } from "react";
import { getTwoHourBucket } from "../utils/helper";
import { useSubscriptionBlockerQuery } from "./queries/useSubscriptionBlocker";
import { useLocalStorage } from "./uselocalStorage";

export function useSubscriptionBlocker() {
  const { data: config, isLoading } = useSubscriptionBlockerQuery();
  const [dismissed, setDismissed] = useLocalStorage<string[]>(
    "dismissed_warnings",
    []
  );

  const shouldShow = useMemo(() => {
    if (!config?.show) return false;

    // Blocker modals always show (non-dismissible)
    if (config.type === "blocker") return true;

    // For pre-expiry warnings, use timing-specific dismiss key
    const dismissKey = config.timing
      ? `${config.reason}_${config.timing}_${getTwoHourBucket(new Date())}`
      : `${config.reason}_${getTwoHourBucket(new Date())}`;

    return !dismissed.includes(dismissKey);
  }, [config, dismissed]);

  // Update dismiss to use timing
  const dismiss = useCallback(() => {
    if (!config || config.type === "blocker") return;
    const dismissKey = config.timing
      ? `${config.reason}_${config.timing}_${getTwoHourBucket(new Date())}`
      : `${config.reason}_${getTwoHourBucket(new Date())}`;

    setDismissed((prev) => {
      if (prev.includes(dismissKey)) return prev;
      return [...prev, dismissKey];
    });
  }, [config, setDismissed]);

  // Cleanup old dismissals (older than 30 days)
  const cleanupOldDismissals = useCallback(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    setDismissed((prev) => {
      return prev.filter((dismissKey) => {
        const timePart = dismissKey.split("_").pop();
        if (!timePart) return false;

        const parsed = new Date(timePart.replace(/-(\d{2})$/, "T$1:00:00"));
        return parsed.getTime() > thirtyDaysAgo.getTime();
      });
    });
  }, [setDismissed]);

  // Run cleanup on mount (optional, prevents localStorage bloat)
  useMemo(() => {
    cleanupOldDismissals();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    config: shouldShow ? config : null,
    dismiss,
    isLoading,
  };
}
