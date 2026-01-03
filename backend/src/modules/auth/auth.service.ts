import {
  ErrorCode,
  IGoogleAuthDto,
  JwtPayload,
  UserRole,
} from '@ahmedrioueche/gympro-client';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { isPhoneNumber } from '../../common/utils/phone.util';
import { Platform, buildRedirectUrl } from '../../common/utils/platform.util';
import { AppPlanModel } from '../appBilling/appBilling.schema';
import { AppSubscriptionService } from '../appBilling/subscription/subscription.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SigninDto, SignupDto } from './auth.dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(AppPlanModel.name) private appPlanModel: Model<AppPlanModel>,
    private readonly subscriptionService: AppSubscriptionService,
    private readonly notificationsService: NotificationsService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
  ) {}

  // --- LOGIN BY ID (for automatic login after verification) ---
  async loginById(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user || !user.profile.isActive) {
      throw new UnauthorizedException({
        message: 'Account is deactivated or not found',
        errorCode: ErrorCode.ACCOUNT_DEACTIVATED,
      });
    }

    const { accessToken, refreshToken } = this.generateTokens(user, false);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  // --- SIGNUP ---
  async signup(dto: SignupDto, platform: Platform = Platform.WEB) {
    const { email, phoneNumber, password, username } = dto;

    if (!email && !phoneNumber) {
      throw new BadRequestException({
        message: 'Either email or phone number is required',
        errorCode: ErrorCode.INVALID_CREDENTIALS,
      });
    }

    // Check if user already exists
    const existingUserQuery: any = {};
    if (email) existingUserQuery['profile.email'] = email;
    if (phoneNumber) {
      if (Object.keys(existingUserQuery).length > 0) {
        existingUserQuery.$or = [
          { 'profile.email': email },
          { 'profile.phoneNumber': phoneNumber },
        ];
        delete existingUserQuery['profile.email'];
      } else {
        existingUserQuery['profile.phoneNumber'] = phoneNumber;
      }
    }

    const existingUser = await this.userModel.findOne(existingUserQuery);
    if (existingUser) {
      throw new ConflictException({
        message: 'User with this email or phone number already exists',
        errorCode: ErrorCode.USER_ALREADY_EXISTS,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedUsername =
      username ||
      (email ? email.split('@')[0] : `user_${phoneNumber?.slice(-4)}`);

    // Generate verification token for email signup
    const verificationToken = email
      ? crypto.randomBytes(32).toString('hex')
      : undefined;
    const verificationTokenExpiry = email
      ? new Date(Date.now() + 24 * 60 * 60 * 1000)
      : undefined;

    const newUser = new this.userModel({
      profile: {
        username: generatedUsername,
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
        password: hashedPassword,
        isValidated: !email,
        phoneNumberVerified: false,
        accountStatus: 'active',
        isOnBoarded: false,
        isActive: true,
      },
      role: UserRole.Member,
      memberships: [],
      subscriptionHistory: [],
      notifications: [],
      verificationToken,
      verificationTokenExpiry,
    });

    await newUser.save();

    // Send verification email
    if (email && verificationToken) {
      const verificationUrl = buildRedirectUrl(platform, '/auth/verify-email', {
        token: verificationToken,
      });

      await this.notificationsService.notifyUser(newUser, {
        key: 'auth.verify',
        vars: { verifyUrl: verificationUrl },
        sendSms: false,
      });
    }

    // Send OTP for phone verification
    if (phoneNumber) {
      try {
        await this.otpService.sendOTP(phoneNumber, newUser._id.toString());
      } catch (error) {
        this.logger.error(`Failed to send OTP to ${phoneNumber}: ${error}`);
      }
    }

    // Generate tokens for automatic login
    const { accessToken, refreshToken } = this.generateTokens(newUser, false);

    return {
      user: this.sanitizeUser(newUser),
      accessToken,
      refreshToken,
    };
  }

  // --- SIGNIN ---
  async signin(dto: SigninDto) {
    const { identifier } = dto;
    const isPhone = isPhoneNumber(identifier);
    const query = isPhone
      ? { 'profile.phoneNumber': identifier }
      : { 'profile.email': identifier };

    const user = await this.userModel.findOne(query);

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        errorCode: ErrorCode.INVALID_CREDENTIALS,
      });
    }

    if (!user.profile.isActive) {
      throw new UnauthorizedException({
        message: 'Account is deactivated',
        errorCode: ErrorCode.ACCOUNT_DEACTIVATED,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.profile.password || '',
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        errorCode: ErrorCode.INVALID_CREDENTIALS,
      });
    }

    // Check verification status
    if (isPhone && !user.profile.phoneNumberVerified) {
      throw new UnauthorizedException({
        message: 'Please verify your phone number before signing in',
        errorCode: ErrorCode.EMAIL_NOT_VERIFIED,
      });
    }

    if (!isPhone && !user.profile.isValidated) {
      throw new UnauthorizedException({
        message: 'Please verify your email before signing in',
        errorCode: ErrorCode.EMAIL_NOT_VERIFIED,
      });
    }

    const { accessToken, refreshToken } = this.generateTokens(
      user,
      dto.rememberMe,
    );

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  // --- REFRESH TOKEN ---
  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userModel.findById(payload.sub);

      if (!user || !user.profile.isActive) {
        throw new UnauthorizedException({
          message: 'Invalid refresh token',
          errorCode: ErrorCode.INVALID_REFRESH_TOKEN,
        });
      }

      const newPayload: JwtPayload = {
        sub: user._id?.toString()!,
        email: user.profile.email || user.profile.phoneNumber || '',
        role: user.role,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid refresh token',
        errorCode: ErrorCode.INVALID_REFRESH_TOKEN,
      });
    }
  }

  // --- LOGOUT ---
  async logout(userId: string) {
    return { message: 'Logged out successfully' };
  }

  // --- GET ME ---
  async getMeFromPayload(payload: JwtPayload) {
    const user = await this.userModel
      .findById(payload.sub)
      .populate('memberships')
      .populate('currentProgram')
      .populate('notifications')
      .exec();

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    const sanitizedUser = this.sanitizeUser(user);

    // Manually populate plan data
    if (sanitizedUser.appSubscription?.planId) {
      const plan = await this.appPlanModel
        .findOne({ planId: sanitizedUser.appSubscription.planId })
        .lean()
        .exec();
      sanitizedUser.appSubscription.plan = plan;
    }

    return sanitizedUser;
  }

  // --- VERIFY EMAIL ---
  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException({
        message: 'Invalid or expired verification token',
        errorCode: ErrorCode.INVALID_VERIFICATION_TOKEN,
      });
    }

    user.profile.isValidated = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    const { accessToken, refreshToken } = this.generateTokens(user, false);

    return {
      message: 'Email verified successfully',
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  // --- RESEND VERIFICATION ---
  async resendVerification(
    email: string,
    ip: string,
    platform: Platform = Platform.WEB,
  ) {
    const user = await this.userModel.findOne({ 'profile.email': email });

    if (!user) {
      throw new BadRequestException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    if (user.profile.isValidated) {
      throw new BadRequestException({
        message: 'Email is already verified',
        errorCode: ErrorCode.EMAIL_ALREADY_VERIFIED,
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    const verificationUrl = buildRedirectUrl(platform, '/auth/verify-email', {
      token: verificationToken,
    });

    this.notificationsService
      .notifyUser(user, {
        key: 'auth.verify',
        vars: { verifyUrl: verificationUrl },
        sendSms: false,
      })
      .catch((err) => {
        this.logger.error(`Failed to send verification email: ${err.message}`);
      });

    return { message: 'Verification email resent successfully' };
  }

  // --- FORGOT PASSWORD ---
  async forgotPassword(identifier: string, platform: Platform = Platform.WEB) {
    const isPhone = isPhoneNumber(identifier);
    const query = isPhone
      ? { 'profile.phoneNumber': identifier }
      : { 'profile.email': identifier };

    const user = await this.userModel.findOne(query);

    const message = isPhone
      ? 'If an account exists with this phone number, a reset code has been sent'
      : 'If an account exists with this email, a password reset link has been sent';

    if (!user) return { message, method: isPhone ? 'phone' : 'email' };

    if (isPhone) {
      // Send OTP for phone-based reset
      try {
        await this.otpService.sendOTP(identifier, user._id.toString());
      } catch (error) {
        this.logger.error(
          `Failed to send password reset OTP to ${identifier}: ${error}`,
        );
      }
    } else {
      // Send reset link for email-based reset
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

      user.resetPasswordToken = resetToken;
      user.resetPasswordTokenExpiry = resetTokenExpiry;
      await user.save();

      const resetUrl = buildRedirectUrl(platform, '/auth/reset-password', {
        token: resetToken,
      });

      this.notificationsService
        .notifyUser(user, {
          key: 'auth.reset_password',
          vars: { resetUrl },
          sendSms: false,
        })
        .catch((err) => {
          this.logger.error(
            `Failed to send reset password email: ${err.message}`,
          );
        });
    }

    return { message, method: isPhone ? 'phone' : 'email' };
  }

  // --- RESET PASSWORD ---
  async resetPassword(token: string, newPassword: string) {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException({
        message: 'Invalid or expired reset token',
        errorCode: ErrorCode.INVALID_RESET_TOKEN,
      });
    }

    user.profile.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  // --- CHANGE PASSWORD ---
  async changePassword(
    userId: string,
    dto: { currentPassword: string; newPassword: string },
  ) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    if (!user.profile.password) {
      throw new BadRequestException({
        message: 'User has no password set (e.g. social login)',
        errorCode: ErrorCode.INVALID_CREDENTIALS,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.profile.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException({
        message: 'Invalid current password',
        errorCode: ErrorCode.INVALID_CREDENTIALS,
      });
    }

    user.profile.password = await bcrypt.hash(dto.newPassword, 10);
    await user.save();

    return { message: 'Password changed successfully' };
  }

  // --- GOOGLE AUTH ---
  async googleAuth(dto: IGoogleAuthDto) {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: dto.code,
        client_id: this.configService.get('GOOGLE_CLIENT_ID')!,
        client_secret: this.configService.get('GOOGLE_CLIENT_SECRET')!,
        redirect_uri: this.configService.get('GOOGLE_REDIRECT_URI')!,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new UnauthorizedException({
        message: 'Failed to authenticate with Google',
        errorCode: ErrorCode.GOOGLE_AUTH_FAILED,
      });
    }

    const tokens = await tokenResponse.json();

    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      { headers: { Authorization: `Bearer ${tokens.access_token}` } },
    );

    if (!userInfoResponse.ok) {
      throw new UnauthorizedException({
        message: 'Failed to get user info from Google',
        errorCode: ErrorCode.GOOGLE_USER_INFO_FAILED,
      });
    }

    const googleUser = await userInfoResponse.json();

    let user = await this.userModel.findOne({
      'profile.googleId': googleUser.id,
    });

    if (!user) {
      user = await this.userModel.findOne({
        'profile.email': googleUser.email,
      });

      if (user) {
        user.profile.googleId = googleUser.id;
        user.profile.picture = googleUser.picture;
        user.profile.isValidated = true;
        await user.save();
      } else {
        user = new this.userModel({
          profile: {
            username: googleUser.email.split('@')[0],
            email: googleUser.email,
            fullName: googleUser.name,
            googleId: googleUser.id,
            picture: googleUser.picture,
            profileImageUrl: googleUser.picture,
            isValidated: true,
            isOnBoarded: false,
            isActive: true,
          },
          role: UserRole.Member,
          memberships: [],
          subscriptionHistory: [],
          notifications: [],
        });
        await user.save();
      }
    }

    const { accessToken, refreshToken } = this.generateTokens(user, true);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  // --- SETUP MEMBER ACCOUNT ---
  async setupMemberAccount(setupToken: string, password: string) {
    const user = await this.userModel.findOne({
      setupToken,
      setupTokenExpiry: { $gt: new Date() },
      setupTokenUsed: false,
    });

    if (!user) {
      throw new BadRequestException({
        message: 'Invalid or expired setup token',
        errorCode: ErrorCode.INVALID_RESET_TOKEN,
      });
    }

    user.profile.password = await bcrypt.hash(password, 10);
    user.setupTokenUsed = true;
    user.profile.accountStatus = 'active';
    user.profile.isActive = true;
    user.profile.isValidated = true;

    if (user.profile.phoneNumber) {
      user.profile.phoneNumberVerified = true;
    }

    await user.save();

    const { accessToken, refreshToken } = this.generateTokens(user, false);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  // --- VALIDATE SETUP TOKEN ---
  async validateSetupToken(token: string) {
    const user = await this.userModel.findOne({
      setupToken: token,
      setupTokenExpiry: { $gt: new Date() },
      setupTokenUsed: false,
    });

    if (!user) {
      throw new BadRequestException({
        message: 'Invalid or expired setup token',
        errorCode: ErrorCode.INVALID_RESET_TOKEN,
      });
    }

    return { valid: true };
  }

  // --- GENERATE ACCESS QR TOKEN ---
  async generateAccessQR(memberId: string, gymId: string) {
    const payload = {
      memberId,
      gymId,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '30s',
    });

    return { token };
  }

  // --- HELPER: GET USER BY PHONE ---
  async getUserByPhoneNumber(phoneNumber: string) {
    return this.userModel.findOne({ 'profile.phoneNumber': phoneNumber });
  }

  // --- PRIVATE HELPERS ---

  private sanitizeUser(user: any) {
    const userObj = user.toObject ? user.toObject() : user;

    if (userObj.profile?.password) delete userObj.profile.password;
    delete userObj.verificationToken;
    delete userObj.verificationTokenExpiry;
    delete userObj.resetPasswordToken;
    delete userObj.resetPasswordTokenExpiry;

    return userObj;
  }

  private generateTokens(user: any, rememberMe: boolean = false) {
    const payload: JwtPayload = {
      sub: user._id?.toString()!,
      email: user.profile.email || user.profile.phoneNumber || '',
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: rememberMe ? '7d' : '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: rememberMe ? '30d' : '7d',
    });

    return { accessToken, refreshToken };
  }
}
