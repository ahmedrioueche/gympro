import type {
  ApiResponse,
  ForgotPasswordData,
  GetMeData,
  GoogleAuthUrlData,
  LogoutData,
  RefreshData,
  ResendVerificationData,
  ResetPasswordData,
  SendOtpData,
  SetupAccountData,
  SigninData,
  SignupData,
  VerifyEmailData,
  VerifyOtpData,
} from '@ahmedrioueche/gympro-client';
import { apiResponse } from '@ahmedrioueche/gympro-client';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import * as crypto from 'crypto';
import type { Response } from 'express';
import { ClientPlatform } from 'src/common/decorators/platform.decorator';
import { buildRedirectUrl, Platform } from 'src/common/utils/platform.util';
import {
  ResendVerificationDto,
  SendOtpDto,
  SetupAccountDto,
  SigninDto,
  SignupDto,
  VerifyOtpDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OtpService } from './otp.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post('signup')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  async signup(
    @Body() dto: SignupDto,
    @ClientPlatform() platform: Platform,
  ): Promise<ApiResponse<SignupData>> {
    const user = await this.authService.signup(dto, platform);
    return apiResponse(true, undefined, { user }, 'Signup successful');
  }

  @Post('signin')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  async signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<SigninData>> {
    const result = await this.authService.signin(dto);

    this.setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
      dto.rememberMe || false,
    );

    return apiResponse(
      true,
      undefined,
      {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      'Login successful',
    );
  }

  @Post('refresh')
  async refresh(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<RefreshData>> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const { accessToken } = await this.authService.refresh(refreshToken);
    this.setAccessTokenCookie(res, accessToken);

    return apiResponse(
      true,
      undefined,
      { accessToken },
      'Token refreshed successfully',
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<LogoutData>> {
    const userId = req.user?.sub;
    await this.authService.logout(userId);
    this.clearAuthCookies(res);
    return apiResponse(true, undefined, null, 'Logged out successfully');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any): Promise<ApiResponse<GetMeData>> {
    const user = await this.authService.getMeFromPayload(req.user);
    return apiResponse(true, undefined, { user });
  }

  @Post('verify-email')
  async verifyEmail(
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<VerifyEmailData>> {
    const result = await this.authService.verifyEmail(token);
    this.setAuthCookies(res, result.accessToken, result.refreshToken, false);
    return apiResponse(true, undefined, { user: result.user }, result.message);
  }

  @Post('resend-verification')
  async resendVerification(
    @Body() dto: ResendVerificationDto,
    @Req() req: any,
  ): Promise<ApiResponse<ResendVerificationData>> {
    await this.authService.resendVerification(dto.email, req.ip);
    return apiResponse(true, undefined, null, 'Verification email sent');
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body('identifier') identifier: string,
  ): Promise<ApiResponse<ForgotPasswordData>> {
    await this.authService.forgotPassword(identifier);
    return apiResponse(
      true,
      undefined,
      null,
      'Password reset email sent if account exists',
    );
  }

  @Post('reset-password')
  @Throttle({ short: { limit: 3, ttl: 300000 } })
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ): Promise<ApiResponse<ResetPasswordData>> {
    await this.authService.resetPassword(token, password);
    return apiResponse(true, undefined, null, 'Password reset successful');
  }

  @Get('google')
  async googleAuthRedirect(
    @ClientPlatform() platform: Platform, // Detect platform when user initiates OAuth
  ): Promise<ApiResponse<GoogleAuthUrlData>> {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    const scope = 'email profile';

    // Store platform in state so we can retrieve it in callback
    const state = JSON.stringify({
      platform: platform,
      timestamp: Date.now(),
    });

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri!)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${encodeURIComponent(state)}`; // Pass platform via state

    return apiResponse(true, undefined, { authUrl });
  }

  @Get('google/callback')
  async googleAuthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      // Extract platform from state (defaults to web if parsing fails)
      let platform = Platform.WEB;
      try {
        const stateObj = JSON.parse(decodeURIComponent(state || '{}'));
        platform = stateObj.platform || Platform.WEB;
      } catch {
        platform = Platform.WEB;
      }

      const result = await this.authService.googleAuth({ code, state });
      this.setAuthCookies(res, result.accessToken, result.refreshToken, true);

      // Redirect to generic callback page
      const callbackUrl = buildRedirectUrl(
        platform as Platform,
        '/auth/callback',
        {
          success: 'true',
        },
      );

      res.redirect(callbackUrl);
    } catch (error) {
      // Try to extract platform for error redirect too
      let platform = Platform.WEB;
      try {
        const stateObj = JSON.parse(decodeURIComponent(state || '{}'));
        platform = stateObj.platform || Platform.WEB;
      } catch {
        platform = Platform.WEB;
      }

      const errorUrl = buildRedirectUrl(
        platform as Platform,
        '/auth/callback',
        {
          success: 'false',
          error: 'google_auth_failed',
        },
      );

      res.redirect(errorUrl);
    }
  }

  // --- OTP ENDPOINTS ---
  @Post('send-otp')
  @Throttle({ short: { limit: 3, ttl: 900000 } }) // 3 requests per 15 minutes
  async sendOtp(@Body() dto: SendOtpDto): Promise<ApiResponse<SendOtpData>> {
    const result = await this.otpService.sendOTP(dto.phoneNumber);

    if (!result.success) {
      return apiResponse(false, undefined, {
        message: result.message,
        remainingTime: result.remainingTime,
      });
    }

    return apiResponse(true, undefined, {
      message: result.message,
    });
  }

  @Post('verify-otp')
  @Throttle({ short: { limit: 5, ttl: 300000 } }) // 5 requests per 5 minutes
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
  ): Promise<ApiResponse<VerifyOtpData>> {
    const result = await this.otpService.verifyOTP(dto.phoneNumber, dto.code);

    if (!result.success) {
      return apiResponse(false, undefined, {
        userId: '',
        message: result.message,
      });
    }

    return apiResponse(true, undefined, {
      userId: result.userId!,
      message: result.message,
    });
  }

  @Post('setup-account')
  @Throttle({ short: { limit: 3, ttl: 300000 } })
  async setupAccount(
    @Body() dto: SetupAccountDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<SetupAccountData>> {
    // This endpoint will be implemented when we add the setup token logic
    // For now, return a placeholder
    return apiResponse(false, undefined, null as any, 'Not implemented yet');
  }

  @Post('verify-forgot-password-otp')
  @Throttle({ short: { limit: 5, ttl: 300000 } }) // 5 requests per 5 minutes
  async verifyForgotPasswordOtp(
    @Body() dto: VerifyOtpDto,
  ): Promise<ApiResponse<{ resetToken: string }>> {
    const result = await this.otpService.verifyOTP(dto.phoneNumber, dto.code);

    if (!result.success) {
      return apiResponse(
        false,
        undefined,
        {
          resetToken: '',
        },
        result.message,
      );
    }

    // Generate a reset token for password reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Find user and save reset token
    const user = await this.authService.getUserByPhoneNumber(dto.phoneNumber);
    if (!user) {
      return apiResponse(
        false,
        undefined,
        {
          resetToken: '',
        },
        'User not found',
      );
    }

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = resetTokenExpiry;
    await user.save();

    return apiResponse(
      true,
      undefined,
      {
        resetToken,
      },
      'OTP verified successfully',
    );
  }

  // -----------------------------
  // Helper methods for cookie management
  // -----------------------------
  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean = false,
  ) {
    const isProduction = process.env.NODE_ENV === 'prod';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('strict' as const) : ('lax' as const),
      path: '/', // ← Add this
      domain: isProduction ? process.env.COOKIE_DOMAIN : undefined, // ← Add this
    };

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
    });
  }

  private setAccessTokenCookie(res: Response, accessToken: string) {
    const isProduction = process.env.NODE_ENV === 'prod';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('strict' as const) : ('lax' as const),
      path: '/',
      domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
      maxAge: 15 * 60 * 1000,
    });
  }

  private clearAuthCookies(res: Response) {
    const isProduction = process.env.NODE_ENV === 'prod';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('strict' as const) : ('lax' as const),
      path: '/',
      domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
  }
}
