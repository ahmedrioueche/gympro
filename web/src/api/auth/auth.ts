import { APP_PAGES } from '../../constants/navigation';
import type { ApiResponse, ResetPasswordDto, SignInDto, SignUpDto } from '../../types/api';
import type { UserProfile } from '../../types/user';
import { apiRequest } from '../utils/apiClient';

export class Auth {
  static signIn(
    data: SignInDto
  ): Promise<ApiResponse<{ accessToken?: string; refreshToken?: string }>> {
    return apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static signUp(data: SignUpDto): Promise<ApiResponse<UserProfile>> {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static refreshToken(): Promise<ApiResponse<{ accessToken?: string }>> {
    // httpOnly cookies are sent automatically with credentials: 'include'
    // The refreshToken cookie will be sent automatically
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({}), // Backend will get refreshToken from cookies
    });
  }

  static logout(): Promise<ApiResponse<{ message: string }>> {
    window.location.href = APP_PAGES.login.link;
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  }

  static resetPassword(data: ResetPasswordDto): Promise<ApiResponse<void>> {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static getMe(): Promise<ApiResponse<UserProfile>> {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  }

  static verifyEmail(token: string): Promise<ApiResponse<{ user: UserProfile; message: string }>> {
    return apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  static resendVerification(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static getGoogleAuthUrl(): Promise<ApiResponse<{ authUrl: string }>> {
    return apiRequest('/auth/google', {
      method: 'GET',
    });
  }

  static forgotPassword(data: { email: string }): Promise<ApiResponse<void>> {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
