import { User } from '../types/user';

export interface ISignupDto {
  email: string;
  password: string;
  username?: string;
}

export interface ISigninDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IRefreshDto {
  refreshToken: string;
}

export interface IResendVerificationDto {
  email: string;
}

export interface IForgotPasswordDto {
  email: string;
}

export interface IResetPasswordDto {
  token: string;
  password: string;
}

export interface IVerifyEmailDto {
  token: string;
}

export interface IGoogleAuthDto {
  code: string;
  state?: string;
}

export interface IGoogleUserDto {
  email: string;
  name: string;
  picture: string;
  sub: string; // Google's unique identifier
}

export interface SignupData {
  user: User;
}

export interface SigninData {
  user: User;
}

export interface GetMeData {
  user: User;
}

export interface RefreshData {
  accessToken: string;
}

export type LogoutData = null;

export interface VerifyEmailData {
  user: User;
}

export type ResendVerificationData = null;

export type ForgotPasswordData = null;

export type ResetPasswordData = null;

export interface GoogleAuthUrlData {
  authUrl: string;
}
