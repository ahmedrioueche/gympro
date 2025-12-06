import { AuthRootRoute } from "./AuthRootRoute";
import {
  AuthCallbackRoute,
  EmailSentRoute,
  ForgotPasswordRoute,
  LoginRoute,
  ResetPasswordRoute,
  SetupRoute,
  SignUpRoute,
  VerifyEmailRoute,
  VerifyPhoneRoute,
} from "./AuthRoutes";

export const AuthRouteTree = AuthRootRoute.addChildren([
  LoginRoute,
  SignUpRoute,
  VerifyEmailRoute,
  EmailSentRoute,
  ForgotPasswordRoute,
  ResetPasswordRoute,
  AuthCallbackRoute,
  VerifyPhoneRoute,
  SetupRoute,
]);
