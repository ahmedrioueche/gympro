import { AxiosError } from 'axios';
import type {
  ForgotPasswordData,
  GetMeData,
  GoogleAuthUrlData,
  IForgotPasswordDto,
  IResendVerificationDto,
  IResetPasswordDto,
  ISigninDto,
  ISignupDto,
  IVerifyEmailDto,
  LogoutData,
  RefreshData,
  ResendVerificationData,
  ResetPasswordData,
  SigninData,
  SignupData,
  VerifyEmailData,
} from '../dto/auth';
import type { ApiResponse } from '../types/api';
import { IS_DEV } from './config';
import { apiClient, handleApiError } from './helper';

export const authApi = {
  /** Signup */
  signup: async (data: ISignupDto): Promise<ApiResponse<SignupData>> => {
    try {
      const res = await apiClient.post<ApiResponse<SignupData>>('/auth/signup', data);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Signin */
  signin: async (data: ISigninDto): Promise<ApiResponse<SigninData>> => {
    try {
      const res = await apiClient.post<ApiResponse<SigninData>>('/auth/signin', data);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Refresh token */
  refresh: async (): Promise<ApiResponse<RefreshData>> => {
    try {
      const res = await apiClient.post<ApiResponse<RefreshData>>('/auth/refresh');
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Logout */
  logout: async (): Promise<ApiResponse<LogoutData>> => {
    try {
      const res = await apiClient.post<ApiResponse<LogoutData>>('/auth/logout');
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get current user */
  getMe: async (): Promise<ApiResponse<GetMeData>> => {
    try {
      const res = await apiClient.get<ApiResponse<GetMeData>>('/auth/me');
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Verify email */
  verifyEmail: async (token: string): Promise<ApiResponse<VerifyEmailData>> => {
    try {
      const dto: IVerifyEmailDto = { token };
      const res = await apiClient.post<ApiResponse<VerifyEmailData>>('/auth/verify-email', dto);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Resend verification email */
  resendVerification: async (
    data: IResendVerificationDto
  ): Promise<ApiResponse<ResendVerificationData>> => {
    try {
      const res = await apiClient.post<ApiResponse<ResendVerificationData>>(
        '/auth/resend-verification',
        data
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Forgot password */
  forgotPassword: async (email: string): Promise<ApiResponse<ForgotPasswordData>> => {
    try {
      const dto: IForgotPasswordDto = { email };
      const res = await apiClient.post<ApiResponse<ForgotPasswordData>>(
        '/auth/forgot-password',
        dto
      );
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Reset password */
  resetPassword: async (
    token: string,
    password: string
  ): Promise<ApiResponse<ResetPasswordData>> => {
    try {
      const dto: IResetPasswordDto = { token, password };
      const res = await apiClient.post<ApiResponse<ResetPasswordData>>('/auth/reset-password', dto);
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Get Google OAuth URL */
  getGoogleAuthUrl: async (): Promise<ApiResponse<GoogleAuthUrlData>> => {
    try {
      const res = await apiClient.get<ApiResponse<GoogleAuthUrlData>>('/auth/google');
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Redirect to Google */
  redirectToGoogleAuth: async (): Promise<void> => {
    const res = await authApi.getGoogleAuthUrl();
    if (res?.data) window.location.href = res?.data?.authUrl;
  },
};

/** Axios interceptor: auto-refresh expired access token */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as any;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        await authApi.refresh();
        return apiClient(original);
      } catch {
        if (!window.location.pathname.includes('/auth/')) {
          window.location.href = '/auth/signin';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

/** Dev logging */
if (IS_DEV) {
  apiClient.interceptors.request.use((config) => {
    console.log('[API Request]', config.method?.toUpperCase(), config.url, config.data);
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => {
      console.log('[API Response]', response.config.url, response.data);
      return response;
    },
    (error) => {
      console.error('[API Error]', error.config?.url, error.response?.data);
      return Promise.reject(error);
    }
  );
}

export default authApi;
