import { AuthRootRoute } from './AuthRootRoute';
import {
  EmailSentRoute,
  ForgotPasswordRoute,
  LoginRoute,
  ResetPasswordRoute,
  SignUpRoute,
  VerifyEmailRoute,
} from './AuthRoutes';

export const AuthRouteTree = AuthRootRoute.addChildren([
  LoginRoute,
  SignUpRoute,
  VerifyEmailRoute,
  EmailSentRoute,
  ForgotPasswordRoute,
  ResetPasswordRoute,
]);
