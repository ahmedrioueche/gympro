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
import StaffPage from "../../../../app/pages/main/gym/manager/staff/StaffPage";
import SubscriptionsPage from "../../../../app/pages/main/gym/manager/subscriptions/SubscriptionsPage";
import { GymCoachRootRoute } from "./GymCoachRootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const membersRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/members",
  component: () => <MembersPage />,
});

export const createMemberRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/members/create",
  component: () => <CreateMemberPage />,
});

export const memberProfileRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/members/profile/$membershipId",
  component: () => <MemberProfilePage />,
});

export const staffRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/staff",
  component: () => <StaffPage />,
});

export const accessRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/access",
  component: () => <AccessPage />,
});

export const attendanceRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/attendance",
  component: () => <AttendancePage />,
});

export const pricingRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/pricing",
  component: () => <PricingPage />,
});

export const subscriptionsRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/subscriptions",
  component: () => <SubscriptionsPage />,
});

export const analyticsRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/analytics",
  component: () => <AnalyticsPage />,
});

export const notificationsRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/notifications",
  component: () => <NotificationsPage />,
});

export const settingsRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/settings",
  component: () => <SettingsPage />,
});
