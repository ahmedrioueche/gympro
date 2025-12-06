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
import { MailerService } from '../../common/services/mailer.service';
import { getI18nText } from '../../common/utils/i18n';
import { Platform, buildRedirectUrl } from '../../common/utils/platform.util';
import { SigninDto, SignupDto } from './auth.dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
    private otpService: OtpService,
  ) {}

  // --- SIGNUP ---
  async signup(dto: SignupDto, platform: Platform = Platform.WEB) {
    const { email, phoneNumber, password, username } = dto;

    // Validate that at least one contact method is provided
    if (!email && !phoneNumber) {
      throw new BadRequestException({
        message: 'Either email or phone number is required',
        errorCode: ErrorCode.INVALID_CREDENTIALS,
      });
    }

    // Check if user already exists with email or phone
    const existingUserQuery: any = {};
    if (email) {
      existingUserQuery['profile.email'] = email;
    }
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

    // Generate username if not provided
    const generatedUsername =
      username ||
      (email ? email.split('@')[0] : `user_${phoneNumber?.slice(-4)}`);

    // For email signup: send verification email
    // For phone signup: user needs to verify via OTP after signup
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
        isValidated: !email, // Auto-validate if no email (will verify phone via OTP)
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

    // Send verification email if email was provided
    if (email) {
      try {
        await this.sendVerificationEmail(
          email,
          verificationToken!,
          newUser.profile.fullName || newUser.profile.username,
          platform,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send verification email to ${email}: ${error}`,
        );
      }
    }

    // Send OTP if phone number was provided
    if (phoneNumber) {
      try {
        await this.otpService.sendOTP(phoneNumber, newUser._id.toString());
      } catch (error) {
        this.logger.error(`Failed to send OTP to ${phoneNumber}: ${error}`);
      }
    }

    return this.sanitizeUser(newUser);
  }

  // --- SIGNIN ---
  async signin(dto: SigninDto) {
    const { identifier } = dto;

    // Import phone utility
    const { isPhoneNumber } = await import('../../common/utils/phone.util');

    // Determine if identifier is phone or email
    const isPhone = isPhoneNumber(identifier);

    // Query by phone or email
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

    // Check if phone number is verified (if logging in with phone)
    if (isPhone && !user.profile.phoneNumberVerified) {
      throw new UnauthorizedException({
        message: 'Please verify your phone number before signing in',
        errorCode: ErrorCode.EMAIL_NOT_VERIFIED, // Reusing error code
      });
    }

    // Check if email is verified (if logging in with email)
    if (!isPhone && !user.profile.isValidated) {
      throw new UnauthorizedException({
        message: 'Please verify your email before signing in',
        errorCode: ErrorCode.EMAIL_NOT_VERIFIED,
      });
    }

    const payload: JwtPayload = {
      sub: user._id?.toString()!,
      email: user.profile.email || user.profile.phoneNumber || '',
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: dto.rememberMe ? '7d' : '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: dto.rememberMe ? '30d' : '7d',
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  // --- REFRESH ---
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
      .populate('notifications');

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    return this.sanitizeUser(user);
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

    const payload: JwtPayload = {
      sub: user._id?.toString()!,
      email: user.profile.email || '',
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

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

    try {
      await this.sendVerificationEmail(
        email,
        verificationToken,
        user.profile.fullName || user.profile.username,
        platform,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${email}: ${error}`,
      );
    }

    return {
      message: 'Verification email resent successfully',
    };
  }

  // --- FORGOT PASSWORD ---
  async forgotPassword(identifier: string, platform: Platform = Platform.WEB) {
    // Import phone utility
    const { isPhoneNumber } = await import('../../common/utils/phone.util');

    // Determine if identifier is phone or email
    const isPhone = isPhoneNumber(identifier);

    // Query by phone or email
    const query = isPhone
      ? { 'profile.phoneNumber': identifier }
      : { 'profile.email': identifier };

    const user = await this.userModel.findOne(query);

    const message = isPhone
      ? 'If an account exists with this phone number, a reset code has been sent'
      : 'If an account exists with this email, a password reset link has been sent';

    if (!user) return { message, method: isPhone ? 'phone' : 'email' };

    if (isPhone) {
      // Send OTP for phone-based password reset
      try {
        await this.otpService.sendOTP(identifier, user._id.toString());
      } catch (error) {
        this.logger.error(
          `Failed to send password reset OTP to ${identifier}: ${error}`,
        );
      }
    } else {
      // Send reset link for email-based password reset
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

      user.resetPasswordToken = resetToken;
      user.resetPasswordTokenExpiry = resetTokenExpiry;
      await user.save();

      try {
        await this.sendPasswordResetEmail(
          identifier,
          resetToken,
          user.profile.fullName || user.profile.username,
          platform,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send password reset email to ${identifier}: ${error}`,
        );
      }
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

    const payload: JwtPayload = {
      sub: user._id?.toString()!,
      email: user.profile.email || '',
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  // --- SANITIZE USER ---
  private sanitizeUser(user: any) {
    const userObj = user.toObject ? user.toObject() : user;

    if (userObj.profile?.password) delete userObj.profile.password;
    delete userObj.verificationToken;
    delete userObj.verificationTokenExpiry;
    delete userObj.resetPasswordToken;
    delete userObj.resetPasswordTokenExpiry;

    return userObj;
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

    // Hash the new password
    user.profile.password = await bcrypt.hash(password, 10);
    user.setupTokenUsed = true;
    user.profile.accountStatus = 'active';
    user.profile.isActive = true;
    user.profile.isValidated = true;

    // Mark phone as verified if phone number exists
    if (user.profile.phoneNumber) {
      user.profile.phoneNumberVerified = true;
    }

    await user.save();

    // Generate JWT tokens for auto-login
    const payload: JwtPayload = {
      sub: user._id?.toString()!,
      email: user.profile.email || user.profile.phoneNumber || '',
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

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

  // --- HELPER METHODS ---
  async getUserByPhoneNumber(phoneNumber: string) {
    return this.userModel.findOne({ 'profile.phoneNumber': phoneNumber });
  }

  // --- EMAILS ---
  private async sendVerificationEmail(
    email: string,
    token: string,
    name?: string,
    platform: Platform = Platform.WEB,
  ) {
    // Build platform-specific verification URL
    const verificationUrl = buildRedirectUrl(platform, '/auth/verify-email', {
      token,
    });

    const subject = getI18nText('email.verify_subject');
    const html = getI18nText(
      'email.verify_body',
      { fullName: name, email },
      { verifyUrl: verificationUrl },
    );
    await this.mailerService.sendMail(email, subject, html);
  }

  private async sendPasswordResetEmail(
    email: string,
    token: string,
    name?: string,
    platform: Platform = Platform.WEB,
  ) {
    // Build platform-specific reset URL
    const resetUrl = buildRedirectUrl(platform, '/auth/reset-password', {
      token,
    });

    const subject = getI18nText('email.reset_password_subject');
    const html = getI18nText(
      'email.reset_password_body',
      { fullName: name, email },
      { resetUrl },
    );
    await this.mailerService.sendMail(email, subject, html);
  }
}
