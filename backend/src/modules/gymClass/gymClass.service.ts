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
import { GymService } from '../gym/gym.service';
import { MembershipService } from '../gymMembership/membership.service';
import { SubscriptionTypeModel } from '../gymSubscription/gymSubscription.schema';
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
    @InjectModel(SubscriptionTypeModel.name)
    private subscriptionTypeModel: Model<SubscriptionTypeModel>,
    private notificationsService: NotificationsService,
    private membershipService: MembershipService,
    private gymService: GymService,
  ) {}

  async create(
    gymId: string,
    dto: CreateGymClassDto,
    createdBy: string,
  ): Promise<ApiResponse<GymClass>> {
    try {
      if (dto.facilityId) {
        const isValid = await this.gymService.validateFacility(
          gymId,
          dto.facilityId,
        );
        if (!isValid) {
          throw new Error('Invalid facility selected for this gym');
        }
      }

      const baseData = { ...dto };
      if (!baseData.coachId) delete baseData.coachId;

      // Determine recurrence dates
      const dates = this.generateRecurringDates(
        new Date(dto.scheduledAt),
        dto.recurrence,
      );

      // Validate coach availability for ALL dates first using batch approach
      if (dto.coachId) {
        const rangeStart = dates[0];
        const rangeEnd = new Date(
          dates[dates.length - 1].getTime() + dto.duration * 60000,
        );

        const [conflictingSessions, existingClasses] = await Promise.all([
          this.sessionModel
            .find({
              coachId: new Types.ObjectId(dto.coachId),
              startTime: { $lt: rangeEnd },
              endTime: { $gt: rangeStart },
              status: { $ne: 'cancelled' },
            })
            .lean(),
          this.gymClassModel
            .find({
              coachId: new Types.ObjectId(dto.coachId),
              scheduledAt: {
                $gte: new Date(rangeStart.getTime() - 4 * 60 * 60 * 1000),
                $lte: new Date(rangeEnd.getTime() + 4 * 60 * 60 * 1000),
              },
              status: { $ne: 'cancelled' },
            })
            .lean(),
        ]);

        for (const date of dates) {
          const start = date;
          const end = new Date(start.getTime() + dto.duration * 60000);

          // Check sessions
          const sessionConflict = conflictingSessions.find(
            (s) => new Date(s.startTime) < end && new Date(s.endTime) > start,
          );
          if (sessionConflict) {
            throw new Error(
              `Conflict on ${date.toLocaleDateString()}: Coach has a conflicting session`,
            );
          }

          // Check classes
          const classConflict = existingClasses.find((c) => {
            const clsStart = new Date(c.scheduledAt);
            const clsEnd = new Date(clsStart.getTime() + c.duration * 60000);
            return clsStart < end && clsEnd > start;
          });
          if (classConflict) {
            throw new Error(
              `Conflict on ${date.toLocaleDateString()}: Coach has another class at this time`,
            );
          }
        }
      }

      const seriesId = new Types.ObjectId().toString();
      const classesToCreate = dates.map((date) => ({
        ...baseData,
        gymId,
        createdBy,
        scheduledAt: date,
        seriesId: dates.length > 1 ? seriesId : undefined,
        recurrence: dates.length > 1 ? dto.recurrence : undefined,
        status: 'active',
      }));

      const createdClasses =
        await this.gymClassModel.insertMany(classesToCreate);

      if (dto.coachId && createdClasses.length > 0) {
        await this.notifyCoach(
          dto.coachId,
          createdClasses[0] as any,
          'assigned',
        );
      }

      return {
        success: true,
        data: (createdClasses[0] as any).toObject
          ? (createdClasses[0] as any).toObject()
          : createdClasses[0],
      };
    } catch (error) {
      console.error('Create class error:', error);
      if (error.message.includes('Conflict on')) {
        return {
          success: false,
          errorCode: ErrorCode.COACH_NOT_AVAILABLE,
          message: error.message,
        };
      }
      return {
        success: false,
        errorCode: ErrorCode.CLASS_CREATE_ERROR,
        message: 'Failed to create class',
      };
    }
  }

  private generateRecurringDates(
    startDate: Date,
    recurrence: CreateGymClassDto['recurrence'],
  ): Date[] {
    if (!recurrence || recurrence.type === 'none') return [startDate];

    const MAX_INSTANCES = 100;
    const dates: Date[] = [];

    let iterationDate = new Date(startDate);
    let endDate = recurrence.endDate ? new Date(recurrence.endDate) : null;

    if (!endDate) {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 3);
    }

    const hours = startDate.getHours();
    const minutes = startDate.getMinutes();

    const isDayMatch = (date: Date) => {
      if (recurrence.type === 'custom' && recurrence.days) {
        return recurrence.days.includes(date.getDay());
      }
      return true; // For daily, weekly, biweekly, monthly - logic handled by iteration
    };

    // For custom recurrence, ensure we start on a valid day
    if (recurrence.type === 'custom' && !isDayMatch(iterationDate)) {
      for (let i = 0; i < 7; i++) {
        iterationDate.setDate(iterationDate.getDate() + 1);
        if (isDayMatch(iterationDate)) break;
      }
    }

    while (dates.length < MAX_INSTANCES && iterationDate <= endDate) {
      if (isDayMatch(iterationDate)) {
        const dateToAdd = new Date(iterationDate);
        dateToAdd.setHours(hours, minutes, 0, 0);
        dates.push(dateToAdd);
      }

      // Increment
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

    // Fallback to start date if something went wrong
    return dates.length > 0 ? dates : [startDate];
  }

  async update(
    id: string,
    dto: UpdateGymClassDto,
    updatedBy: string,
    updateSeries = false,
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

      // Prepare update data
      const updateData = { ...dto, updatedBy };
      if (updateData.coachId === '') delete (updateData as any).coachId;

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

      if (dto.facilityId) {
        const isValid = await this.gymService.validateFacility(
          existingClass.gymId,
          dto.facilityId,
        );
        if (!isValid) {
          throw new Error('Invalid facility selected for this gym');
        }
      }

      let gymClass: GymClassModel | null;

      if (updateSeries && existingClass.seriesId) {
        // Update all upcoming classes in series
        // We exclude scheduledAt from series update to avoid squashing everything into one date
        const seriesUpdateData = { ...updateData };
        delete seriesUpdateData.scheduledAt;

        await this.gymClassModel.updateMany(
          {
            seriesId: existingClass.seriesId,
            scheduledAt: { $gte: existingClass.scheduledAt },
          },
          seriesUpdateData,
        );

        // If time changed, we'd need more complex logic to shift dates.
        // For now, if scheduledAt is provided, only update the current instance's full date
        // and other instances get only non-date fields updated.
        gymClass = await this.gymClassModel.findByIdAndUpdate(id, updateData, {
          new: true,
        });
      } else {
        gymClass = await this.gymClassModel.findByIdAndUpdate(id, updateData, {
          new: true,
        });
      }

      if (dto.coachId && dto.coachId !== existingClass.coachId) {
        await this.notifyCoach(dto.coachId, gymClass as any, 'assigned');
      }

      return {
        success: true,
        data: gymClass?.toObject() as GymClass,
      };
    } catch (error) {
      console.error('Update class error:', error);
      if (error?.message?.includes('Coach is not available')) {
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

  async remove(id: string, deleteSeries = false): Promise<ApiResponse<void>> {
    try {
      const gymClass = await this.gymClassModel.findById(id);
      if (!gymClass) {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_NOT_FOUND,
          message: 'Class not found',
        };
      }

      if (deleteSeries && gymClass.seriesId) {
        await this.gymClassModel.updateMany(
          { seriesId: gymClass.seriesId },
          { status: 'cancelled' },
        );
      } else {
        await this.gymClassModel.findByIdAndUpdate(id, {
          status: 'cancelled',
        });
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
        .find({ gymId, status: { $ne: 'cancelled' } })
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
      let queryId: any = coachId;
      if (Types.ObjectId.isValid(coachId)) {
        queryId = new Types.ObjectId(coachId);
      }

      const classes = await this.gymClassModel
        .find({
          $or: [{ coachId: queryId }, { coachId: coachId }],
          status: { $ne: 'cancelled' },
        })
        .populate('gymId', 'name')
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
      if (!gymClass || gymClass.status === 'cancelled') {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_NOT_FOUND,
          message: 'Class not found or cancelled',
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

      // 1. Check if class time has passed
      if (new Date(gymClass.scheduledAt) < new Date()) {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_ALREADY_PASSED,
          message: 'Cannot book a class that has already started or passed',
        };
      }

      // 2. Check capacity
      if (gymClass.bookings.length >= gymClass.maxCapacity) {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_FULL,
          message: 'Class is full',
        };
      }

      // 3. Check membership and plan access
      const { membership } = await this.membershipService.getMyMembershipInGym(
        userId,
        gymClass.gymId,
      );

      if (!membership || membership.membershipStatus !== 'active') {
        return {
          success: false,
          errorCode: ErrorCode.NO_ACTIVE_SUBSCRIPTION,
          message: 'You need an active membership to book this class',
        };
      }

      // 4. Check plan access to this service
      if (membership.subscription?.typeId) {
        const subType = await this.subscriptionTypeModel
          .findById(membership.subscription.typeId)
          .lean();

        if (subType && subType.services && subType.services.length > 0) {
          // Normalize service names for comparison
          const allowedServices = subType.services.map((s) =>
            s.toLowerCase().trim(),
          );
          const classService = gymClass.service.toLowerCase().trim();

          if (!allowedServices.includes(classService)) {
            return {
              success: false,
              errorCode: ErrorCode.PLAN_ACCESS_DENIED,
              message: `Your current plan does not include access to ${gymClass.service} classes.`,
            };
          }
        }
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

    // 1. Check for conflicting sessions
    const conflictingSession = await this.sessionModel.findOne({
      coachId: new Types.ObjectId(coachId),
      startTime: { $lt: end },
      endTime: { $gt: start },
      status: { $ne: 'cancelled' },
    });

    if (conflictingSession) {
      throw new Error('Coach has a conflicting session');
    }

    // 2. Check for conflicting classes (logical check)
    // Fetch classes in a window of +/- 4 hours to check overlaps
    const windowStart = new Date(start.getTime() - 4 * 60 * 60 * 1000);
    const windowEnd = new Date(start.getTime() + 4 * 60 * 60 * 1000);

    const nearbyClasses = await this.gymClassModel.find({
      coachId: new Types.ObjectId(coachId),
      _id: { $ne: excludeClassId },
      scheduledAt: { $gte: windowStart, $lte: windowEnd },
      status: { $ne: 'cancelled' },
    });

    for (const cls of nearbyClasses) {
      const clsStart = new Date(cls.scheduledAt as Date);
      const clsEnd = new Date(clsStart.getTime() + cls.duration * 60000);

      if (clsStart < end && clsEnd > start) {
        throw new Error('Coach has another class at this time');
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
