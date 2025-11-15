import { AuthErrorCode, UserRole } from '@gympro/client';
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
import { User } from '../../../common/schemas/user.schema';
import { MailerService } from '../../../common/services/mailer.service';
import { getI18nText } from '../../../common/utils/i18n';
import { SigninDto } from '../dto/signin.dto';
import { SignupDto } from '../dto/signup.dto';

interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

interface GoogleAuthDto {
  code: string;
  state?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async signup(dto: SignupDto) {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      'profile.email': dto.email,
    });

    if (existingUser) {
      throw new ConflictException({
        message: 'User with this email already exists',
        errorCode: AuthErrorCode.USER_ALREADY_EXISTS,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user with default member role
    const newUser = new this.userModel({
      profile: {
        username: dto.username || dto.email.split('@')[0],
        email: dto.email,
        password: hashedPassword,
        isValidated: false,
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
    try {
      await this.sendVerificationEmail(
        newUser.profile.email,
        verificationToken,
        newUser.profile.fullName || newUser.profile.username,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${newUser.profile.email}: ${error}`,
      );
      // Don't fail signup if email fails, but log it
    }

    return {
      message:
        'User registered successfully. Please check your email to verify your account.',
      userId: newUser._id,
      email: newUser.profile.email,
    };
  }

  async signin(dto: SigninDto) {
    // Find user by email
    const user = await this.userModel.findOne({
      'profile.email': dto.email,
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        errorCode: AuthErrorCode.INVALID_CREDENTIALS,
      });
    }

    // Check if user is active
    if (!user.profile.isActive) {
      throw new UnauthorizedException({
        message: 'Account is deactivated',
        errorCode: AuthErrorCode.ACCOUNT_DEACTIVATED,
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.profile.password || '',
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        errorCode: AuthErrorCode.INVALID_CREDENTIALS,
      });
    }

    // Check if email is verified
    if (!user.profile.isValidated) {
      throw new UnauthorizedException({
        message: 'Please verify your email before signing in',
        errorCode: AuthErrorCode.EMAIL_NOT_VERIFIED,
      });
    }

    // Generate tokens
    const payload: JwtPayload = {
      sub: user._id?.toString()!,
      email: user.profile.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: dto.rememberMe ? '7d' : '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: dto.rememberMe ? '30d' : '7d',
    });

    // Remove sensitive data before returning
    const userResponse = this.sanitizeUser(user);

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Find user
      const user = await this.userModel.findById(payload.sub);

      if (!user || !user.profile.isActive) {
        throw new UnauthorizedException({
          message: 'Invalid refresh token',
          errorCode: AuthErrorCode.INVALID_REFRESH_TOKEN,
        });
      }

      // Generate new access token
      const newPayload: JwtPayload = {
        sub: user._id?.toString()!,
        email: user.profile.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid refresh token',
        errorCode: AuthErrorCode.INVALID_REFRESH_TOKEN,
      });
    }
  }

  async logout(userId: string) {
    // Future: Implement token blacklisting or session invalidation
    // For now, just return success (cookies are cleared on client)
    return { message: 'Logged out successfully' };
  }

  async getMeFromPayload(payload: JwtPayload) {
    const user = await this.userModel
      .findById(payload.sub)
      .populate('memberships')
      .populate('currentProgram')
      .populate('notifications');

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        errorCode: AuthErrorCode.USER_NOT_FOUND,
      });
    }

    return this.sanitizeUser(user);
  }

  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException({
        message: 'Invalid or expired verification token',
        errorCode: AuthErrorCode.INVALID_VERIFICATION_TOKEN,
      });
    }

    // Update user
    user.profile.isValidated = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    // Generate tokens for automatic login
    const payload: JwtPayload = {
      sub: user._id?.toString()!,
      email: user.profile.email,
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

  async resendVerification(email: string, ip: string) {
    const user = await this.userModel.findOne({ 'profile.email': email });

    if (!user) {
      throw new BadRequestException({
        message: 'User not found',
        errorCode: AuthErrorCode.USER_NOT_FOUND,
      });
    }

    if (user.profile.isValidated) {
      throw new BadRequestException({
        message: 'Email is already verified',
        errorCode: AuthErrorCode.EMAIL_ALREADY_VERIFIED,
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Send verification email
    try {
      await this.sendVerificationEmail(
        email,
        verificationToken,
        user.profile.fullName || user.profile.username,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${email}: ${error}`,
      );
      // Still return success to avoid revealing if email exists
    }

    return {
      message: 'Verification email resent successfully',
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ 'profile.email': email });

    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return {
        message:
          'If an account exists with this email, a password reset link has been sent',
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send password reset email
    try {
      await this.sendPasswordResetEmail(
        email,
        resetToken,
        user.profile.fullName || user.profile.username,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}: ${error}`,
      );
      // Still return success to avoid revealing if email exists
    }

    return {
      message:
        'If an account exists with this email, a password reset link has been sent',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException({
        message: 'Invalid or expired reset token',
        errorCode: AuthErrorCode.INVALID_RESET_TOKEN,
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    user.profile.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    return {
      message: 'Password reset successfully',
    };
  }

  async googleAuth(dto: GoogleAuthDto) {
    // Exchange code for tokens
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
        errorCode: AuthErrorCode.GOOGLE_AUTH_FAILED,
      });
    }

    const tokens = await tokenResponse.json();

    // Get user info from Google
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
    );

    if (!userInfoResponse.ok) {
      throw new UnauthorizedException({
        message: 'Failed to get user info from Google',
        errorCode: AuthErrorCode.GOOGLE_USER_INFO_FAILED,
      });
    }

    const googleUser = await userInfoResponse.json();

    // Find or create user
    let user = await this.userModel.findOne({
      'profile.googleId': googleUser.id,
    });

    if (!user) {
      // Check if user exists with this email
      user = await this.userModel.findOne({
        'profile.email': googleUser.email,
      });

      if (user) {
        // Link Google account to existing user
        user.profile.googleId = googleUser.id;
        user.profile.picture = googleUser.picture;
        user.profile.isValidated = true; // Google emails are verified
        await user.save();
      } else {
        // Create new user
        user = new this.userModel({
          profile: {
            username: googleUser.email.split('@')[0],
            email: googleUser.email,
            fullName: googleUser.name,
            googleId: googleUser.id,
            picture: googleUser.picture,
            profileImageUrl: googleUser.picture,
            isValidated: true, // Google emails are verified
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

    // Generate tokens
    const payload: JwtPayload = {
      sub: user._id?.toString()!,
      email: user.profile.email,
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

  // Helper method to remove sensitive data
  private sanitizeUser(user: any) {
    const userObj = user.toObject ? user.toObject() : user;

    if (userObj.profile?.password) {
      delete userObj.profile.password;
    }

    delete userObj.verificationToken;
    delete userObj.verificationTokenExpiry;
    delete userObj.resetPasswordToken;
    delete userObj.resetPasswordTokenExpiry;

    return userObj;
  }

  private async sendVerificationEmail(
    email: string,
    token: string,
    name?: string,
  ): Promise<void> {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      process.env.FRONTEND_URL ||
      'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/auth/verify-email?token=${token}`;

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
  ): Promise<void> {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      process.env.FRONTEND_URL ||
      'http://localhost:5173';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

    const subject = getI18nText('email.reset_password_subject');
    const html = getI18nText(
      'email.reset_password_body',
      { fullName: name, email },
      { resetUrl },
    );

    await this.mailerService.sendMail(email, subject, html);
  }
}
