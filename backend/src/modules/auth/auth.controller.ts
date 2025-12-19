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
import { apiResponse, ErrorCode } from '@ahmedrioueche/gympro-client';
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
  RefreshDto,
  ResendVerificationDto,
  SendOtpDto,
  SetupAccountDto,
  SigninDto,
  SignupDto,
  VerifyEmailDto,
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<SignupData>> {
    const result = await this.authService.signup(dto, platform);

    this.setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
      false, // default to false for signup
    );

    return apiResponse(true, undefined, result, 'Signup successful');
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
    @Body() dto: RefreshDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<RefreshData>> {
    const refreshToken = req.cookies?.refreshToken || dto.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException({
        message: 'No refresh token provided',
        errorCode: 'AUTH_001',
      });
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

  @Post('resend-verification')
  async resendVerification(
    @Body() dto: ResendVerificationDto,
    @Req() req: any,
  ): Promise<ApiResponse<ResendVerificationData>> {
    await this.authService.resendVerification(dto.email, req.ip);
    return apiResponse(true, undefined, null, 'Verification email sent');
  }

  @Post('verify-email')
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<VerifyEmailData>> {
    const result = await this.authService.verifyEmail(dto.token);

    this.setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
      false, // default to false
    );

    return apiResponse(true, undefined, result, 'Email verified successfully');
  }

  @Get('validate-setup-token')
  async validateSetupToken(
    @Query('token') token: string,
  ): Promise<ApiResponse<{ valid: boolean }>> {
    const result = await this.authService.validateSetupToken(token);
    return apiResponse(true, undefined, result);
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
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
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
      return apiResponse(
        false,
        ErrorCode.INVALID_OTP,
        {
          remainingTime: result?.remainingTime,
        },
        result.message,
      );
    }

    return apiResponse(
      true,
      undefined,
      { remainingTime: result?.remainingTime },
      result.message,
    );
  }

  @Post('verify-otp')
  @Throttle({ short: { limit: 5, ttl: 300000 } }) // 5 requests per 5 minutes
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<VerifyOtpData | undefined>> {
    const result = await this.otpService.verifyOTP(dto.phoneNumber, dto.code);

    if (!result.success) {
      return apiResponse(
        false,
        ErrorCode.INVALID_OTP,
        undefined,
        result.message,
      );
    }

    const loginResult = await this.authService.loginById(result.userId!);

    this.setAuthCookies(
      res,
      loginResult.accessToken,
      loginResult.refreshToken,
      false, // default to false
    );

    return apiResponse(true, undefined, {
      ...loginResult,
      userId: result.userId,
      message: result.message,
    });
  }

  @Post('setup-account')
  @Throttle({ short: { limit: 3, ttl: 300000 } })
  async setupAccount(
    @Body() dto: SetupAccountDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<SetupAccountData>> {
    const result = await this.authService.setupMemberAccount(
      dto.token,
      dto.password,
    );

    // Set auth cookies for auto-login
    this.setAuthCookies(res, result.accessToken, result.refreshToken, false);

    return apiResponse(
      true,
      undefined,
      {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      'Account setup successful',
    );
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

  private getCookieOptions(maxAge?: number) {
    const isProduction = process.env.NODE_ENV === 'prod';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
      path: '/',
      ...(maxAge && { maxAge }),
    };
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean = false,
  ) {
    res.cookie(
      'accessToken',
      accessToken,
      this.getCookieOptions(
        rememberMe ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000,
      ),
    );

    res.cookie(
      'refreshToken',
      refreshToken,
      this.getCookieOptions(
        rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
      ),
    );
  }

  private setAccessTokenCookie(res: Response, accessToken: string) {
    res.cookie(
      'accessToken',
      accessToken,
      this.getCookieOptions(15 * 60 * 1000),
    );
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie('accessToken', this.getCookieOptions());
    res.clearCookie('refreshToken', this.getCookieOptions());
  }
}
