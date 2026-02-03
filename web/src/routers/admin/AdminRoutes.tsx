import { APP_PERMISSIONS, UserRole } from "@ahmedrioueche/gympro-client";
import { createRoute, redirect } from "@tanstack/react-router";
import AlertsPage from "../../app/pages/admin/alerts/AlertsPage";
import AnalyticsPage from "../../app/pages/admin/analytics/AnalyticsPage";
import CoachingPage from "../../app/pages/admin/coaching/CoachingPage";
import GymsPage from "../../app/pages/admin/gyms/GymsPage";
import HomePage from "../../app/pages/admin/home/HomePage";
import NotificationsPage from "../../app/pages/admin/notifications/NotificationsPage";
import PricingPage from "../../app/pages/admin/pricing/PricingPage";
import ReportsPage from "../../app/pages/admin/reports/ReportsPage";
import RevenuePage from "../../app/pages/admin/revenue/RevenuePage";
import SettingsPage from "../../app/pages/admin/settings/SettingsPage";
import StaffPage from "../../app/pages/admin/staff/StaffPage";
import SubscriptionsPage from "../../app/pages/admin/subscriptions/SubscriptionsPage";
import UsersPage from "../../app/pages/admin/users/UsersPage";
import { useUserStore } from "../../store/user";
import { adminRootRoute } from "./AdminRootRoute";

/**
 * Helper to check if the current user has the required permission
 */
const checkPermission = (permission?: string) => {
  const { user } = useUserStore.getState();
  if (!user) return false;
  if (user.role === UserRole.Admin) return true;
  if (user.role !== UserRole.AppEditor) return false;

  if (!permission) return true;
  const perms = (user as any).appPermissions || [];
  return perms.includes(permission);
};

export const homeRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/",
  beforeLoad: () => {
    if (!checkPermission(APP_PERMISSIONS.VIEW_DASHBOARD)) {
      throw redirect({ to: "/admin/settings" }); // Redirect to settings or a safe place if they have access to something
    }
  },
  component: () => <HomePage />,
});

export const pricingRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/pricing",
  beforeLoad: () => {
    if (!checkPermission(APP_PERMISSIONS.MANAGE_PLANS)) {
      throw redirect({ to: "/admin" });
    }
  },
  component: () => <PricingPage />,
});

export const subscriptionsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/subscriptions",
  beforeLoad: () => {
    if (!checkPermission(APP_PERMISSIONS.MANAGE_REVENUE)) {
      throw redirect({ to: "/admin" });
    }
  },
  component: () => <SubscriptionsPage />,
});

export const revenueRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/revenue",
  beforeLoad: () => {
    if (!checkPermission(APP_PERMISSIONS.MANAGE_REVENUE)) {
      throw redirect({ to: "/admin" });
    }
  },
  component: () => <RevenuePage />,
});

export const gymsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/gyms",
  beforeLoad: () => {
    if (!checkPermission(APP_PERMISSIONS.MANAGE_GYMS)) {
      throw redirect({ to: "/admin" });
    }
  },
  component: () => <GymsPage />,
});

export const usersRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/users",
  beforeLoad: () => {
    if (!checkPermission(APP_PERMISSIONS.MANAGE_USERS)) {
      throw redirect({ to: "/admin" });
    }
  },
  component: () => <UsersPage />,
});

export const coachingRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/coaching",
  beforeLoad: () => {
    if (
      !checkPermission(APP_PERMISSIONS.MANAGE_COACH_REQUESTS) &&
      !checkPermission(APP_PERMISSIONS.MANAGE_COACHES)
    ) {
      throw redirect({ to: "/admin" });
    }
  },
  component: () => <CoachingPage />,
});

export const staffRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/staff",
  beforeLoad: () => {
    if (!checkPermission(APP_PERMISSIONS.MANAGE_EDITORS)) {
      throw redirect({ to: "/admin" });
    }
  },
  component: () => <StaffPage />,
});

export const analyticsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/analytics",
  beforeLoad: () => {
    if (!checkPermission(APP_PERMISSIONS.MANAGE_REVENUE)) {
      throw redirect({ to: "/admin" });
    }
  },
  component: () => <AnalyticsPage />,
});

export const reportsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/reports",
  beforeLoad: () => {
    if (!checkPermission(APP_PERMISSIONS.MANAGE_REPORTS)) {
      throw redirect({ to: "/admin" });
    }
  },
  component: () => <ReportsPage />,
});

export const alertsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/alerts",
  beforeLoad: () => {
    if (!checkPermission(APP_PERMISSIONS.MANAGE_ALERTS)) {
      throw redirect({ to: "/admin" });
    }
  },
  component: () => <AlertsPage />,
});

export const notificationsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/notifications",
  beforeLoad: () => {
    if (!checkPermission(APP_PERMISSIONS.MANAGE_NOTIFICATIONS)) {
      throw redirect({ to: "/admin" });
    }
  },
  component: () => <NotificationsPage />,
});

export const settingsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/settings",
  component: () => <SettingsPage />,
});
