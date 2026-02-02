import * as Sentry from "@sentry/react";
import { useCallback } from "react";
import { useAlerts } from "./queries/useAlerts";

export const useAlertLogger = () => {
  const { updateStatus } = useAlerts();

  const logError = useCallback(
    (error: Error, context?: Record<string, any>) => {
      // 1. Log to Sentry
      Sentry.captureException(error, { extra: context });

      // 2. Optionally create a manual alert in our system if it's critical
      // In a real-world scenario, we might want to automate this via a Sentry Webhook on the backend
      // But for frontend-only critical failures, we can trigger it here
      console.error("[Front-end Error]:", error, context);
    },
    [],
  );

  const logWarning = useCallback(
    (message: string, context?: Record<string, any>) => {
      Sentry.captureMessage(message, { level: "warning", extra: context });
      console.warn("[Front-end Warning]:", message, context);
    },
    [],
  );

  return { logError, logWarning };
};
