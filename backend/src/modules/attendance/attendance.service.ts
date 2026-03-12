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
import { GymMembershipModel } from '../gym-membership/membership.schema';
import { GymModel } from '../gym/gym.schema';
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

  async checkInByPin(
    gymId: string,
    pin: string,
  ): Promise<ApiResponse<AttendanceRecordModel>> {
    const gymObjectId = this.toObjectId(gymId);
    if (!gymObjectId) throw new BadRequestException('Invalid gym ID');

    const membership = await this.membershipModel.findOne({
      gym: gymObjectId,
      'accessData.pinCode': pin,
      membershipStatus: 'active',
    });

    if (!membership) {
      throw new BadRequestException('Invalid PIN or no active membership found');
    }

    return this.processCheckIn(membership, gymId);
  }

  async checkInByRfid(
    gymId: string,
    rfidId: string,
  ): Promise<ApiResponse<AttendanceRecordModel>> {
    const gymObjectId = this.toObjectId(gymId);
    if (!gymObjectId) throw new BadRequestException('Invalid gym ID');

    const membership = await this.membershipModel.findOne({
      gym: gymObjectId,
      'accessData.rfidId': rfidId,
      membershipStatus: 'active',
    });

    if (!membership) {
      throw new BadRequestException(
        'Invalid RFID card or no active membership found',
      );
    }

    return this.processCheckIn(membership, gymId);
  }

  async checkIn(
    token: string,
    gymId: string,
  ): Promise<ApiResponse<AttendanceRecordModel>> {
    console.log(`[AttendanceService] Check-in attempt for gym: ${gymId}`);
    let memberId: string | undefined;

    try {
      // 1. Verify and decode the access token
      let decoded: any;
      try {
        decoded = this.jwtService.verify(token);
        memberId = decoded.memberId;
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          const payload = this.jwtService.decode(token);
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

      // 3. Find membership
      const userObjectId = this.toObjectId(memberId);
      const gymObjectId = this.toObjectId(gymId);

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

      return this.processCheckIn(membership, gymId);
    } catch (error) {
      return this.logAndEmitFailure(gymId, memberId, error.message);
    }
  }

  private async processCheckIn(
    membership: GymMembershipModel,
    gymId: string,
  ): Promise<ApiResponse<AttendanceRecordModel>> {
    const now = new Date();
    const gymObjectId = this.toObjectId(gymId);
    const userObjectId = membership.user;

    try {
      // 1. Fetch Gym for settings
      const gym = await this.gymModel.findById(gymId);
      const accessControlType = gym?.settings?.accessControlType ?? 'flexible';

      // 2. Check subscription expiry
      const isExpired =
        membership.subscription?.endDate &&
        new Date(membership.subscription.endDate) < now;

      let isLimitReached = false;
      let limitMessage = '';

      // 3. Check allowedDaysPerWeek limit
      if (
        !isExpired &&
        membership.subscription?.typeDetails?.allowedDaysPerWeek
      ) {
        const allowedDays =
          membership.subscription.typeDetails.allowedDaysPerWeek;
        if (allowedDays > 0 && allowedDays < 7) {
          const startOfWeek = new Date(now);
          const day = startOfWeek.getDay() || 7;
          if (day !== 1) startOfWeek.setHours(-24 * (day - 1));
          startOfWeek.setHours(0, 0, 0, 0);

          const weeklyAttendances = await this.attendanceModel.find({
            userId: userObjectId,
            gymId: gymObjectId,
            status: 'checked_in',
            checkIn: { $gte: startOfWeek },
          });

          const uniqueDays = new Set(
            weeklyAttendances.map((a) => {
              const d = new Date(a.checkIn);
              return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            }),
          );

          const todayDateString = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
          const isTodayAlreadyCounted = uniqueDays.has(todayDateString);

          if (uniqueDays.size >= allowedDays && !isTodayAlreadyCounted) {
            isLimitReached = true;
            limitMessage = `Weekly limit reached (${allowedDays} days/week).`;
          }
        }
      }

      let accessMessage = 'Check-in successful';
      if (isExpired) {
        accessMessage = 'Subscription expired. Please renew.';
      } else if (isLimitReached) {
        accessMessage = limitMessage;
      }

      const isDenied =
        (isExpired && accessControlType === 'strict') || isLimitReached;

      // 4. Create attendance record
      const attendance = new this.attendanceModel({
        _id: new Types.ObjectId().toString(),
        gymId: gymObjectId,
        userId: userObjectId,
        checkIn: now,
        status: isDenied
          ? ('denied' as AttendanceStatus)
          : ('checked_in' as AttendanceStatus),
        notes: isDenied ? accessMessage : undefined,
        expiryDate: membership.subscription?.endDate,
        createdAt: now,
      });

      await attendance.save();

      const populated = await this.attendanceModel
        .findById(attendance._id)
        .populate('userId', 'profile.fullName profile.profileImageUrl');

      // 5. Emit real-time event
      const status = attendance.status === 'checked_in' ? 'granted' : 'denied';
      this.notificationsGateway.sendToGym(gymId, 'access_attempt', {
        status,
        name: (populated as any).userId?.profile?.fullName || 'Member',
        photo: (populated as any).userId?.profile?.profileImageUrl,
        reason: attendance.status === 'denied' ? accessMessage : undefined,
        expiry: membership.subscription?.endDate,
        timestamp: now,
      });

      return apiResponse(
        attendance.status === 'checked_in',
        attendance.status === 'checked_in' ? undefined : 'ACCESS_DENIED',
        populated as any,
        accessMessage,
      );
    } catch (error) {
      return this.logAndEmitFailure(gymId, userObjectId.toString(), error.message);
    }
  }

  private async logAndEmitFailure(
    gymId: string,
    memberId: string | undefined,
    errorMessage: string,
  ): Promise<ApiResponse<AttendanceRecordModel>> {
    const now = new Date();
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
    } catch (logError) {
      console.error('Failed to log denied attempt:', logError);
    }

    this.notificationsGateway.sendToGym(gymId, 'access_attempt', {
      status: 'denied',
      reason: errorMessage,
      timestamp: now,
    });

    throw new BadRequestException(errorMessage);
  }

  async generateAccessToken(
    memberId: string,
    gymId: string,
  ): Promise<ApiResponse<{ token: string; expiresAt: number }>> {
    try {
      const user = await this.userModel.findById(memberId);
      if (!user) throw new NotFoundException('Member not found');

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
        throw new BadRequestException('No active membership found for this gym');
      }

      const payload = { memberId, gymId };
      const token = this.jwtService.sign(payload, { expiresIn: '30s' });
      const expiresAt = Date.now() + 30000;

      return apiResponse(true, undefined, { token, expiresAt }, 'Access token generated');
    } catch (error) {
      throw error instanceof BadRequestException || error instanceof NotFoundException
        ? error
        : new BadRequestException('Failed to generate access token');
    }
  }

  async getAttendanceLogs(
    gymId: string,
  ): Promise<ApiResponse<AttendanceRecordModel[]>> {
    try {
      const gymObjectId = new Types.ObjectId(gymId);
      const logs = await this.attendanceModel
        .find({ gymId: gymObjectId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('userId', 'profile.fullName profile.profileImageUrl')
        .lean();

      return apiResponse(true, undefined, logs as any, 'Attendance logs fetched');
    } catch (error) {
      return apiResponse(false, 'Failed to fetch attendance logs', []);
    }
  }

  async getMyAttendance(
    userId: string,
  ): Promise<ApiResponse<AttendanceRecordModel[]>> {
    try {
      const userObjectId = new Types.ObjectId(userId);
      const logs = await this.attendanceModel
        .find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .populate('gymId', 'name location.address location.city')
        .lean();

      return apiResponse(true, undefined, logs as any, 'Attendance history fetched');
    } catch (error) {
      return apiResponse(false, 'ATTENDANCE_FETCH_ERROR', []);
    }
  }

  async getMyAttendanceInGym(
    userId: string,
    gymId: string,
  ): Promise<ApiResponse<AttendanceRecordModel[]>> {
    try {
      const userObjectId = new Types.ObjectId(userId);
      const gymObjectId = new Types.ObjectId(gymId);
      const logs = await this.attendanceModel
        .find({ userId: userObjectId, gymId: gymObjectId })
        .sort({ createdAt: -1 })
        .populate('gymId', 'name location.address location.city')
        .lean();

      return apiResponse(true, undefined, logs as any, 'Attendance history for gym fetched');
    } catch (error) {
      return apiResponse(false, 'ATTENDANCE_FETCH_ERROR', []);
    }
  }
}
