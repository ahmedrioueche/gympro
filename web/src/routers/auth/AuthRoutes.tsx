import { createRoute } from '@tanstack/react-router';
import EmailSentPage from '../../app/pages/auth/email-sent/EmailSentPage';
import ForgotPasswordPage from '../../app/pages/auth/forgot-password/ForgotPasswordPage';
import LoginPage from '../../app/pages/auth/login/LoginPage';
import ResetPasswordPage from '../../app/pages/auth/reset-password/ResetPasswordPage';
import SignupPage from '../../app/pages/auth/signup/SignupPage';
import VerifyEmailPage from '../../app/pages/auth/verify-email/verifyEmailPage';
import { AuthRootRoute } from './AuthRootRoute';

export const LoginRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: '/login',
  component: () => <LoginPage />,
});

export const SignUpRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: '/signup',
  component: () => <SignupPage />,
});

export const VerifyEmailRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: '/verify-email',
  component: () => <VerifyEmailPage />,
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string,
  }),
});

export const EmailSentRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: '/email-sent',
  component: () => <EmailSentPage />,
});

export const ForgotPasswordRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: '/forgot-password',
  component: () => <ForgotPasswordPage />,
  validateSearch: (search: Record<string, unknown>) => ({
    email: search.email as string,
  }),
});

export const ResetPasswordRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: '/reset-password',
  component: () => <ResetPasswordPage />,
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string,
  }),
});
