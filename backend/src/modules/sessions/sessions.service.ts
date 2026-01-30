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
    createSessionDto: CreateSessionDto,
  ): Promise<ApiResponse<Session>> {
    try {
      // Validate member exists and has this coach (optional strict check)
      const member = await this.userModel.findById(createSessionDto.memberId);
      if (!member) {
        return {
          success: false,
          errorCode: ErrorCode.USER_NOT_FOUND,
          message: 'Member not found',
        };
      }

      // Check for conflicts (simple check)
      const conflict = await this.sessionModel.findOne({
        coachId,
        $or: [
          {
            startTime: { $lt: createSessionDto.endTime },
            endTime: { $gt: createSessionDto.startTime },
          },
        ],
        status: { $ne: 'cancelled' },
      });

      if (conflict) {
        return {
          success: false,
          errorCode: ErrorCode.SESSION_TIME_CONFLICT,
          message: 'Time slot overlaps with an existing session',
        };
      }

      // Fetch affiliation to determine price/gymId if applicable
      // Note: Assuming logic to determine price exists or is passed in DTO.
      // For now, we rely on DTO or default.
      // If gymId is not in DTO, we might try to infer it. (Skipping for now).

      const session = await this.sessionModel.create({
        ...createSessionDto,
        coachId,
      });

      return {
        success: true,
        data: session.toObject(),
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
        // Admins/Managers (if any) might see all, or handled via different logic.
        // Assuming loose filtering for others or implicit trust if role not matched above.
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

      // Transform populated fields to match Session interface structure if needed,
      // or rely on frontend to handle "memberId" as object.
      // The Session interface has member?: {...} which implies we should map it
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
        data: session as any, // Cast for simplicity, ideal to map
      };
    } catch (error) {
      return {
        success: false,
        errorCode: ErrorCode.NOT_FOUND,
        message: 'Session not found',
      };
    }
  }

  async update(
    id: string,
    updateSessionDto: UpdateSessionDto,
    userId: string, // Check ownership
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

      // Verify ownership (coach or member involved)
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

      const originalStatus = session.status;
      const newStatus = updateSessionDto.status;

      // Update fields
      Object.keys(updateSessionDto).forEach((key) => {
        if (updateSessionDto[key] !== undefined) {
          session[key] = updateSessionDto[key];
        }
      });
      await session.save();

      // Trigger: If status changed to COMPLETED
      // session.gymId needs to be present. If not, we can try to look it up if needed,
      // but for now we assume it's set on creation or update.
      // If we enable "free floating" sessions to be linked to a gym later, we'd need that logic.
      if (
        newStatus === SessionStatus.COMPLETED &&
        originalStatus !== SessionStatus.COMPLETED &&
        session.gymId &&
        session.price &&
        session.price > 0
      ) {
        // Calculate Commission
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
            description: `Commission for session with member ${session.memberId}`, // optimize later with names
            metadata: {
              commissionRateSnapshot: affiliation.commissionRate,
              originalServicePrice: session.price,
            },
          });
        }
      }

      return {
        success: true,
        data: session.toObject(),
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

  async remove(id: string, userId: string): Promise<ApiResponse<void>> {
    try {
      const session = await this.sessionModel.findById(id);
      if (!session) {
        return {
          success: false,
          errorCode: ErrorCode.NOT_FOUND,
          message: 'Session not found',
        };
      }

      // Verify ownership
      if (session.coachId.toString() !== userId) {
        return {
          success: false,
          errorCode: ErrorCode.UNAUTHORIZED,
          message: 'Unauthorized',
        };
      }

      await this.sessionModel.findByIdAndDelete(id);
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
