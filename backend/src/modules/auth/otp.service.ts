import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly OTP_LENGTH = 6;
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly MAX_OTP_ATTEMPTS = 3;
  private readonly RATE_LIMIT_MINUTES = 15;
  private readonly MAX_OTP_REQUESTS = 3;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private smsService: SmsService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate a 6-digit OTP code
   */
  private generateOTP(): string {
    const min = Math.pow(10, this.OTP_LENGTH - 1);
    const max = Math.pow(10, this.OTP_LENGTH) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  /**
   * Check if user has exceeded OTP rate limit
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
      // Check how many OTPs were sent in the rate limit window
      // For simplicity, we'll track this with a counter that resets after the window
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
   * Send OTP to phone number
   */
  async sendOTP(
    phoneNumber: string,
    userId?: string,
  ): Promise<{ success: boolean; message: string; remainingTime?: number }> {
    try {
      // Check rate limit
      const rateLimit = await this.checkRateLimit(phoneNumber);
      if (!rateLimit.allowed) {
        return {
          success: false,
          message: `Too many OTP requests. Please try again in ${rateLimit.remainingTime} minutes.`,
          remainingTime: rateLimit.remainingTime,
        };
      }

      // Find user by phone number or userId
      let user;
      if (userId) {
        user = await this.userModel.findById(userId);
      } else {
        user = await this.userModel.findOne({
          'profile.phoneNumber': phoneNumber,
        });
      }

      if (!user) {
        // For security, don't reveal if phone number exists
        this.logger.warn(
          `OTP requested for non-existent phone: ${phoneNumber}`,
        );
        return {
          success: true,
          message: 'OTP sent successfully',
        };
      }

      // Generate OTP
      const otp = this.generateOTP();
      const hashedOtp = await bcrypt.hash(otp, 10);

      // Set OTP expiry
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + this.OTP_EXPIRY_MINUTES);

      // Update user with OTP details
      user.otpCode = hashedOtp;
      user.otpExpiry = otpExpiry;
      user.otpAttempts = 0;
      user.otpLastSentAt = new Date();
      await user.save();

      // Send OTP via SMS
      const fromNumber =
        this.configService.get<string>('VONAGE_FROM_NUMBER') || 'GymPro';
      const message = `Your GymPro verification code is: ${otp}. Valid for ${this.OTP_EXPIRY_MINUTES} minutes.`;

      const smsResult = await this.smsService.send(
        phoneNumber,
        fromNumber,
        message,
      );

      if (!smsResult.success) {
        this.logger.error(`Failed to send OTP SMS: ${smsResult.error}`);
        return {
          success: false,
          message: 'Failed to send OTP. Please try again.',
        };
      }

      this.logger.log(`OTP sent successfully to ${phoneNumber}`);
      return {
        success: true,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      this.logger.error(`Error sending OTP: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'An error occurred while sending OTP',
      };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(
    phoneNumber: string,
    code: string,
  ): Promise<{
    success: boolean;
    message: string;
    userId?: string;
    attemptsRemaining?: number;
  }> {
    try {
      const user = await this.userModel.findOne({
        'profile.phoneNumber': phoneNumber,
      });

      if (!user || !user.otpCode || !user.otpExpiry) {
        return {
          success: false,
          message: 'No OTP found. Please request a new one.',
        };
      }

      // Check if OTP has expired
      if (new Date() > new Date(user.otpExpiry)) {
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.',
        };
      }

      // Check attempts
      if ((user.otpAttempts ?? 0) >= this.MAX_OTP_ATTEMPTS) {
        return {
          success: false,
          message:
            'Maximum verification attempts exceeded. Please request a new OTP.',
        };
      }

      // Verify OTP
      const isValid = await bcrypt.compare(code, user.otpCode);

      if (!isValid) {
        // Increment attempts
        user.otpAttempts = (user.otpAttempts ?? 0) + 1;
        await user.save();

        const remaining = this.MAX_OTP_ATTEMPTS - (user.otpAttempts ?? 0);
        return {
          success: false,
          message: `Invalid OTP code. ${remaining} attempts remaining.`,
          attemptsRemaining: remaining,
        };
      }

      // OTP is valid - mark phone as verified and clear OTP fields
      user.profile.phoneNumberVerified = true;
      user.otpCode = undefined;
      user.otpExpiry = undefined;
      user.otpAttempts = 0;
      await user.save();

      this.logger.log(`Phone verified successfully: ${phoneNumber}`);
      return {
        success: true,
        message: 'Phone number verified successfully',
        userId: user._id.toString(),
      };
    } catch (error) {
      this.logger.error(`Error verifying OTP: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'An error occurred while verifying OTP',
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
