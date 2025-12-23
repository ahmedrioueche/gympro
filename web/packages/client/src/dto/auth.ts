import { User } from "../types/user";
export interface ISignupDto {
  email?: string;
  phoneNumber?: string;
  password: string;
  username?: string;
}
export interface ISigninDto {
  identifier: string;
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
  identifier: string;
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
  sub: string;
}
export interface SignupData {
  user: User;
  accessToken: string;
  refreshToken: string;
}
export interface SigninData {
  user: User;
  accessToken: string;
  refreshToken: string;
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
  accessToken: string;
  refreshToken: string;
}
export type ResendVerificationData = null;
export type ForgotPasswordData = null;
export type ResetPasswordData = null;
export interface GoogleAuthUrlData {
  authUrl: string;
}
export interface ISendOtpDto {
  phoneNumber: string;
}
export interface IVerifyOtpDto {
  phoneNumber: string;
  code: string;
}
export interface IVerifyForgotPasswordOtpDto {
  phoneNumber: string;
  code: string;
}
export interface ISetupAccountDto {
  token: string;
  password: string;
}
export interface ICreateMemberDto {
  email?: string;
  phoneNumber?: string;
  role: string;
  gymId: string;
  fullName?: string;
}
export interface SendOtpData {
  remainingTime?: number;
}
export interface VerifyOtpData {
  userId?: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}
export interface VerifyForgotPasswordOtpData {
  resetToken: string;
}
export interface SetupAccountData {
  user: User;
  accessToken: string;
  refreshToken: string;
}
export interface CreateMemberData {
  user: User;
  setupLink?: string;
}
