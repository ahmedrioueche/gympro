import {
  ApiResponse,
  CreateClassBookingDto,
  CreateGymClassDto,
  ErrorCode,
  GymClass,
  UpdateGymClassDto,
} from '@ahmedrioueche/gympro-client';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { SessionModel } from '../sessions/schemas/session.schema';
import { GymClassModel } from './gymClass.schema';

@Injectable()
export class GymClassService {
  constructor(
    @InjectModel(GymClassModel.name)
    private gymClassModel: Model<GymClassModel>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(SessionModel.name) private sessionModel: Model<SessionModel>,
    private notificationsService: NotificationsService,
  ) {}

  async create(
    gymId: string,
    dto: CreateGymClassDto,
    createdBy: string,
  ): Promise<ApiResponse<GymClass>> {
    try {
      if (dto.coachId) {
        await this.validateCoachAvailability(
          dto.coachId,
          new Date(dto.scheduledAt),
          dto.duration,
        );
      }

      const gymClass = await this.gymClassModel.create({
        ...dto,
        gymId,
        createdBy,
      });

      if (dto.coachId) {
        await this.notifyCoach(dto.coachId, gymClass, 'assigned');
      }

      return {
        success: true,
        data: gymClass.toObject() as GymClass,
      };
    } catch (error) {
      if (error.message.includes('Coach is not available')) {
        return {
          success: false,
          errorCode: ErrorCode.COACH_NOT_AVAILABLE,
          message: error.message,
        };
      }
      console.error('Create class error:', error);
      return {
        success: false,
        errorCode: ErrorCode.CLASS_CREATE_ERROR,
        message: 'Failed to create class',
      };
    }
  }

  async update(
    id: string,
    dto: UpdateGymClassDto,
    updatedBy: string,
  ): Promise<ApiResponse<GymClass>> {
    try {
      const existingClass = await this.gymClassModel.findById(id);
      if (!existingClass) {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_NOT_FOUND,
          message: 'Class not found',
        };
      }

      if (
        (dto.coachId && dto.coachId !== existingClass.coachId) ||
        dto.scheduledAt ||
        dto.duration
      ) {
        const coachId = dto.coachId || existingClass.coachId;
        const scheduledAt = dto.scheduledAt
          ? new Date(dto.scheduledAt)
          : new Date(existingClass.scheduledAt);
        const duration = dto.duration || existingClass.duration;

        if (coachId) {
          await this.validateCoachAvailability(
            coachId,
            scheduledAt,
            duration,
            id,
          );
        }
      }

      const gymClass = await this.gymClassModel.findByIdAndUpdate(
        id,
        { ...dto, updatedBy },
        { new: true },
      );

      if (dto.coachId && dto.coachId !== existingClass.coachId) {
        await this.notifyCoach(dto.coachId, gymClass as any, 'assigned');
      }

      return {
        success: true,
        data: gymClass?.toObject() as GymClass,
      };
    } catch (error) {
      console.error('Update class error:', error);
      if (error.message.includes('Coach is not available')) {
        return {
          success: false,
          errorCode: ErrorCode.COACH_NOT_AVAILABLE,
          message: error.message,
        };
      }
      return {
        success: false,
        errorCode: ErrorCode.CLASS_UPDATE_ERROR,
        message: 'Failed to update class',
      };
    }
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    try {
      const result = await this.gymClassModel.findByIdAndDelete(id);
      if (!result) {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_NOT_FOUND,
          message: 'Class not found',
        };
      }
      return { success: true };
    } catch (error) {
      console.error('Delete class error:', error);
      return {
        success: false,
        errorCode: ErrorCode.CLASS_DELETE_ERROR,
        message: 'Failed to delete class',
      };
    }
  }

  async findAllByGym(gymId: string): Promise<ApiResponse<GymClass[]>> {
    try {
      const classes = await this.gymClassModel
        .find({ gymId })
        .populate(
          'coachId',
          'profile.fullName profile.username profile.profileImageUrl',
        )
        .sort({ scheduledAt: 1 })
        .lean();

      return {
        success: true,
        data: classes as unknown as GymClass[],
      };
    } catch (error) {
      return {
        success: false,
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch classes',
      };
    }
  }

  async findAllByCoach(coachId: string): Promise<ApiResponse<GymClass[]>> {
    try {
      console.log(`[GymClassService] Finding classes for coach: ${coachId}`);
      const classes = await this.gymClassModel
        .find({ coachId: new Types.ObjectId(coachId) })
        .populate('gymId', 'name') // minimal populate for identification
        .sort({ scheduledAt: 1 })
        .lean();

      console.log(
        `[GymClassService] Found ${classes.length} classes for coach ${coachId}`,
      );

      return {
        success: true,
        data: classes as unknown as GymClass[],
      };
    } catch (error) {
      return {
        success: false,
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch coach classes',
      };
    }
  }

  async findOne(id: string): Promise<ApiResponse<GymClass>> {
    try {
      const gymClass = await this.gymClassModel
        .findById(id)
        .populate(
          'coachId',
          'profile.fullName profile.username profile.profileImageUrl',
        )
        .lean();

      if (!gymClass) {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_NOT_FOUND,
          message: 'Class not found',
        };
      }

      return {
        success: true,
        data: gymClass as unknown as GymClass,
      };
    } catch (error) {
      return {
        success: false,
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch class',
      };
    }
  }

  async book(
    userId: string,
    dto: CreateClassBookingDto,
  ): Promise<ApiResponse<GymClass>> {
    try {
      const gymClass = await this.gymClassModel.findById(dto.classId);
      if (!gymClass) {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_NOT_FOUND,
          message: 'Class not found',
        };
      }

      // Check if already booked
      const alreadyBooked = gymClass.bookings.some(
        (b) => b.userId.toString() === userId,
      );
      if (alreadyBooked) {
        return {
          success: false,
          errorCode: ErrorCode.ALREADY_BOOKED,
          message: 'You have already booked this class',
        };
      }

      // Check capacity
      if (gymClass.bookings.length >= gymClass.maxCapacity) {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_FULL,
          message: 'Class is full',
        };
      }

      // Add booking
      gymClass.bookings.push({
        _id: new Types.ObjectId().toString(),
        classId: dto.classId,
        userId,
        status: 'booked',
        bookedAt: new Date(),
        createdAt: new Date(),
      });

      await gymClass.save();

      return {
        success: true,
        data: gymClass.toObject() as GymClass,
      };
    } catch (error) {
      console.error('Book class error:', error);
      return {
        success: false,
        errorCode: ErrorCode.BOOKING_ERROR,
        message: 'Failed to book class',
      };
    }
  }

  async cancelBooking(
    userId: string,
    classId: string,
  ): Promise<ApiResponse<GymClass>> {
    try {
      const gymClass = await this.gymClassModel.findById(classId);
      if (!gymClass) {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_NOT_FOUND,
          message: 'Class not found',
        };
      }

      const bookingIndex = gymClass.bookings.findIndex(
        (b) => b.userId.toString() === userId,
      );
      if (bookingIndex === -1) {
        return {
          success: false,
          errorCode: ErrorCode.NOT_FOUND,
          message: 'Booking not found',
        };
      }

      gymClass.bookings.splice(bookingIndex, 1);
      await gymClass.save();

      return {
        success: true,
        data: gymClass.toObject() as GymClass,
      };
    } catch (error) {
      console.error('Cancel booking error:', error);
      return {
        success: false,
        errorCode: ErrorCode.BOOKING_ERROR,
        message: 'Failed to cancel booking',
      };
    }
  }

  private async validateCoachAvailability(
    coachId: string,
    start: Date,
    duration: number,
    excludeClassId?: string,
  ): Promise<void> {
    const end = new Date(start.getTime() + duration * 60000);

    // Check for conflicting sessions
    const conflictingSession = await this.sessionModel.findOne({
      coachId: new Types.ObjectId(coachId),
      startTime: { $lt: end },
      endTime: { $gt: start },
      status: { $ne: 'cancelled' },
    });

    if (conflictingSession) {
      throw new Error(
        'Coach is not available at this time (Conflicting Session)',
      );
    }

    // Check for conflicting classes
    const conflictingClass = await this.gymClassModel.findOne({
      coachId: new Types.ObjectId(coachId),
      _id: { $ne: excludeClassId },
      $or: [
        {
          scheduledAt: { $lt: end },
          // We can't query end time directly as it's computed, but we can check start time proximity
          // A safer check is to fetch potentially conflicting classes and filter in code or use aggregation
          // For simplicity, let's assume classes are max 3 hours long and query a window
        },
      ],
    });

    // More robust check for class conflicts
    // Since we store duration, we need to find classes where:
    // (existingStart < newEnd) AND (existingEnd > newStart)
    // existingEnd = existingStart + existingDuration
    // This is hard to do in a simple find query without aggregation.
    // Let's fetch classes in a window of +/- 4 hours to be safe
    const windowStart = new Date(start.getTime() - 4 * 60 * 60 * 1000);
    const windowEnd = new Date(start.getTime() + 4 * 60 * 60 * 1000);

    const nearbyClasses = await this.gymClassModel.find({
      coachId: new Types.ObjectId(coachId),
      _id: { $ne: excludeClassId },
      scheduledAt: { $gte: windowStart, $lte: windowEnd },
    });

    for (const cls of nearbyClasses) {
      const clsStart = new Date(cls.scheduledAt as Date);
      const clsEnd = new Date(clsStart.getTime() + cls.duration * 60000);

      if (clsStart < end && clsEnd > start) {
        throw new Error(
          'Coach is not available at this time (Conflicting Class)',
        );
      }
    }
  }

  private async notifyCoach(
    coachId: string,
    gymClass: GymClassModel,
    type: 'assigned' | 'updated',
  ) {
    try {
      const coach = await this.userModel.findById(coachId);
      if (!coach) return;

      const date = new Date(gymClass.scheduledAt).toLocaleDateString();
      const time = new Date(gymClass.scheduledAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      await this.notificationsService.notifyUser(coach, {
        key: `class.${type}`,
        vars: {
          className: gymClass.name,
          date,
          time,
        },
        type: 'alert',
        priority: 'high',
        gymId: gymClass.gymId,
        action: {
          type: 'link',
          payload: '/gym/coach/schedule',
          label: 'View Schedule',
        },
      });
    } catch (error) {
      console.error('Failed to notify coach:', error);
    }
  }
}
