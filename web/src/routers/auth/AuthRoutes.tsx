import { createRoute } from "@tanstack/react-router";
import { AuthCallbackPage } from "../../app/pages/auth/callback/AuthCallbackPage";
import EmailSentPage from "../../app/pages/auth/email-sent/EmailSentPage";
import ForgotPasswordPage from "../../app/pages/auth/forgot-password/ForgotPasswordPage";
import LoginPage from "../../app/pages/auth/login/LoginPage";
import ResetPasswordPage from "../../app/pages/auth/reset-password/ResetPasswordPage";
import SetupPage from "../../app/pages/auth/setup/SetupPage";
import SignupPage from "../../app/pages/auth/signup/SignupPage";
import VerifyEmailPage from "../../app/pages/auth/verify-email/verifyEmailPage";
import PhoneVerificationPage from "../../app/pages/auth/verify-phone/PhoneVerificationPage";
import { AuthRootRoute } from "./AuthRootRoute";

export const LoginRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

export const SignUpRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: "/signup",
  component: () => <SignupPage />,
});

export const VerifyEmailRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: "/verify-email",
  component: () => <VerifyEmailPage />,
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string,
  }),
});

export const EmailSentRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: "/email-sent",
  component: () => <EmailSentPage />,
});

export const ForgotPasswordRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: "/forgot-password",
  component: () => <ForgotPasswordPage />,
  validateSearch: (search: Record<string, unknown>) => ({
    email: search.email as string,
  }),
});

export const ResetPasswordRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: "/reset-password",
  component: () => <ResetPasswordPage />,
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string,
  }),
});

export const AuthCallbackRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: "/callback",
  component: () => <AuthCallbackPage />,
  validateSearch: (search: Record<string, unknown>) => ({
    success: search.success as string | undefined,
    error: search.error as string | undefined,
  }),
});

export const VerifyPhoneRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: "/verify-phone",
  component: () => <PhoneVerificationPage />,
  validateSearch: (search: Record<string, unknown>) => ({
    phone: search.phone as string,
  }),
});

export const SetupRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: "/setup",
  component: () => <SetupPage />,
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string,
    email: search.email as string | undefined,
    phone: search.phone as string | undefined,
  }),
});
