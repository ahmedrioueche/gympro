import { ApiResponse, AttendanceStatus } from '@ahmedrioueche/gympro-client';
import { apiResponse } from '@ahmedrioueche/gympro-client/dist/api/helper';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import { GymModel } from '../gym/gym.schema';
import { GymMembershipModel } from '../gymMembership/membership.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { AttendanceRecordModel } from './attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel('AttendanceRecord')
    private attendanceModel: Model<AttendanceRecordModel>,
    @InjectModel(GymModel.name) private gymModel: Model<GymModel>,
    @InjectModel('GymMembership')
    private membershipModel: Model<GymMembershipModel>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * Safely convert a string to a Mongoose ObjectId
   */
  private toObjectId(id: any): Types.ObjectId | null {
    if (!id || typeof id !== 'string') return null;
    const cid = id.trim();
    if (Types.ObjectId.isValid(cid) && cid.length === 24) {
      try {
        return new Types.ObjectId(cid);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  async checkIn(
    token: string,
    gymId: string,
  ): Promise<ApiResponse<AttendanceRecordModel>> {
    console.log(`[AttendanceService] Check-in attempt for gym: ${gymId}`);
    let memberId: string | undefined;
    const now = new Date();

    try {
      // 1. Verify and decode the access token
      let decoded: any;
      try {
        decoded = this.jwtService.verify(token);
        memberId = decoded.memberId;
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          const payload = this.jwtService.decode(token) as any;
          memberId = payload?.memberId;
          throw new BadRequestException('QR Code has expired. Please refresh.');
        }
        throw new BadRequestException('Invalid QR Code');
      }

      if (decoded.gymId !== gymId) {
        throw new BadRequestException('Token not valid for this gym');
      }

      // 2. Validate user existence
      const user = await this.userModel.findById(memberId);
      if (!user) {
        throw new NotFoundException('Member not found');
      }

      // 3. Check for active membership at this gym
      const userObjectId = this.toObjectId(memberId);
      const gymObjectId = this.toObjectId(gymId);

      if (!userObjectId || !gymObjectId) {
        throw new BadRequestException('Invalid member or gym ID');
      }

      const membership = await this.membershipModel.findOne({
        user: userObjectId,
        gym: gymObjectId,
        membershipStatus: 'active',
      });

      if (!membership) {
        throw new BadRequestException(
          'No active membership found for this gym',
        );
      }

      // 4. Fetch Gym for settings
      const gym = await this.gymModel.findById(gymObjectId);
      const accessControlType = gym?.settings?.accessControlType ?? 'flexible';

      // 5. Check subscription expiry
      const isExpired =
        membership.subscription?.endDate &&
        new Date(membership.subscription.endDate) < now;

      const accessMessage = isExpired
        ? 'Subscription expired. Please renew.'
        : 'Check-in successful';

      // 6. Handle strict vs loose behavior for expired subscriptions
      if (isExpired && accessControlType === 'strict') {
        throw new BadRequestException(accessMessage);
      }

      // 7. Create attendance record
      const attendance = new this.attendanceModel({
        _id: new Types.ObjectId().toString(),
        gymId: gymObjectId,
        userId: userObjectId,
        checkIn: now,
        status: isExpired
          ? ('denied' as AttendanceStatus)
          : ('checked_in' as AttendanceStatus),
        notes: isExpired ? accessMessage : undefined,
        expiryDate: membership.subscription?.endDate,
        createdAt: now,
      });

      await attendance.save();

      const populated = await this.attendanceModel
        .findById(attendance._id)
        .populate('userId', 'profile.fullName profile.profileImageUrl');

      // Emit real-time event
      this.notificationsGateway.sendToGym(gymId, 'access_attempt', {
        status: 'granted',
        name: (populated as any).userId?.profile?.fullName || 'Active Member',
        photo: (populated as any).userId?.profile?.profileImageUrl,
        expiry: membership.subscription?.endDate,
        timestamp: now,
      });

      return apiResponse(true, undefined, populated as any, accessMessage);
    } catch (error) {
      const errorMessage = error.message || 'Invalid QR Code';
      console.error(
        `[AttendanceService] Check-in failed for gym ${gymId}, member ${memberId}:`,
        errorMessage,
      );

      // Always log denied attempts, even for invalid QR codes
      try {
        const deniedRecord = new this.attendanceModel({
          _id: new Types.ObjectId().toString(),
          gymId: new Types.ObjectId(gymId),
          userId: memberId ? new Types.ObjectId(memberId) : null,
          checkIn: now,
          status: 'denied' as AttendanceStatus,
          notes: errorMessage,
          createdAt: now,
        });
        await deniedRecord.save();
        console.log(
          `[AttendanceService] Logged denied attempt for gym ${gymId}`,
        );
      } catch (logError) {
        console.error('Failed to log denied attempt:', logError);
      }

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        // Emit real-time failure event
        this.notificationsGateway.sendToGym(gymId, 'access_attempt', {
          status: 'denied',
          reason: errorMessage,
          timestamp: now,
        });

        throw error;
      }

      // Emit real-time failure event for unknown errors too
      this.notificationsGateway.sendToGym(gymId, 'access_attempt', {
        status: 'denied',
        reason: errorMessage,
        timestamp: now,
      });

      throw new BadRequestException(errorMessage);
    }
  }

  async generateAccessToken(
    memberId: string,
    gymId: string,
  ): Promise<ApiResponse<{ token: string; expiresAt: number }>> {
    try {
      console.log(
        `[AttendanceService] Generating access token for member ${memberId}, gym ${gymId}`,
      );

      // 1. Validate user existence
      const user = await this.userModel.findById(memberId);
      if (!user) {
        throw new NotFoundException('Member not found');
      }

      // 2. Check for active membership at this gym
      const userObjectId = this.toObjectId(memberId);
      const gymObjectId = this.toObjectId(gymId);

      if (!userObjectId || !gymObjectId) {
        throw new BadRequestException('Invalid member or gym ID');
      }

      const membership = await this.membershipModel.findOne({
        user: userObjectId,
        gym: gymObjectId,
        membershipStatus: 'active',
      });

      if (!membership) {
        throw new BadRequestException(
          'No active membership found for this gym',
        );
      }

      // 3. Generate JWT token with 30-second expiration
      const payload = {
        memberId,
        gymId,
      };

      const token = this.jwtService.sign(payload, {
        expiresIn: '30s',
      });

      const expiresAt = Date.now() + 30000; // 30 seconds from now

      console.log(
        `[AttendanceService] Access token generated successfully for member ${memberId}`,
      );

      return apiResponse(
        true,
        undefined,
        { token, expiresAt },
        'Access token generated',
      );
    } catch (error) {
      console.error(
        `[AttendanceService] Failed to generate access token for member ${memberId}:`,
        error.message,
      );

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to generate access token');
    }
  }

  async getAttendanceLogs(
    gymId: string,
  ): Promise<ApiResponse<AttendanceRecordModel[]>> {
    try {
      console.log(`Fetching attendance logs for gym: ${gymId}`);

      // Convert gymId to ObjectId for proper querying
      const gymObjectId = new Types.ObjectId(gymId);

      const logs = await this.attendanceModel
        .find({ gymId: gymObjectId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('userId', 'profile.fullName profile.profileImageUrl')
        .lean();

      console.log(`Found ${logs.length} attendance records for gym ${gymId}`);

      return apiResponse(
        true,
        undefined,
        logs as any,
        'Attendance logs fetched',
      );
    } catch (error) {
      console.error('Error fetching attendance logs:', error);
      return apiResponse(false, 'Failed to fetch attendance logs', []);
    }
  }

  async getMyAttendance(
    userId: string,
  ): Promise<ApiResponse<AttendanceRecordModel[]>> {
    try {
      console.log(
        `[AttendanceService] Fetching attendance for user: ${userId}`,
      );

      const userObjectId = new Types.ObjectId(userId);

      const logs = await this.attendanceModel
        .find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .populate('gymId', 'name location.address location.city')
        .lean();

      console.log(`Found ${logs.length} attendance records for user ${userId}`);

      return apiResponse(
        true,
        undefined,
        logs as any,
        'Attendance history fetched',
      );
    } catch (error) {
      console.error('Error fetching user attendance:', error);
      return apiResponse(false, 'ATTENDANCE_FETCH_ERROR', []);
    }
  }

  async getMyAttendanceInGym(
    userId: string,
    gymId: string,
  ): Promise<ApiResponse<AttendanceRecordModel[]>> {
    try {
      console.log(
        `[AttendanceService] Fetching attendance for user: ${userId} in gym: ${gymId}`,
      );

      const userObjectId = new Types.ObjectId(userId);
      const gymObjectId = new Types.ObjectId(gymId);

      const logs = await this.attendanceModel
        .find({ userId: userObjectId, gymId: gymObjectId })
        .sort({ createdAt: -1 })
        .populate('gymId', 'name location.address location.city')
        .lean();

      console.log(
        `Found ${logs.length} attendance records for user ${userId} in gym ${gymId}`,
      );

      return apiResponse(
        true,
        undefined,
        logs as any,
        'Attendance history for gym fetched',
      );
    } catch (error) {
      console.error('Error fetching user attendance in gym:', error);
      return apiResponse(false, 'ATTENDANCE_FETCH_ERROR', []);
    }
  }
}
