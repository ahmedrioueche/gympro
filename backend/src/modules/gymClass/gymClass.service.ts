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

      const isRecurring = dto.recurrence && dto.recurrence.type !== 'none';
      const seriesId = isRecurring
        ? new Types.ObjectId().toString()
        : undefined;

      // Validate availability for the INITIAL date
      await this.validateAvailability(
        dto.coachId,
        dto.facilityId,
        new Date(dto.scheduledAt),
        dto.duration,
        undefined,
        seriesId,
      );

      const createdClass = await this.gymClassModel.create({
        ...baseData,
        gymId,
        createdBy,
        seriesId,
        isSeries: isRecurring,
        status: 'active',
      });

      if (dto.coachId) {
        await this.notifyCoach(dto.coachId, createdClass as any, 'assigned');
      }

      return {
        success: true,
        data: createdClass.toObject() as GymClass,
      };
    } catch (error) {
      console.error('Create class error:', error);
      if (
        error.message.includes('conflicting session') ||
        error.message.includes('another class')
      ) {
        return {
          success: false,
          errorCode: ErrorCode.COACH_NOT_AVAILABLE,
          message: error.message,
        };
      }
      return {
        success: false,
        errorCode: ErrorCode.CLASS_CREATE_ERROR,
        message: error.message || 'Failed to create class',
      };
    }
  }

  private generateInstances(
    template: any,
    startDate: Date,
    endDate: Date,
    persistentInstances: any[],
  ): GymClass[] {
    const toPlain = (doc: any) =>
      typeof doc.toObject === 'function' ? doc.toObject() : doc;

    const instances: GymClass[] = [];
    const recurrence = template.recurrence;
    if (!recurrence || recurrence.type === 'none') {
      const scheduled = new Date(template.scheduledAt);
      if (scheduled >= startDate && scheduled <= endDate) {
        return [toPlain(template) as GymClass];
      }
      return [];
    }

    const iterationDate = new Date(template.scheduledAt);
    const recurrenceEndDate = recurrence.endDate
      ? new Date(recurrence.endDate)
      : null;

    const hours = iterationDate.getHours();
    const minutes = iterationDate.getMinutes();

    const isDayMatch = (date: Date) => {
      if (recurrence.type === 'custom' && recurrence.days) {
        return recurrence.days.includes(date.getDay());
      }
      return true;
    };

    // Ensure we start on a valid day for custom series
    if (recurrence.type === 'custom' && !isDayMatch(iterationDate)) {
      for (let i = 0; i < 7; i++) {
        iterationDate.setDate(iterationDate.getDate() + 1);
        if (isDayMatch(iterationDate)) break;
      }
    }

    const MAX_INSTANCES = 500;
    while (instances.length < MAX_INSTANCES && iterationDate <= endDate) {
      if (recurrenceEndDate && iterationDate > recurrenceEndDate) break;

      if (isDayMatch(iterationDate)) {
        const currentDate = new Date(iterationDate);
        currentDate.setHours(hours, minutes, 0, 0);

        if (currentDate >= startDate) {
          // Check if we have a persistent override for this slot
          const override = persistentInstances.find((p) => {
            if (String(p.seriesId) !== String(template.seriesId)) return false;

            if (p.originalScheduledAt) {
              const pOrigDate = new Date(p.originalScheduledAt);
              return pOrigDate.getTime() === currentDate.getTime();
            }

            // Fallback: match by scheduledAt for older data or sessions that haven't moved
            const pDate = new Date(p.scheduledAt);
            return pDate.getTime() === currentDate.getTime();
          });

          if (override) {
            // Include persistent instance if it's not a deletion or if we want to show cancelled ones
            instances.push(toPlain(override) as GymClass);
          } else {
            // Generate virtual instance
            instances.push({
              ...(toPlain(template) as GymClass),
              _id: `v_${template._id}_${currentDate.getTime()}`,
              scheduledAt: currentDate,
              isSeries: false,
              bookings: [], // Virtual instances start empty
            });
          }
        }
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

    return instances;
  }

  async update(
    id: string,
    dto: UpdateGymClassDto,
    updatedBy: string,
    updateSeries = false,
  ): Promise<ApiResponse<GymClass>> {
    try {
      let gymClass: GymClassModel | null = null;
      let targetDate: Date | null = null;

      if (id.startsWith('v_')) {
        const parts = id.split('_');
        const templateId = parts[1];
        const timestamp = parseInt(parts[2]);
        targetDate = new Date(timestamp);

        const template = await this.gymClassModel.findById(templateId);
        if (!template) {
          return {
            success: false,
            errorCode: ErrorCode.CLASS_NOT_FOUND,
            message: 'Series template not found',
          };
        }

        // Check if persistent override exists
        gymClass = await this.gymClassModel.findOne({
          seriesId: template.seriesId,
          $or: [
            { originalScheduledAt: targetDate },
            {
              scheduledAt: targetDate,
              originalScheduledAt: { $exists: false },
            },
          ],
        });

        if (!gymClass) {
          const { _id, createdAt, updatedAt, ...templateData } =
            template.toObject();

          gymClass = await this.gymClassModel.create({
            ...templateData,
            scheduledAt: targetDate,
            originalScheduledAt: targetDate,
            isSeries: false,
            bookings: [],
          });
          id = (gymClass as any)._id.toString();
        } else {
          id = (gymClass as any)._id.toString();
        }
      } else {
        gymClass = await this.gymClassModel.findById(id);
      }

      if (!gymClass) {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_NOT_FOUND,
          message: 'Class not found',
        };
      }

      const existingClass = gymClass;
      // Prepare update data and sanitize protected fields
      const updateData = { ...dto, updatedBy };
      delete (updateData as any)._id;
      delete (updateData as any).seriesId;
      delete (updateData as any).isSeries;
      delete (updateData as any).gymId;
      delete (updateData as any).createdAt;
      delete (updateData as any).updatedAt;
      delete (updateData as any).bookings; // Bookings should be managed via book/cancel-booking
      delete (updateData as any).__v;

      if (updateData.coachId === '') delete (updateData as any).coachId;

      if (
        (dto.coachId &&
          String(dto.coachId) !== String(existingClass.coachId)) ||
        dto.scheduledAt ||
        dto.duration
      ) {
        const coachId = dto.coachId || existingClass.coachId;
        const scheduledAt = dto.scheduledAt
          ? new Date(dto.scheduledAt)
          : new Date(existingClass.scheduledAt);
        const duration = dto.duration || existingClass.duration;

        if (coachId) {
          await this.validateAvailability(
            coachId ? String(coachId) : undefined,
            dto.facilityId || existingClass.facilityId,
            scheduledAt,
            duration,
            id,
            existingClass.seriesId,
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

      let updatedClass: GymClassModel | null;

      if (updateSeries && existingClass.seriesId) {
        // 1. Update the template record (isSeries: true)
        // This handles metadata AND shifts future virtual slots via scheduledAt
        await this.gymClassModel.updateOne(
          { seriesId: existingClass.seriesId, isSeries: true },
          { $set: updateData },
        );

        // 2. Update all other persistent instances (isSeries: false)
        // We exclude scheduledAt for these to avoid collapsing every different day into one date
        const instanceUpdateData = { ...updateData };
        delete instanceUpdateData.scheduledAt;

        await this.gymClassModel.updateMany(
          { seriesId: existingClass.seriesId, isSeries: false },
          { $set: instanceUpdateData },
        );

        // 3. Finally, update the specific current instance (handles scheduledAt for today)
        updatedClass = await this.gymClassModel.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true },
        );
      } else {
        updatedClass = await this.gymClassModel.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true },
        );
      }

      if (
        dto.coachId &&
        String(dto.coachId) !== String(existingClass.coachId)
      ) {
        await this.notifyCoach(
          String(dto.coachId),
          updatedClass as any,
          'assigned',
        );
      }

      return {
        success: true,
        data: updatedClass?.toObject() as GymClass,
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
        message: error.message || 'Failed to update class',
      };
    }
  }

  async remove(
    id: string,
    deleteSeries = false,
    hardDelete = false,
  ): Promise<ApiResponse<void>> {
    try {
      let gymClass: GymClassModel | null = null;
      let targetDate: Date | null = null;

      if (id.startsWith('v_')) {
        const parts = id.split('_');
        const templateId = parts[1];
        const timestamp = parseInt(parts[2]);
        targetDate = new Date(timestamp);

        gymClass = await this.gymClassModel.findById(templateId);
        if (!gymClass) {
          return {
            success: false,
            errorCode: ErrorCode.CLASS_NOT_FOUND,
            message: 'Series template not found',
          };
        }
      } else {
        gymClass = await this.gymClassModel.findById(id);
      }

      if (!gymClass) {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_NOT_FOUND,
          message: 'Class not found',
        };
      }

      if (hardDelete) {
        if (deleteSeries && gymClass.seriesId) {
          await this.gymClassModel.deleteMany({ seriesId: gymClass.seriesId });
        } else {
          await this.gymClassModel.findByIdAndDelete(gymClass._id);
        }
        return { success: true };
      }

      if (deleteSeries && gymClass.seriesId) {
        // Cancel the entire series: templates and persistent instances
        await this.gymClassModel.updateMany(
          { seriesId: gymClass.seriesId },
          { status: 'cancelled' },
        );
      } else if (id.startsWith('v_') && targetDate) {
        // Cancel a specific VIRTUAL slot
        const template = gymClass; // In this branch, gymClass is the template
        const { _id, createdAt, updatedAt, ...templateData } =
          template.toObject();

        await this.gymClassModel.create({
          ...templateData,
          scheduledAt: targetDate,
          originalScheduledAt: targetDate,
          isSeries: false,
          status: 'cancelled',
          bookings: [],
        });
      } else {
        // Cancel a specific PERSISTENT instance
        gymClass.status = 'cancelled';
        await gymClass.save();
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

  async restore(id: string, restoreSeries = false): Promise<ApiResponse<void>> {
    try {
      let gymClass: GymClassModel | null = null;
      if (id.startsWith('v_')) {
        const parts = id.split('_');
        const templateId = parts[1];
        gymClass = await this.gymClassModel.findById(templateId);
      } else {
        gymClass = await this.gymClassModel.findById(id);
      }

      if (!gymClass) {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_NOT_FOUND,
          message: 'Class not found',
        };
      }

      if (restoreSeries && gymClass.seriesId) {
        await this.gymClassModel.updateMany(
          { seriesId: gymClass.seriesId },
          { status: 'active' },
        );
      } else {
        gymClass.status = 'active';
        await gymClass.save();
      }

      return { success: true };
    } catch (error) {
      console.error('Restore class error:', error);
      return {
        success: false,
        errorCode: ErrorCode.CLASS_UPDATE_ERROR,
        message: 'Failed to restore class',
      };
    }
  }

  async findAllByGym(
    gymId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ApiResponse<GymClass[]>> {
    try {
      const now = new Date();
      const start =
        startDate || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 1 month ago
      const end = endDate || new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 3 months ahead

      // Fetch series templates and persistent instances
      const templates = await this.gymClassModel
        .find({
          gymId,
          isSeries: true,
          // We include cancelled templates for management purposes
        })
        .populate(
          'coachId',
          'profile.fullName profile.username profile.profileImageUrl',
        )
        .populate('equipment.itemId', 'name category images quantity')
        .lean();

      const persistentInstances = await this.gymClassModel
        .find({
          gymId,
          isSeries: false,
          scheduledAt: { $gte: start, $lte: end },
        })
        .populate(
          'coachId',
          'profile.fullName profile.username profile.profileImageUrl',
        )
        .populate('equipment.itemId', 'name category images quantity')
        .lean();

      let allInstances: GymClass[] = [];

      // Generate virtual slots from templates
      for (const template of templates) {
        const generated = this.generateInstances(
          template as any,
          start,
          end,
          persistentInstances as any,
        );
        allInstances = [...allInstances, ...generated];
      }

      // Add persistent instances that are NOT part of any series (standalone classes)
      // OR series instances that weren't matched by any recurring slot
      const matchedPersistentIds = new Set(
        allInstances
          .filter((i) => !String(i._id).startsWith('v_'))
          .map((i) => String(i._id)),
      );
      const unmatchedPersistentInstances = persistentInstances.filter(
        (p) => !matchedPersistentIds.has(String(p._id)),
      );

      allInstances = [
        ...allInstances,
        ...(unmatchedPersistentInstances as unknown as GymClass[]),
      ];

      // Sort by date
      allInstances.sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );

      return {
        success: true,
        data: allInstances,
      };
    } catch (error) {
      console.error('Find all by gym error:', error);
      return {
        success: false,
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch classes',
      };
    }
  }

  async findAllByCoach(
    coachId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ApiResponse<GymClass[]>> {
    try {
      const now = new Date();
      const start =
        startDate || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate || new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

      let queryId: any = coachId;
      if (Types.ObjectId.isValid(coachId)) {
        queryId = new Types.ObjectId(coachId);
      }

      // Fetch series templates and persistent instances for this coach
      const templates = await this.gymClassModel
        .find({
          coachId: { $in: [queryId, coachId] },
          isSeries: true,
          status: { $ne: 'cancelled' },
        })
        .populate('gymId', 'name')
        .populate(
          'coachId',
          'profile.fullName profile.username profile.profileImageUrl',
        )
        .populate('equipment.itemId', 'name category images quantity')
        .lean();

      const persistentInstances = await this.gymClassModel
        .find({
          coachId: { $in: [queryId, coachId] },
          isSeries: false,
          scheduledAt: { $gte: start, $lte: end },
        })
        .populate('gymId', 'name')
        .populate(
          'coachId',
          'profile.fullName profile.username profile.profileImageUrl',
        )
        .populate('equipment.itemId', 'name category images quantity')
        .lean();

      let allInstances: GymClass[] = [];

      // Generate virtual slots from templates
      for (const template of templates) {
        const generated = this.generateInstances(
          template as any,
          start,
          end,
          persistentInstances as any,
        );
        allInstances = [...allInstances, ...generated];
      }

      // Add persistent instances that are NOT part of any series
      // OR series instances that weren't matched by any recurring slot
      const matchedPersistentIds = new Set(
        allInstances
          .filter((i) => !String(i._id).startsWith('v_'))
          .map((i) => String(i._id)),
      );
      const unmatchedPersistentInstances = persistentInstances.filter(
        (p) => !matchedPersistentIds.has(String(p._id)),
      );

      allInstances = [
        ...allInstances,
        ...(unmatchedPersistentInstances as unknown as GymClass[]),
      ];

      // Sort by date
      allInstances.sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );

      return {
        success: true,
        data: allInstances,
      };
    } catch (error) {
      console.error('Find all by coach error:', error);
      return {
        success: false,
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch coach classes',
      };
    }
  }

  async findAllByMember(memberId: string): Promise<ApiResponse<GymClass[]>> {
    try {
      let memberObjectId: any = memberId;
      if (Types.ObjectId.isValid(memberId)) {
        memberObjectId = new Types.ObjectId(memberId);
      }

      const classes = await this.gymClassModel
        .find({
          'bookings.userId': { $in: [memberObjectId, memberId] },
          status: { $ne: 'cancelled' },
        })
        .populate('gymId', 'name')
        .populate(
          'coachId',
          'profile.fullName profile.username profile.profileImageUrl',
        )
        .populate('equipment.itemId', 'name category images quantity')
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
        message: 'Failed to fetch member classes',
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
        .populate('equipment.itemId', 'name category images quantity')
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
      let classId = dto.classId;
      let gymClass: GymClassModel | null = null;
      let targetDate: Date | null = null;

      if (classId.startsWith('v_')) {
        // Virtual instance: v_{templateId}_{timestamp}
        const parts = classId.split('_');
        const templateId = parts[1];
        const timestamp = parseInt(parts[2]);
        targetDate = new Date(timestamp);

        const template = await this.gymClassModel.findById(templateId);
        if (!template) {
          return {
            success: false,
            errorCode: ErrorCode.CLASS_NOT_FOUND,
            message: 'Series template not found',
          };
        }

        // Check if a persistent instance already exists for this slot
        gymClass = await this.gymClassModel.findOne({
          seriesId: template.seriesId,
          $or: [
            { originalScheduledAt: targetDate },
            {
              scheduledAt: targetDate,
              originalScheduledAt: { $exists: false },
            },
          ],
        });

        if (!gymClass) {
          const { _id, createdAt, updatedAt, ...templateData } =
            template.toObject();

          gymClass = await this.gymClassModel.create({
            ...templateData,
            scheduledAt: targetDate,
            originalScheduledAt: targetDate,
            isSeries: false,
            bookings: [],
          });
          classId = (gymClass as any)._id.toString();
        } else {
          classId = (gymClass as any)._id.toString();
        }
      } else {
        gymClass = await this.gymClassModel.findById(classId);
      }

      if (!gymClass || gymClass.status === 'cancelled') {
        return {
          success: false,
          errorCode: ErrorCode.CLASS_NOT_FOUND,
          message: 'Class not found or cancelled',
        };
      }

      // Check if already booked
      const alreadyBooked = gymClass.bookings.some(
        (b) => String(b.userId) === String(userId),
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
        classId: classId,
        userId,
        status: 'booked',
        bookedAt: new Date(),
        createdAt: new Date(),
      } as any);

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
        (b) => String(b.userId) === String(userId),
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

  private async validateAvailability(
    coachId: string | undefined, // Coach is optional for classes (e.g. open gym)
    facilityId: string | undefined,
    start: Date,
    duration: number,
    excludeClassId?: string,
    seriesId?: string,
  ): Promise<void> {
    const end = new Date(start.getTime() + duration * 60000);

    // 1. Check Coach Availability
    if (coachId) {
      // Check conflicting sessions
      const conflictingSession = await this.sessionModel.findOne({
        coachId: new Types.ObjectId(coachId),
        startTime: { $lt: end },
        endTime: { $gt: start },
        status: { $ne: 'cancelled' },
      });

      if (conflictingSession) {
        throw new Error(
          `Coach has a conflicting session at ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        );
      }

      // Check conflicting classes
      const lookback = new Date(start.getTime() - 4 * 60 * 60 * 1000);
      const nearbyClasses = await this.gymClassModel.find({
        coachId: new Types.ObjectId(coachId),
        _id: { $ne: excludeClassId },
        scheduledAt: { $gte: lookback, $lte: end },
        status: { $ne: 'cancelled' },
      });

      for (const cls of nearbyClasses) {
        if (
          seriesId &&
          cls.seriesId &&
          String(cls.seriesId) === String(seriesId) &&
          cls.isSeries
        ) {
          continue;
        }

        const clsStart = new Date(cls.scheduledAt as Date);
        const clsEnd = new Date(clsStart.getTime() + cls.duration * 60000);

        if (clsStart < end && clsEnd > start) {
          throw new Error(
            `Coach has another class (${cls.name}) at ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          );
        }
      }
    }

    // 2. Check Facility Availability
    if (facilityId) {
      // Check sessions in this facility
      const facilitySession = await this.sessionModel.findOne({
        facilityId,
        startTime: { $lt: end },
        endTime: { $gt: start },
        status: { $ne: 'cancelled' },
      });

      if (facilitySession) {
        throw new Error(
          `Facility is already booked by a session at ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        );
      }

      // Check classes in this facility
      const lookback = new Date(start.getTime() - 4 * 60 * 60 * 1000);
      const facilityClasses = await this.gymClassModel.find({
        facilityId,
        _id: { $ne: excludeClassId },
        scheduledAt: { $gte: lookback, $lte: end },
        status: { $ne: 'cancelled' },
      });

      for (const cls of facilityClasses) {
        if (
          seriesId &&
          cls.seriesId &&
          String(cls.seriesId) === String(seriesId) &&
          cls.isSeries
        ) {
          continue;
        }

        const clsStart = new Date(cls.scheduledAt as Date);
        const clsEnd = new Date(clsStart.getTime() + cls.duration * 60000);

        if (clsStart < end && clsEnd > start) {
          throw new Error(
            `Facility is already booked by class (${cls.name}) at ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          );
        }
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
