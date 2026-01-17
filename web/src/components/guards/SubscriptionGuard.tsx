import { useLocation } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { APP_PAGES } from "../../constants/navigation";
import { useSubscriptionBlocker } from "../../hooks/useSubscriptionBlocker";
import LoadingPage from "../ui/LoadingPage";

const SubscriptionBlockerModal = lazy(
  () =>
    import(
      "../../app/components/modals/subscription-blocker-modal/SubscriptionBlockerModal"
    )
);
const SubscriptionWarningModal = lazy(
  () =>
    import(
      "../../app/components/modals/subscription-warning-modal/SubscriptionWarningModal"
    )
);

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

// Routes that are always allowed (whitelist)
const ALLOWED_ROUTES = [
  `${APP_PAGES.manager.subscription.link}`,
  "/settings/export",
  "/support",
  "/auth/login",
  "/auth/logout",
];

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
}) => {
  const { config, dismiss, isLoading } = useSubscriptionBlocker();
  const location = useLocation();

  // Check if current route is in allowed list
  const isAllowedRoute = ALLOWED_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  // No blocker config - user has valid subscription
  if (!config) {
    return <>{children}</>;
  }

  // ===== BLOCKER (Hard Block) =====
  if (config.type === "blocker") {
    // If user is on an allowed route, let them through
    if (isAllowedRoute) {
      return <>{children}</>;
    }

    // Otherwise, show blocker modal (non-dismissible)
    return (
      <>
        {children}
        <Suspense>
          <SubscriptionBlockerModal config={config} />
        </Suspense>
      </>
    );
  }

  // ===== WARNING (Soft Block) =====
  if (config.type === "warning") {
    // Show warning modal overlay (dismissible)
    // User can still access content underneath
    return (
      <>
        {children}
        {config.show && (
          <Suspense>
            <SubscriptionWarningModal config={config} onDismiss={dismiss} />
          </Suspense>
        )}
      </>
    );
  }

  // Default: allow access
  return <>{children}</>;
};
