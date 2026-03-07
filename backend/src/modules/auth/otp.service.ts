import { ErrorCode } from '@ahmedrioueche/gympro-client';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly RATE_LIMIT_MINUTES = 1; // Simplify rate limiting as Twilio handles it

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private smsService: SmsService,
    private configService: ConfigService,
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
}
