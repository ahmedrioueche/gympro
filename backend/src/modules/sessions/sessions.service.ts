import {
  ApiResponse,
  ErrorCode,
  Session,
  SessionQueryDto,
  SessionStatus,
} from '@ahmedrioueche/gympro-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { GymCoachPaymentService } from '../gym-coach-payment/gym-coach-payment.service';
import {
  GymCoachPaymentCategory,
  GymCoachPaymentType,
} from '../gym-coach-payment/schemas/gym-coach-payment.schema';
import { GymCoachService } from '../gym-coach/gym-coach.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionModel } from './schemas/session.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(SessionModel.name) private sessionModel: Model<SessionModel>,
    @InjectModel(User.name) private userModel: Model<User>,
    private gymCoachService: GymCoachService,
    private paymentService: GymCoachPaymentService,
  ) {}

  async create(
    coachId: string,
    dto: CreateSessionDto,
  ): Promise<ApiResponse<Session>> {
    try {
      const member = await this.userModel.findById(dto.memberId);
      if (!member) {
        return {
          success: false,
          errorCode: ErrorCode.USER_NOT_FOUND,
          message: 'Member not found',
        };
      }

      if (dto.facilityId && dto.gymId) {
        const isValid = await this.gymCoachService.validateFacility(
          dto.gymId,
          dto.facilityId,
        );
        if (!isValid) {
          return {
            success: false,
            errorCode: ErrorCode.INVALID_REQUEST,
            message: 'Invalid facility selected',
          };
        }
      }

      const dates = this.generateRecurringDates(
        new Date(dto.startTime),
        dto.recurrence,
      );

      // Validate conflicts for all dates
      for (const date of dates) {
        const start = date;
        const end = new Date(start.getTime() + dto.duration * 60000);

        const conflict = await this.sessionModel.findOne({
          coachId,
          $or: [
            {
              startTime: { $lt: end },
              endTime: { $gt: start },
            },
          ],
          status: { $ne: SessionStatus.CANCELLED },
        });

        if (conflict) {
          return {
            success: false,
            errorCode: ErrorCode.SESSION_TIME_CONFLICT,
            message: `Time conflict on ${date.toLocaleDateString()}`,
          };
        }
      }

      const seriesId = new Types.ObjectId().toString();
      const sessionsToCreate = dates.map((date) => {
        const start = date;
        const end = new Date(start.getTime() + dto.duration * 60000);
        return {
          ...dto,
          coachId,
          startTime: start,
          endTime: end,
          seriesId: dates.length > 1 ? seriesId : undefined,
          status: SessionStatus.SCHEDULED,
        };
      });

      const createdSessions =
        await this.sessionModel.insertMany(sessionsToCreate);

      return {
        success: true,
        data: (createdSessions[0] as any).toObject(),
      };
    } catch (error) {
      console.error('Create session error:', error);
      return {
        success: false,
        errorCode: ErrorCode.SESSION_CREATE_ERROR,
        message: 'Failed to create session',
      };
    }
  }

  async findAll(
    query: SessionQueryDto,
    userId?: string,
    userRole?: string,
  ): Promise<ApiResponse<Session[]>> {
    try {
      const filter: any = {};

      if (query.coachId) filter.coachId = new Types.ObjectId(query.coachId);
      if (query.memberId) filter.memberId = new Types.ObjectId(query.memberId);
      if (query.status) filter.status = query.status;

      // Enforce Role-Based Access Control
      if (userId && userRole) {
        if (userRole === 'member') {
          // Members can ONLY see their own sessions
          filter.memberId = new Types.ObjectId(userId);
        } else if (userRole === 'coach') {
          // Coaches can ONLY see their own sessions
          filter.coachId = new Types.ObjectId(userId);
        }
      }

      // Date range filter
      if (query.startDate || query.endDate) {
        filter.startTime = {};
        if (query.startDate) filter.startTime.$gte = new Date(query.startDate);
        if (query.endDate) filter.startTime.$lte = new Date(query.endDate);
      }

      const sessions = await this.sessionModel
        .find(filter)
        .populate(
          'memberId',
          'profile.fullName profile.username profile.profileImageUrl',
        )
        .populate(
          'coachId',
          'profile.fullName profile.username profile.profileImageUrl',
        )
        .sort({ startTime: 1 })
        .lean();

      // Transform populated fields to match Session interface structure
      const mappedSessions = sessions.map((s: any) => ({
        ...s,
        _id: s._id.toString(),
        coachId: s.coachId._id.toString(),
        memberId: s.memberId._id.toString(),
        member: {
          _id: s.memberId._id.toString(),
          fullName: s.memberId.profile.fullName,
          username: s.memberId.profile.username,
          profileImageUrl: s.memberId.profile.profileImageUrl,
        },
        coach: {
          _id: s.coachId._id.toString(),
          fullName: s.coachId.profile.fullName,
          username: s.coachId.profile.username,
          profileImageUrl: s.coachId.profile.profileImageUrl,
        },
      }));

      return {
        success: true,
        data: mappedSessions,
      };
    } catch (error) {
      console.error('Find sessions error:', error);
      return {
        success: false,
        errorCode: ErrorCode.SESSION_FETCH_ERROR,
        message: 'Failed to fetch sessions',
      };
    }
  }

  async findOne(id: string): Promise<ApiResponse<Session>> {
    try {
      const session = await this.sessionModel
        .findById(id)
        .populate(
          'memberId',
          'profile.fullName profile.username profile.profileImageUrl',
        )
        .lean();

      if (!session) {
        throw new NotFoundException('Session not found');
      }

      return {
        success: true,
        data: session as any,
      };
    } catch (error) {
      return {
        success: false,
        errorCode: ErrorCode.NOT_FOUND,
        message: 'Session not found',
      };
    }
  }

  private generateRecurringDates(
    startDate: Date,
    recurrence: CreateSessionDto['recurrence'],
  ): Date[] {
    if (!recurrence || recurrence.type === 'none') return [startDate];

    const MAX_INSTANCES = 50; // Limit for personal sessions
    const dates: Date[] = [];

    let iterationDate = new Date(startDate);
    let endDate = recurrence.endDate ? new Date(recurrence.endDate) : null;

    if (!endDate) {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 2); // Default 2 months
    }

    const hours = startDate.getHours();
    const minutes = startDate.getMinutes();

    const isDayMatch = (date: Date) => {
      if (recurrence.type === 'custom' && recurrence.days) {
        return recurrence.days.includes(date.getDay());
      }
      return true;
    };

    while (dates.length < MAX_INSTANCES && iterationDate <= endDate) {
      if (isDayMatch(iterationDate)) {
        const dateToAdd = new Date(iterationDate);
        dateToAdd.setHours(hours, minutes, 0, 0);
        dates.push(dateToAdd);
      }

      if (recurrence.type === 'daily') {
        iterationDate.setDate(iterationDate.getDate() + 1);
      } else if (recurrence.type === 'weekly') {
        iterationDate.setDate(iterationDate.getDate() + 7);
      } else if (recurrence.type === 'biweekly') {
        iterationDate.setDate(iterationDate.getDate() + 14);
      } else if (recurrence.type === 'monthly') {
        iterationDate.setMonth(iterationDate.getMonth() + 1);
      } else if (recurrence.type === 'custom') {
        iterationDate.setDate(iterationDate.getDate() + 1);
      } else {
        break;
      }
    }

    return dates.length > 0 ? dates : [startDate];
  }

  async update(
    id: string,
    dto: UpdateSessionDto,
    userId: string,
    updateSeries = false,
  ): Promise<ApiResponse<Session>> {
    try {
      const session = await this.sessionModel.findById(id);
      if (!session) {
        return {
          success: false,
          errorCode: ErrorCode.NOT_FOUND,
          message: 'Session not found',
        };
      }

      if (
        session.coachId.toString() !== userId &&
        session.memberId.toString() !== userId
      ) {
        return {
          success: false,
          errorCode: ErrorCode.UNAUTHORIZED,
          message: 'Unauthorized',
        };
      }

      const updateData: any = { ...dto };
      if (dto.startTime || dto.duration) {
        const start = dto.startTime
          ? new Date(dto.startTime)
          : session.startTime;
        const duration = dto.duration || session.duration;
        const end = new Date(start.getTime() + duration * 60000);
        updateData.endTime = end;
      }

      if (updateSeries && session.seriesId) {
        // Update this and future sessions in series
        await this.sessionModel.updateMany(
          {
            seriesId: session.seriesId,
            startTime: { $gte: session.startTime },
          },
          updateData,
        );
        const updated = await this.sessionModel.findById(id);
        return { success: true, data: updated?.toObject() };
      }

      const updated = await this.sessionModel.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
        },
      );

      // Handle commission logic if status changed to COMPLETED
      if (
        dto.status === SessionStatus.COMPLETED &&
        session.status !== SessionStatus.COMPLETED &&
        session.gymId &&
        session.price &&
        session.price > 0
      ) {
        const affiliation = await this.gymCoachService.findAffiliation(
          session.gymId,
          session.coachId,
        );

        if (affiliation && affiliation.commissionRate) {
          const commissionAmount =
            session.price * (affiliation.commissionRate / 100);

          await this.paymentService.create({
            gymId: session.gymId,
            coachId: session.coachId,
            amount: commissionAmount,
            currency: session.currency || 'USD',
            type: GymCoachPaymentType.EARNING,
            category: GymCoachPaymentCategory.SESSION_COMMISSION,
            referenceId: session._id,
            referenceType: 'Session',
            description: `Commission for session with member ${session.memberId}`,
            metadata: {
              commissionRateSnapshot: affiliation.commissionRate,
              originalServicePrice: session.price,
            },
          });
        }
      }

      return {
        success: true,
        data: updated?.toObject(),
      };
    } catch (error) {
      console.error('Update session error:', error);
      return {
        success: false,
        errorCode: ErrorCode.SESSION_UPDATE_ERROR,
        message: 'Failed to update session',
      };
    }
  }

  async remove(
    id: string,
    userId: string,
    deleteSeries = false,
  ): Promise<ApiResponse<void>> {
    try {
      const session = await this.sessionModel.findById(id);
      if (!session) {
        return {
          success: false,
          errorCode: ErrorCode.NOT_FOUND,
          message: 'Session not found',
        };
      }

      // Both coach and member can cancel/remove their sessions
      if (
        session.coachId.toString() !== userId &&
        session.memberId.toString() !== userId
      ) {
        return {
          success: false,
          errorCode: ErrorCode.UNAUTHORIZED,
          message: 'Unauthorized',
        };
      }

      if (deleteSeries && session.seriesId) {
        await this.sessionModel.deleteMany({ seriesId: session.seriesId });
      } else {
        await this.sessionModel.findByIdAndDelete(id);
      }
      return { success: true };
    } catch (error) {
      console.error('Delete session error:', error);
      return {
        success: false,
        errorCode: ErrorCode.SESSION_DELETE_ERROR,
        message: 'Failed to delete session',
      };
    }
  }
  async countSessions(
    coachId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const query: any = { coachId: new Types.ObjectId(coachId) };

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = startDate;
      if (endDate) query.startTime.$lte = endDate;
    }

    return this.sessionModel.countDocuments(query);
  }

  async findRecent(coachId: string, limit: number): Promise<Session[]> {
    return this.sessionModel
      .find({ coachId: new Types.ObjectId(coachId), status: 'completed' })
      .populate('memberId', 'profile.fullName')
      .sort({ startTime: -1 })
      .limit(limit)
      .lean();
  }
}
