import {
  CreateGymDto,
  GymSettings,
  UserRole,
} from '@ahmedrioueche/gympro-client';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as exceljs from 'exceljs';
import { Response } from 'express';
import { Model, Types } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { AppSubscriptionService } from '../appBilling/subscription/subscription.service';
import { calculateSubscriptionLimits } from '../appBilling/subscription/subscription.util';
import {
  AffiliationStatus,
  GymCoachAffiliation,
  GymCoachAffiliationDocument,
} from '../gym-coach/schemas/gym-coach-affiliation.schema';
import { GymMembershipModel } from '../gymMembership/membership.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { GymModel } from './gym.schema';

@Injectable()
export class GymService {
  constructor(
    @InjectModel('GymModel') private gymModel: Model<GymModel>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel('GymMembership')
    private membershipModel: Model<GymMembershipModel>,
    @InjectModel(GymCoachAffiliation.name)
    private affiliationModel: Model<GymCoachAffiliationDocument>,
    private readonly notificationsService: NotificationsService,
    private readonly appSubscriptionService: AppSubscriptionService,
  ) {}

  async create(createGymDto: CreateGymDto) {
    // 1. Check gym creation limits based on owner's subscription
    const subscription = await this.appSubscriptionService.getMySubscription(
      createGymDto.owner,
    );

    const limits = calculateSubscriptionLimits(subscription);

    const currentGymsCount = await this.gymModel.countDocuments({
      owner: createGymDto.owner,
    });

    if (limits.maxGyms > 0 && currentGymsCount >= limits.maxGyms) {
      throw new ConflictException({
        message: 'billing.limits.gym_creation_limit_reached',
        vars: { limit: limits.maxGyms },
      });
    }

    // Check if a gym with the same name and owner already exists
    const existingGym = await this.gymModel.findOne({
      name: createGymDto.name,
      owner: createGymDto.owner,
    });

    if (existingGym) {
      throw new ConflictException(
        'You already have a gym with this name. Please choose a different name.',
      );
    }

    const createdGym = new this.gymModel({
      ...createGymDto,
      settings: {
        ...(createGymDto.settings || {}),
        workingHours: createGymDto.settings?.workingHours || {
          start: '08:00',
          end: '22:00',
        },
      },
    });
    await createdGym.save();

    // Create owner membership automatically with all permissions
    const ownerMembership = new this.membershipModel({
      user: createGymDto.owner,
      gym: createdGym._id,
      roles: ['owner'],
      membershipStatus: 'active',
      joinedAt: new Date(),
      permissions: [
        // Owner gets all permissions by default
        'members:view',
        'members:create',
        'members:edit',
        'members:delete',
        'attendance:view',
        'attendance:checkin',
        'attendance:manage',
        'pricing:view',
        'pricing:manage',
        'staff:view',
        'staff:manage',
        'settings:view',
        'settings:manage',
        'analytics:view',
        'analytics:export',
        'schedules:view',
        'schedules:manage',
      ],
    });
    await ownerMembership.save();

    // Add membership to user's memberships array and update role/dashboard access
    await this.userModel.findByIdAndUpdate(createGymDto.owner, {
      $addToSet: {
        memberships: ownerMembership._id,
        dashboardAccess: 'manager',
      },
      $set: { role: UserRole.Owner },
    });

    // Populate the owner field before returning
    await createdGym.populate('owner');

    // Notify Staff (Admins & Editors)
    this.notificationsService
      .notifyStaff({
        key: 'admin.gym_created',
        vars: {
          name:
            (createdGym.owner as any)?.profile?.fullName ||
            (createdGym.owner as any)?.profile?.username ||
            'A user',
          gymName: createdGym.name,
        },
      })
      .catch((err) => {
        console.error(`Failed to notify staff about gym creation: ${err}`);
      });

    return this.normalizeGym(createdGym);
  }

  async findAll(
    options: {
      search?: string;
      city?: string;
      gender?: string;
      services?: string[];
      page?: number;
      limit?: number;
      excludeUserId?: string;
    } = {},
  ) {
    const {
      search,
      city,
      gender,
      services,
      page = 1,
      limit = 12,
      excludeUserId,
    } = options;
    const skip = (page - 1) * limit;
    const query: any = {};

    if (excludeUserId) {
      const [memberships, affiliations] = await Promise.all([
        this.membershipModel
          .find({
            user: new Types.ObjectId(excludeUserId),
            membershipStatus: { $in: ['active', 'pending'] },
          })
          .select('gym')
          .lean(),
        this.affiliationModel
          .find({
            coachId: new Types.ObjectId(excludeUserId),
            status: {
              $in: [AffiliationStatus.ACTIVE, AffiliationStatus.PENDING],
            },
          })
          .select('gymId')
          .lean(),
      ]);

      const excludedGymIds = [
        ...memberships.map((m) => m.gym.toString()),
        ...affiliations.map((a) => a.gymId.toString()),
      ];

      if (excludedGymIds.length > 0) {
        query._id = { $nin: excludedGymIds };
      }
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { address: searchRegex },
        { slogan: searchRegex },
      ];
    }

    if (city && city.trim()) {
      query.city = city;
    }

    if (gender) {
      if (gender === 'mixed') {
        query['settings.isMixed'] = true;
      } else if (gender === 'female_only') {
        query['settings.isMixed'] = false;
      }
    }

    if (services && services.length > 0) {
      query['settings.servicesOffered'] = { $all: services };
    }

    const total = await this.gymModel.countDocuments(query).exec();
    const gyms = await this.gymModel
      .find(query)
      .populate('owner')
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      data: gyms.map((gym) => this.normalizeGym(gym)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findUniqueCities() {
    return this.gymModel.distinct('city', {
      city: { $ne: null, $exists: true, $nin: ['', ' '] },
    });
  }

  async findByOwner(ownerId: string, populate = false) {
    const query = this.gymModel.find({ owner: ownerId });
    if (populate) {
      query.populate('owner');
    }
    const gyms = await query.exec();

    // Trigger stats recalculation for these gyms to ensure accurate counts
    // This self-heals any stale data from before the bug fix
    // We execute this asynchronously so it doesn't block the response too much
    // but ideally we want accurate data immediately.
    // Given the gyms count for a manager is low (usually < 5), we can await it for correctness.
    const updatePromises = gyms.map(async (gym) => {
      await this.updateGymStats(gym._id.toString());
      // Re-fetch the gym to get updated stats
      const updated = await this.gymModel.findById(gym._id);
      if (updated) {
        Object.assign(gym, updated.toObject());
      }
    });

    await Promise.all(updatePromises);
    return gyms.map((gym) => this.normalizeGym(gym));
  }

  /**
   * Helper to recalculate and persist gym member statistics
   */
  private async updateGymStats(gymId: string) {
    const gymObjectId = new Types.ObjectId(gymId);
    if (!gymObjectId) return;

    const stats = await this.membershipModel.aggregate([
      { $match: { gym: gymObjectId, roles: { $in: ['member'] } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          withActiveSubscriptions: {
            $sum: { $cond: [{ $eq: ['$membershipStatus', 'active'] }, 1, 0] },
          },
          withExpiredSubscriptions: {
            $sum: { $cond: [{ $eq: ['$membershipStatus', 'expired'] }, 1, 0] },
          },
          pendingApproval: {
            $sum: { $cond: [{ $eq: ['$membershipStatus', 'pending'] }, 1, 0] },
          },
        },
      },
    ]);

    const result = stats[0] || {
      total: 0,
      withActiveSubscriptions: 0,
      withExpiredSubscriptions: 0,
      pendingApproval: 0,
    };

    await this.gymModel.findByIdAndUpdate(gymId, {
      $set: {
        'memberStats.total': result.total,
        'memberStats.withActiveSubscriptions': result.withActiveSubscriptions,
        'memberStats.withExpiredSubscriptions': result.withExpiredSubscriptions,
        'memberStats.pendingApproval': result.pendingApproval,
      },
    });
  }

  async findByMember(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate({
        path: 'memberships',
        populate: {
          path: 'gym',
          model: 'GymModel',
          populate: {
            path: 'owner',
            model: 'User',
          },
        },
      })
      .exec();

    if (!user || !user.memberships || user.memberships.length === 0) {
      return [];
    }

    const gyms = (user.memberships as any[])
      .map((membership: any) => {
        if (
          membership.gym &&
          ['active', 'pending'].includes(membership.membershipStatus) &&
          membership.roles.includes(UserRole.Member)
        ) {
          return membership.gym;
        }
        return null;
      })
      .filter((gym: any) => gym !== null);

    return gyms.map((gym) => this.normalizeGym(gym));
  }

  async findAllForUser(userId: string, populate = true) {
    // Get gyms owned by user
    const ownedGyms = await this.findByOwner(userId, populate);

    // Get gyms where user is a member (already populated in findByMember)
    const memberGyms = await this.findByMember(userId);

    // Get gyms where user is an affiliated coach
    const coachGyms = await this.findByCoach(userId);

    // Get gyms where user has a staff role (receptionist, manager, etc.)
    const staffGyms = await this.findByStaff(userId);

    // Combine and deduplicate by _id
    const allGyms = [...ownedGyms, ...memberGyms, ...coachGyms, ...staffGyms];
    const uniqueGyms = Array.from(
      new Map(allGyms.map((gym) => [gym._id.toString(), gym])).values(),
    );

    return uniqueGyms.map((gym) => this.normalizeGym(gym));
  }

  /**
   * Get gyms where user is an affiliated coach (active affiliations only)
   */
  async findByCoach(userId: string) {
    const affiliations = await this.affiliationModel
      .find({
        coachId: new Types.ObjectId(userId),
        status: 'active',
      })
      .lean();

    if (!affiliations || affiliations.length === 0) {
      return [];
    }

    const gymIds = affiliations.map((a: any) => a.gymId);
    const gyms = await this.gymModel
      .find({ _id: { $in: gymIds } })
      .populate('owner')
      .exec();

    return gyms.map((gym) => this.normalizeGym(gym));
  }

  /**
   * Get gyms where user has a staff role (manager, receptionist, etc.) via memberships
   */
  async findByStaff(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate({
        path: 'memberships',
        populate: {
          path: 'gym',
          model: 'GymModel',
          populate: {
            path: 'owner',
            model: 'User',
          },
        },
      })
      .exec();

    if (!user || !user.memberships || user.memberships.length === 0) {
      return [];
    }

    const staffRoles = [
      UserRole.Manager,
      UserRole.Receptionist,
      UserRole.Coach,
      UserRole.Cleaner,
      UserRole.Maintenance,
      UserRole.Security,
    ];

    const gyms = (user.memberships as any[])
      .map((membership: any) => {
        if (
          membership.gym &&
          ['active', 'pending'].includes(membership.membershipStatus) &&
          membership.roles.some((r: any) => staffRoles.includes(r))
        ) {
          return membership.gym;
        }
        return null;
      })
      .filter((gym: any) => gym !== null);

    return gyms.map((gym) => this.normalizeGym(gym));
  }

  async getGymMembers(
    gymId: string,
    options: { search?: string; page?: number; limit?: number } = {},
  ) {
    const { search, page = 1, limit = 12 } = options;
    const skip = (page - 1) * limit;

    // 1. Find all memberships for this gym (only members, not staff)
    const memberships = await this.membershipModel
      .find({
        gym: new Types.ObjectId(gymId),
        membershipStatus: { $in: ['active', 'pending', 'expired', 'banned'] },
        roles: 'member', // Only get memberships with 'member' role
      })
      .select('_id')
      .exec();

    const membershipIds = memberships.map((m) => m._id);

    // 2. Build query for users who have these memberships
    let query: any = {
      memberships: { $in: membershipIds },
    };

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      // Use explicit $and to combine membership filter with search
      query = {
        $and: [
          { memberships: { $in: membershipIds } },
          {
            $or: [
              { 'profile.fullName': searchRegex },
              { 'profile.username': searchRegex },
              { 'profile.email': searchRegex },
            ],
          },
        ],
      };
    }

    // 3. Get total count for pagination
    const total = await this.userModel.countDocuments(query).exec();

    // 4. Fetch paginated users
    const users = await this.userModel
      .find(query)
      .populate({
        path: 'memberships',
        match: { gym: new Types.ObjectId(gymId) }, // Only populate the membership for THIS gym
        populate: {
          path: 'gym',
          model: 'GymModel',
        },
      })
      .select(
        '-profile.password -setupToken -setupTokenExpiry -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry',
      )
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, populate = true) {
    const query = this.gymModel.findById(id);
    if (populate) {
      query.populate('owner');
    }
    const gym = await query.exec();
    if (!gym) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }
    return this.normalizeGym(gym);
  }

  async setBanner(id: string, banner: { url: string; publicId: string }) {
    const gym = await this.gymModel.findByIdAndUpdate(
      id,
      {
        bannerUrl: banner.url,
        bannerPublicId: banner.publicId,
      },
      { new: true },
    );

    if (!gym) {
      throw new Error('Gym not found');
    }

    return this.normalizeGym(gym);
  }

  async update(id: string, updateGymDto: any) {
    const updatedGym = await this.gymModel
      .findByIdAndUpdate(id, updateGymDto, { new: true })
      .populate('owner')
      .exec();
    if (!updatedGym) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }
    return this.normalizeGym(updatedGym);
  }

  async updateSettings(id: string, updateSettingsDto: any, userId: string) {
    // Find the gym
    const gym = await this.gymModel.findById(id).exec();
    if (!gym) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }

    // Verify the user is the gym owner
    console.log(
      'UpdateSettings payload:',
      updateSettingsDto,
      'UserID:',
      userId,
    );
    if (gym.owner.toString() !== userId) {
      throw new ConflictException(
        'You are not authorized to update this gym settings',
      );
    }

    // Convert Mongoose document to plain object to avoid issues with merging
    const currentSettings: Partial<GymSettings> = gym.toObject().settings || {};

    // Deep merge settings to handle nested objects properly
    const updatedSettings = {
      ...currentSettings,
      ...updateSettingsDto,
      // Handle nested objects explicitly
      workingHours: updateSettingsDto.workingHours
        ? {
            ...(currentSettings.workingHours || {}),
            ...updateSettingsDto.workingHours,
          }
        : currentSettings.workingHours,
      femaleOnlyHours:
        updateSettingsDto.femaleOnlyHours !== undefined
          ? updateSettingsDto.femaleOnlyHours
          : currentSettings.femaleOnlyHours,
    };

    // Detect closure changes for notifications
    const oldClosures = currentSettings.temporaryClosures || [];
    const newClosures = updateSettingsDto.temporaryClosures || [];

    // Find added closures
    const addedClosures = newClosures.filter(
      (nc: any) =>
        !oldClosures.some(
          (oc: any) =>
            new Date(oc.start).getTime() === new Date(nc.start).getTime() &&
            new Date(oc.end).getTime() === new Date(nc.end).getTime(),
        ),
    );

    // Find removed closures
    const removedClosures = oldClosures.filter(
      (oc: any) =>
        !newClosures.some(
          (nc: any) =>
            new Date(nc.start).getTime() === new Date(oc.start).getTime() &&
            new Date(nc.end).getTime() === new Date(oc.end).getTime(),
        ),
    );

    // Detect schedule changes for notifications
    const scheduleChanges: string[] = [];

    // 1. Working Days
    if (
      updateSettingsDto.workingDays &&
      JSON.stringify(currentSettings.workingDays) !==
        JSON.stringify(updateSettingsDto.workingDays)
    ) {
      scheduleChanges.push('working_days');
    }

    // 2. Standard Working Hours
    if (
      updateSettingsDto.workingHours &&
      (currentSettings.workingHours?.start !==
        updateSettingsDto.workingHours.start ||
        currentSettings.workingHours?.end !==
          updateSettingsDto.workingHours.end)
    ) {
      scheduleChanges.push('standard_hours');
    }

    // 3. Custom Working Hours (Advanced Mode)
    if (
      updateSettingsDto.customWorkingHours &&
      JSON.stringify(currentSettings.customWorkingHours) !==
        JSON.stringify(updateSettingsDto.customWorkingHours)
    ) {
      scheduleChanges.push('advanced_hours');
    }

    // 4. Female-Only Hours
    if (
      updateSettingsDto.femaleOnlyHours !== undefined &&
      JSON.stringify(currentSettings.femaleOnlyHours) !==
        JSON.stringify(updateSettingsDto.femaleOnlyHours)
    ) {
      scheduleChanges.push('female_only_hours');
    }

    // Update the gym with new settings
    const updatedGym = await this.gymModel
      .findByIdAndUpdate(id, { settings: updatedSettings }, { new: true })
      .populate('owner')
      .exec();

    // Trigger notifications asynchronously
    if (updatedSettings.notifyScheduleChanges && scheduleChanges.length > 0) {
      this.notificationsService.notifyScheduleChange(id, scheduleChanges);
    }

    addedClosures.forEach((closure) => {
      this.notificationsService.notifyGymClosureChange(id, closure, 'added');
    });
    removedClosures.forEach((closure) => {
      this.notificationsService.notifyGymClosureChange(id, closure, 'deleted');
    });

    return this.normalizeGym(updatedGym);
  }

  async remove(id: string) {
    const deletedGym = await this.gymModel.findByIdAndDelete(id).exec();
    if (!deletedGym) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }
    return deletedGym;
  }

  async addMedia(id: string, mediaItem: any) {
    const updatedGym = await this.gymModel
      .findByIdAndUpdate(
        id,
        { $push: { media: { ...mediaItem, createdAt: new Date() } } },
        { new: true },
      )
      .populate('owner')
      .exec();
    if (!updatedGym) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }
    return this.normalizeGym(updatedGym);
  }

  async removeMedia(id: string, publicId: string) {
    const updatedGym = await this.gymModel
      .findByIdAndUpdate(id, { $pull: { media: { publicId } } }, { new: true })
      .populate('owner')
      .exec();
    if (!updatedGym) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }
    return this.normalizeGym(updatedGym);
  }

  async addFacility(gymId: string, facility: any) {
    const facilityWithId = {
      ...facility,
      _id: new Types.ObjectId().toString(),
    };
    console.log(`Adding facility to gym ${gymId}:`, facilityWithId);
    const updatedGym = await this.gymModel
      .findByIdAndUpdate(
        gymId,
        { $push: { facilities: { ...facilityWithId, createdAt: new Date() } } },
        { new: true },
      )
      .exec();
    console.log(
      `Facility added. New facilities count: ${updatedGym?.facilities?.length}`,
    );
    if (!updatedGym) {
      throw new NotFoundException(`Gym with ID ${gymId} not found`);
    }
    return this.normalizeGym(updatedGym);
  }

  async updateFacility(gymId: string, facilityId: string, facility: any) {
    const updatedGym = await this.gymModel
      .findOneAndUpdate(
        { _id: gymId, 'facilities._id': facilityId },
        { $set: { 'facilities.$': { ...facility, _id: facilityId } } },
        { new: true },
      )
      .exec();
    if (!updatedGym) {
      throw new NotFoundException(`Facility or Gym not found`);
    }
    return this.normalizeGym(updatedGym);
  }

  async removeFacility(gymId: string, facilityId: string) {
    const updatedGym = await this.gymModel
      .findByIdAndUpdate(
        gymId,
        { $pull: { facilities: { _id: facilityId } } },
        { new: true },
      )
      .exec();
    if (!updatedGym) {
      throw new NotFoundException(`Gym not found`);
    }
    return this.normalizeGym(updatedGym);
  }

  async validateFacility(gymId: string, facilityId: string) {
    const gym = await this.gymModel.findOne({
      _id: gymId,
      'facilities._id': facilityId,
    });
    return !!gym;
  }

  private normalizeGym(gym: any) {
    if (!gym) return gym;

    // Convert to plain object if it's a mongoose document
    const gymObj = gym.toObject ? gym.toObject() : gym;

    if (gymObj.settings && gymObj.settings.servicesOffered) {
      gymObj.settings.servicesOffered = gymObj.settings.servicesOffered.map(
        (service: any) => {
          if (typeof service === 'string') {
            return {
              _id: new Types.ObjectId().toString(),
              name: service,
              createdAt: new Date(),
            };
          }
          return service;
        },
      );
    }

    return gymObj;
  }

  async exportManagerData(userId: string, res: Response) {
    const workbook = new exceljs.Workbook();
    const gymsSheet = workbook.addWorksheet('My Gyms');
    const membersSheet = workbook.addWorksheet('Members');

    // 1. Configure Columns
    gymsSheet.columns = [
      { header: 'Gym Name', key: 'name', width: 30 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Workers', key: 'workersCount', width: 15 },
      { header: 'Members', key: 'membersCount', width: 15 },
    ];
    membersSheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Username', key: 'username', width: 20 },
      { header: 'Gender', key: 'gender', width: 12 },
      { header: 'Age', key: 'age', width: 8 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Gym', key: 'gymName', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Joined At', key: 'joinedAt', width: 20 },
      { header: 'Subscription Plan', key: 'subscriptionPlan', width: 25 },
      { header: 'Subscription Expiry', key: 'subscriptionExpiry', width: 20 },
    ];

    // 2. Fetch gyms owned by this user (use raw DB query to avoid normalization issues)
    const ownedGyms = await this.gymModel.find({ owner: userId }).exec();

    // Also find gyms where this user is a staff manager
    const staffMemberships = await this.membershipModel
      .find({
        user: new Types.ObjectId(userId),
        membershipStatus: { $in: ['active', 'pending'] },
        roles: {
          $in: [
            UserRole.Manager,
            UserRole.Admin,
            UserRole.Owner,
            UserRole.Receptionist,
          ],
        },
      })
      .exec();

    const staffGymIds = staffMemberships
      .map((m) => m.gym?.toString())
      .filter(Boolean);

    // Fetch those additional gyms
    const staffGyms = await this.gymModel
      .find({
        _id: {
          $in: staffGymIds
            .filter((id) => !ownedGyms.some((g) => g._id.toString() === id))
            .map((id) => new Types.ObjectId(id)),
        },
      })
      .exec();

    const allGyms = [...ownedGyms, ...staffGyms];

    for (const gym of allGyms) {
      const gymId = gym._id;

      // Count workers (staff with non-member roles)
      const workersCount = await this.membershipModel.countDocuments({
        gym: gymId,
        membershipStatus: { $in: ['active', 'pending'] },
        roles: {
          $in: [
            UserRole.Manager,
            UserRole.Receptionist,
            UserRole.Coach,
            UserRole.Cleaner,
            UserRole.Maintenance,
            UserRole.Security,
          ],
        },
      });

      // Add Gym Row
      gymsSheet.addRow({
        name: gym.name,
        city: gym.city,
        address: gym.address,
        workersCount,
        membersCount: gym.memberStats?.total || 0,
      });

      // Directly query memberships for this gym (members only)
      const memberships = await this.membershipModel
        .find({
          gym: gymId,
          roles: UserRole.Member,
          membershipStatus: {
            $in: ['active', 'pending', 'expired', 'banned'],
          },
        })
        .exec();

      const membershipIds = memberships.map((m) => m._id);

      if (membershipIds.length === 0) continue;

      // Fetch users who have these memberships
      const users = await this.userModel
        .find({ memberships: { $in: membershipIds } })
        .populate({
          path: 'memberships',
          match: { gym: gymId },
        })
        .select(
          '-profile.password -setupToken -setupTokenExpiry -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry',
        )
        .exec();

      // Add Member Rows
      for (const user of users) {
        const userObj = user.toObject ? user.toObject() : user;
        const membership = (userObj.memberships as any[])?.find(
          (m: any) =>
            m.gym?.toString() === gymId.toString() ||
            m.gym?._id?.toString() === gymId.toString(),
        );

        membersSheet.addRow({
          name: userObj.profile?.fullName || '',
          email: userObj.profile?.email || '',
          phone: userObj.profile?.phoneNumber || '',
          username: userObj.profile?.username || '',
          gender: userObj.profile?.gender || '',
          age: userObj.profile?.age || '',
          city: userObj.profile?.city || '',
          gymName: gym.name,
          status: membership?.membershipStatus || 'Unknown',
          joinedAt: membership?.joinedAt || '',
          subscriptionPlan: membership?.subscription?.planName || '',
          subscriptionExpiry: membership?.subscription?.endDate
            ? new Date(membership.subscription.endDate).toLocaleDateString()
            : '',
        });
      }
    }

    // 3. Set Headers and send response
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'gym_export.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
