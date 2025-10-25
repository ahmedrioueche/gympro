import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Db, ObjectId } from 'mongodb';
import { DATABASE_CONNECTION } from '../../../common/providers/mongo.provider';
import { MailerService } from '../../../common/services/mailer.service';
import { getI18nText } from '../../../common/utils/i18n';
import { GoogleAuthDto, GoogleUserDto } from '../dto/google-auth.dto';
import { SigninDto } from '../dto/signin.dto';
import { SignupDto } from '../dto/signup.dto';
import {
  EmailVerification,
  PasswordReset,
} from '../entities/email-verification.entity';
import { User } from '../entities/user.entity';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshchangeme';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map<string, { count: number; last: number }>();

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: Db,
    private readonly mailer: MailerService,
  ) {}

  private async sendVerificationEmail(user: User, email: string) {
    const userId = user._id
      ? user._id.toString()
      : (() => {
          throw new Error('User _id is required for verification email');
        })();
    // Clean up expired tokens for this user
    await this.db
      .collection<EmailVerification>('emailVerifications')
      .deleteMany({
        userId,
        expiresAt: { $lt: new Date() },
      });
    // Remove any existing tokens for this user
    await this.db
      .collection<EmailVerification>('emailVerifications')
      .deleteMany({
        userId,
      });
    // Generate new token
    const token = randomBytes(32).toString('hex');
    await this.db
      .collection<EmailVerification>('emailVerifications')
      .insertOne({
        userId,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      });
    // Send i18n email
    const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;
    const subject = getI18nText('email.verify_subject', user);
    const html = getI18nText('email.verify_body', user, { verifyUrl });
    await this.mailer.sendMail(email, subject, html);
  }

  async signup(dto: SignupDto) {
    const existing = await this.db
      .collection<User>('users')
      .findOne({ email: dto.email });
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user: User = {
      email: dto.email,
      password: hashed,
      name: dto.name || '',
      role: 'member',
      createdAt: new Date(),
      isValidated: false, // ✅ not verified yet
      isActive: true,
      isOnBoarded: false, // ✅ not onboarded yet
    };

    const result = await this.db.collection<User>('users').insertOne(user);
    const createdUser = { ...user, _id: result.insertedId };

    // ✅ Send verification email (modular)
    await this.sendVerificationEmail(createdUser, dto.email);

    return {
      message:
        'User created successfully. Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string) {
    const record = await this.db
      .collection<EmailVerification>('emailVerifications')
      .findOne({ token });

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    // Get the user
    const user = await this.db
      .collection<User>('users')
      .findOne({ _id: new ObjectId(record.userId) });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Mark email as verified
    await this.db
      .collection<User>('users')
      .updateOne(
        { _id: new ObjectId(record.userId) },
        { $set: { isValidated: true } },
      );

    // ✅ delete token after use
    await this.db
      .collection('emailVerifications')
      .deleteOne({ _id: record._id });

    // Generate authentication tokens
    const payload = { sub: user._id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    return {
      message: 'Email verified successfully. You are now logged in.',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.name,
        role: user.role,
        isVerified: true,
        isOnBoarded: false, // Will be set during onboarding
      },
    };
  }

  async signin(dto: SigninDto) {
    const user = await this.db
      .collection<User>('users')
      .findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // ✅ block login until email verified (except for Google OAuth users)
    if (!user.isValidated && !user.googleId) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    // For Google OAuth users, skip password check
    if (user.googleId) {
      throw new UnauthorizedException(
        'This account was created with Google. Please use Google Sign-In.',
      );
    }

    // For regular users, check password
    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user._id, email: user.email, role: user.role };

    // Set token expiration based on rememberMe flag
    const accessTokenExpiry = dto.rememberMe ? '7d' : '15m';
    const refreshTokenExpiry = dto.rememberMe ? '30d' : '7d';

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: accessTokenExpiry,
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: refreshTokenExpiry,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.name,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
      const user = await this.db
        .collection<User>('users')
        .findOne({ _id: new ObjectId(payload.sub) });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = { sub: user._id, email: user.email, role: user.role };
      const newAccessToken = jwt.sign(newPayload, JWT_SECRET, {
        expiresIn: '15m',
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    try {
      // In a more sophisticated system, you might want to:
      // 1. Add the refresh token to a blacklist
      // 2. Clear any session data
      // 3. Log the logout event

      // For now, we'll just return success
      // The frontend will clear cookies, and the backend will reject expired tokens

      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new UnauthorizedException('Logout failed');
    }
  }

  async getMeFromPayload(payload: any) {
    const { sub } = payload;
    const user = await this.db
      .collection('users')
      .findOne({ _id: new ObjectId(sub) }, { projection: { password: 0 } });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async resendVerification(email: string, ip: string) {
    const key = `${email}:${ip}`;
    const now = Date.now();
    const entry = rateLimitMap.get(key) || { count: 0, last: 0 };
    if (now - entry.last > RATE_LIMIT_WINDOW_MS) {
      entry.count = 0;
      entry.last = now;
    }
    entry.count++;
    entry.last = now;
    rateLimitMap.set(key, entry);
    if (entry.count > RATE_LIMIT_MAX) {
      throw new UnauthorizedException(
        'Too many requests. Please try again later.',
      );
    }

    const user = await this.db.collection<User>('users').findOne({ email });
    if (!user) throw new UnauthorizedException('User not found');
    if (user.isValidated) {
      return { message: getI18nText('email.already_verified', user) };
    }

    // Modular: send verification email
    await this.sendVerificationEmail(user, email);

    return { message: getI18nText('email.resent', user) };
  }

  async googleAuth(dto: GoogleAuthDto) {
    try {
      // Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(dto.code);

      // Get user info from Google
      const googleUser = await this.getGoogleUserInfo(tokens.access_token);

      // Find or create user
      const user = await this.findOrCreateGoogleUser(googleUser);

      // Generate JWT tokens
      const payload = { sub: user._id, email: user.email, role: user.role };
      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: '30d',
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.name,
          role: user.role,
          isOnBoarded: user.isOnBoarded || false,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async forgotPassword(email: string) {
    // Always return generic message
    const genericMsg = {
      message: 'If the email exists, a reset link has been sent.',
    };
    const user = await this.db.collection<User>('users').findOne({ email });
    if (!user) return genericMsg;

    // Remove old tokens for this user
    await this.db
      .collection<PasswordReset>('passwordResets')
      .deleteMany({ userId: user._id?.toString() });

    // Generate token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await this.db.collection<PasswordReset>('passwordResets').insertOne({
      userId: user._id!.toString(),
      token,
      expiresAt,
      used: false,
    });

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
    const subject = getI18nText('email.reset_password_subject', user);
    const html = getI18nText('email.reset_password_body', user, { resetUrl });
    await this.mailer.sendMail(email, subject, html);
    return genericMsg;
  }

  async resetPassword(token: string, password: string) {
    const record = await this.db
      .collection<PasswordReset>('passwordResets')
      .findOne({ token });
    if (!record || record.expiresAt < new Date() || record.used) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    const user = await this.db
      .collection<User>('users')
      .findOne({ _id: new ObjectId(record.userId) });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const hashed = await bcrypt.hash(password, 10);
    await this.db
      .collection<User>('users')
      .updateOne(
        { _id: new ObjectId(record.userId) },
        { $set: { password: hashed } },
      );
    // Mark token as used
    await this.db
      .collection<PasswordReset>('passwordResets')
      .updateOne({ _id: record._id }, { $set: { used: true } });
    return { message: 'Password reset successful.' };
  }

  private async exchangeCodeForTokens(code: string) {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: (process.env.GOOGLE_CLIENT_ID ||
          process.env.GOOGLE_CLIENT_ID)!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    return await tokenResponse.json();
  }

  private async getGoogleUserInfo(accessToken: string): Promise<GoogleUserDto> {
    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!userResponse.ok) {
      throw new Error('Failed to get user info from Google');
    }

    const userData = await userResponse.json();
    return {
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      sub: userData.id,
    };
  }

  private async findOrCreateGoogleUser(
    googleUser: GoogleUserDto,
  ): Promise<User> {
    // Check if user exists
    let user = await this.db.collection<User>('users').findOne({
      email: googleUser.email,
    });

    if (user) {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        await this.db.collection<User>('users').updateOne(
          { _id: user._id },
          {
            $set: {
              googleId: googleUser.sub,
              picture: googleUser.picture,
              isValidated: true, // Google users are automatically validated
            },
          },
        );
        user = await this.db
          .collection<User>('users')
          .findOne({ _id: user._id });
      }
      return user!;
    }

    // Create new user
    const newUser: User = {
      email: googleUser.email,
      name: googleUser.name,
      role: 'member',
      createdAt: new Date(),
      isValidated: true, // Google users are automatically validated
      isActive: true,
      isOnBoarded: false, // ✅ not onboarded yet
      googleId: googleUser.sub,
      picture: googleUser.picture,
    };

    const result = await this.db.collection<User>('users').insertOne(newUser);
    return { ...newUser, _id: result.insertedId };
  }
}
