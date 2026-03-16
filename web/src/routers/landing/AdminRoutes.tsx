import { createRoute } from "@tanstack/react-router";
import CoachPage from "../../app/pages/landing/coach/CoachPage";
import HomePage from "../../app/pages/landing/home/HomePage";
import CookiesPage from "../../app/pages/landing/legal/CookiesPage";
import PrivacyPage from "../../app/pages/landing/legal/PrivacyPage";
import TermsPage from "../../app/pages/landing/legal/TermsPage";
import ManagerPage from "../../app/pages/landing/manager/ManagerPage";
import MemberPage from "../../app/pages/landing/member/MemberPage";
import { landingRootRoute } from "./AdminRootRoute";


export const homeRoute = createRoute({
  getParentRoute: () => landingRootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const managerRoute = createRoute({
  getParentRoute: () => landingRootRoute,
  path: "/manager",
  component: () => <ManagerPage />,
});

export const memberRoute = createRoute({
  getParentRoute: () => landingRootRoute,
  path: "/member",
  component: () => <MemberPage />,
});

export const coachRoute = createRoute({
  getParentRoute: () => landingRootRoute,
  path: "/coach",
  component: () => <CoachPage />,
});

export const termsRoute = createRoute({
  getParentRoute: () => landingRootRoute,
  path: "/terms",
  component: () => <TermsPage />,
});

export const privacyRoute = createRoute({
  getParentRoute: () => landingRootRoute,
  path: "/privacy",
  component: () => <PrivacyPage />,
});

export const cookiesRoute = createRoute({
  getParentRoute: () => landingRootRoute,
  path: "/cookies",
  component: () => <CookiesPage />,
});
