import { ErrorCode } from '@ahmedrioueche/gympro-client';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { MailerService } from '../../common/services/mailer.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly RATE_LIMIT_MINUTES = 1;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private smsService: SmsService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  /**
   * Check if user has exceeded OTP rate limit (Local safety check)
   */
  async checkRateLimit(phoneNumber: string): Promise<{
    allowed: boolean;
    remainingTime?: number;
  }> {
    const user = await this.userModel.findOne({
      'profile.phoneNumber': phoneNumber,
    });

    if (!user || !user.otpLastSentAt) {
      return { allowed: true };
    }

    const now = new Date();
    const timeSinceLastSent =
      now.getTime() - new Date(user.otpLastSentAt).getTime();
    const minutesSinceLastSent = timeSinceLastSent / (1000 * 60);

    if (minutesSinceLastSent < this.RATE_LIMIT_MINUTES) {
      const remainingTime = Math.ceil(
        this.RATE_LIMIT_MINUTES - minutesSinceLastSent,
      );
      return {
        allowed: false,
        remainingTime,
      };
    }

    return { allowed: true };
  }

  /**
   * Enforce 1 OTP per minute per user (shared otpLastSentAt field)
   */
  private enforceUserOtpRateLimit(user: User): void {
    if (!user.otpLastSentAt) {
      return;
    }

    const minutesSinceLastSent =
      (Date.now() - new Date(user.otpLastSentAt).getTime()) / (1000 * 60);

    if (minutesSinceLastSent < this.RATE_LIMIT_MINUTES) {
      const remainingTime = Math.ceil(
        this.RATE_LIMIT_MINUTES - minutesSinceLastSent,
      );
      throw new BadRequestException({
        message: `Please wait ${remainingTime} minute(s) before requesting another code.`,
        errorCode: ErrorCode.TOO_MANY_REQUESTS,
        remainingTime,
      });
    }
  }

  /**
   * Send OTP to phone number using Twilio Verify
   */
  async sendOTP(
    phoneNumber: string,
    userId?: string,
  ): Promise<{ success: boolean; message: string; remainingTime?: number }> {
    try {
      // Local rate limit check
      const rateLimit = await this.checkRateLimit(phoneNumber);
      if (!rateLimit.allowed) {
        throw new BadRequestException({
          message: `Too many OTP requests. Please try again in ${rateLimit.remainingTime} minutes.`,
          errorCode: ErrorCode.TOO_MANY_REQUESTS,
          remainingTime: rateLimit.remainingTime,
        });
      }

      // Find user
      let user;
      if (userId) {
        user = await this.userModel.findById(userId);
      } else {
        user = await this.userModel.findOne({
          'profile.phoneNumber': phoneNumber,
        });
      }

      if (!user) {
        this.logger.warn(
          `OTP requested for non-existent phone: ${phoneNumber}`,
        );
        return {
          success: true,
          message: 'OTP sent successfully',
        };
      }

      // Update last sent timestamp for local rate limiting
      user.otpLastSentAt = new Date();
      await user.save();

      // Start Twilio Verification
      const smsResult = await this.smsService.sendVerification(phoneNumber);

      if (!smsResult.success) {
        this.logger.error(
          `Failed to send Twilio Verify SMS: ${smsResult.error}`,
        );
        throw new BadRequestException({
          message: 'Failed to send verification code',
          errorCode: ErrorCode.SMS_SEND_FAILED,
        });
      }

      this.logger.log(
        `Twilio verification sent successfully to ${phoneNumber}`,
      );
      return {
        success: true,
        message: 'Verification code sent successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error sending OTP: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'An error occurred while sending verification code',
      };
    }
  }

  /**
   * Verify OTP code using Twilio Verify
   */
  async verifyOTP(
    phoneNumber: string,
    code: string,
  ): Promise<{
    success: boolean;
    message: string;
    userId?: string;
  }> {
    try {
      const user = await this.userModel.findOne({
        'profile.phoneNumber': phoneNumber,
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found.',
        };
      }

      // Check verification code via Twilio
      const verifyResult = await this.smsService.checkVerification(
        phoneNumber,
        code,
      );

      if (!verifyResult.success) {
        this.logger.warn(
          `Invalid verification code for ${phoneNumber}: ${verifyResult.error}`,
        );
        throw new BadRequestException({
          message: 'Invalid verification code',
          errorCode: ErrorCode.INVALID_OTP,
        });
      }

      // Verification is successful - mark phone as verified
      user.profile.phoneNumberVerified = true;
      // Clear old manual OTP fields if they exist
      user.otpCode = undefined;
      user.otpExpiry = undefined;
      user.otpAttempts = 0;
      await user.save();

      this.logger.log(`Phone verified successfully via Twilio: ${phoneNumber}`);
      return {
        success: true,
        message: 'Phone number verified successfully',
        userId: user._id.toString(),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error verifying OTP: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'An error occurred while verifying the code',
      };
    }
  }

  /**
   * Clear OTP data for a user
   */
  async clearOTP(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $unset: {
        otpCode: '',
        otpExpiry: '',
      },
      $set: {
        otpAttempts: 0,
      },
    });
  }

  /**
   * Send OTP to email using Resend
   */
  async sendEmailOTP(
    email: string,
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new BadRequestException({
          message: 'User not found',
          errorCode: ErrorCode.USER_NOT_FOUND,
        });
      }

      // Generate 6-digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + 10); // 10 minutes expiry

      // Save to user
      user.otpCode = code;
      user.otpExpiry = expiry;
      user.otpAttempts = 0;
      user.otpLastSentAt = new Date();
      await user.save();

      // Send via Resend
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #0f172a; margin-bottom: 16px;">Verify your email</h2>
          <p style="color: #475569; font-size: 16px; margin-bottom: 24px;">Your verification code is:</p>
          <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #3b82f6;">${code}</span>
          </div>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">This code will expire in 10 minutes.</p>
        </div>
      `;

      await this.mailerService.sendMail(
        email,
        `${code} is your GymPro verification code`,
        html,
      );

      return { success: true, message: 'Verification code sent to your email' };
    } catch (error) {
      this.logger.error(
        `Error sending email OTP: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException({
        message: 'Failed to send verification email',
        errorCode: ErrorCode.SMS_SEND_FAILED,
      });
    }
  }

  /**
   * Verify email OTP
   */
  async verifyEmailOTP(
    email: string,
    code: string,
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new BadRequestException({
          message: 'User not found',
          errorCode: ErrorCode.USER_NOT_FOUND,
        });
      }

      if (!user.otpCode || user.otpCode !== code) {
        throw new BadRequestException({
          message: 'Invalid verification code',
          errorCode: ErrorCode.INVALID_OTP,
        });
      }

      if (user.otpExpiry && new Date() > user.otpExpiry) {
        throw new BadRequestException({
          message: 'Verification code has expired',
          errorCode: ErrorCode.OTP_EXPIRED,
        });
      }

      // Success
      user.profile.email = email;
      user.profile.isValidated = true; // Mark as validated
      user.otpCode = undefined;
      user.otpExpiry = undefined;
      user.otpAttempts = 0;
      await user.save();

      return { success: true, message: 'Email verified and added to profile' };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error(
        `Error verifying email OTP: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException({
        message: 'An error occurred during verification',
      });
    }
  }

  /**
   * Send OTP to the user's registered email for account deletion
   */
  async sendAccountDeletionOTP(
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    const email = user.profile?.email;
    if (!email) {
      throw new BadRequestException({
        message: 'No email associated with this account',
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }

    this.enforceUserOtpRateLimit(user);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);

    user.otpCode = code;
    user.otpExpiry = expiry;
    user.otpAttempts = 0;
    user.otpLastSentAt = new Date();
    await user.save();

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a; margin-bottom: 16px;">Confirm account deletion</h2>
        <p style="color: #475569; font-size: 16px; margin-bottom: 24px;">Use this code to confirm deletion of your GymPro account:</p>
        <div style="background-color: #fef2f2; padding: 16px; text-align: center; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #dc2626;">${code}</span>
        </div>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">This code expires in 10 minutes. If you did not request this, ignore this email.</p>
      </div>
    `;

    await this.mailerService.sendMail(
      email,
      `${code} — confirm GymPro account deletion`,
      html,
    );

    return {
      success: true,
      message: 'Verification code sent to your email',
    };
  }

  /**
   * Verify account-deletion OTP without modifying profile fields
   */
  async verifyAccountDeletionOTP(
    userId: string,
    code: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    if (!user.otpCode || user.otpCode !== code) {
      throw new BadRequestException({
        message: 'Invalid verification code',
        errorCode: ErrorCode.INVALID_OTP,
      });
    }

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      throw new BadRequestException({
        message: 'Verification code has expired',
        errorCode: ErrorCode.OTP_EXPIRED,
      });
    }

    user.otpCode = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;
    await user.save();

    return { success: true, message: 'Verification successful' };
  }
}
