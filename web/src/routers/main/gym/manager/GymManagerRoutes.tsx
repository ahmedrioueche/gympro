import { createRoute } from "@tanstack/react-router";
import AccessPage from "../../../../app/pages/main/gym/manager/access/AccessPage";
import AnalyticsPage from "../../../../app/pages/main/gym/manager/analytics/AnalyticsPage";
import AttendancePage from "../../../../app/pages/main/gym/manager/attendance/AttendancePage";
import CreateMemberPage from "../../../../app/pages/main/gym/manager/createMember/CreateMemberPage";
import HomePage from "../../../../app/pages/main/gym/manager/home/HomePage";
import MemberProfilePage from "../../../../app/pages/main/gym/manager/member-profile/MemberProfilePage";
import MembersPage from "../../../../app/pages/main/gym/manager/members/MembersPage";
import NotificationsPage from "../../../../app/pages/main/gym/manager/notifications/NotificationsPage";
import PricingPage from "../../../../app/pages/main/gym/manager/pricing/PricingPage";
import SettingsPage from "../../../../app/pages/main/gym/manager/settings/SettingsPage";
import SubscriptionsPage from "../../../../app/pages/main/gym/manager/subscriptions/SubscriptionsPage";
import { GymManagerRootRoute } from "./GymManagerRootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => GymManagerRootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const membersRoute = createRoute({
  getParentRoute: () => GymManagerRootRoute,
  path: "/members",
  component: () => <MembersPage />,
});

export const createMemberRoute = createRoute({
  getParentRoute: () => GymManagerRootRoute,
  path: "/members/create",
  component: () => <CreateMemberPage />,
});

export const memberProfileRoute = createRoute({
  getParentRoute: () => GymManagerRootRoute,
  path: "/members/profile/$membershipId",
  component: () => <MemberProfilePage />,
});

export const accessRoute = createRoute({
  getParentRoute: () => GymManagerRootRoute,
  path: "/access",
  component: () => <AccessPage />,
});

export const attendanceRoute = createRoute({
  getParentRoute: () => GymManagerRootRoute,
  path: "/attendance",
  component: () => <AttendancePage />,
});

export const pricingRoute = createRoute({
  getParentRoute: () => GymManagerRootRoute,
  path: "/pricing",
  component: () => <PricingPage />,
});

export const subscriptionsRoute = createRoute({
  getParentRoute: () => GymManagerRootRoute,
  path: "/subscriptions",
  component: () => <SubscriptionsPage />,
});

export const analyticsRoute = createRoute({
  getParentRoute: () => GymManagerRootRoute,
  path: "/analytics",
  component: () => <AnalyticsPage />,
});

export const notificationsRoute = createRoute({
  getParentRoute: () => GymManagerRootRoute,
  path: "/notifications",
  component: () => <NotificationsPage />,
});

export const settingsRoute = createRoute({
  getParentRoute: () => GymManagerRootRoute,
  path: "/settings",
  component: () => <SettingsPage />,
});
