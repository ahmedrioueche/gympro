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
import { Model, Types } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
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
  ) {}

  async create(createGymDto: CreateGymDto) {
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

    // Add membership to user's memberships array
    await this.userModel.findByIdAndUpdate(createGymDto.owner, {
      $addToSet: { memberships: ownerMembership._id },
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

    return createdGym;
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
      data: gyms,
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
    return gyms;
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

    return gyms;
  }

  async findAllForUser(userId: string, populate = true) {
    // Get gyms owned by user
    const ownedGyms = await this.findByOwner(userId, populate);

    // Get gyms where user is a member (already populated in findByMember)
    const memberGyms = await this.findByMember(userId);

    // Get gyms where user is an affiliated coach
    const coachGyms = await this.findByCoach(userId);

    // Combine and deduplicate by _id
    const allGyms = [...ownedGyms, ...memberGyms, ...coachGyms];
    const uniqueGyms = Array.from(
      new Map(allGyms.map((gym) => [gym._id.toString(), gym])).values(),
    );

    return uniqueGyms;
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

    return gyms;
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
    return gym;
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

    return gym;
  }

  async update(id: string, updateGymDto: any) {
    const updatedGym = await this.gymModel
      .findByIdAndUpdate(id, updateGymDto, { new: true })
      .populate('owner')
      .exec();
    if (!updatedGym) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }
    return updatedGym;
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

    // Update the gym with new settings
    const updatedGym = await this.gymModel
      .findByIdAndUpdate(id, { settings: updatedSettings }, { new: true })
      .populate('owner')
      .exec();

    // Trigger notifications asynchronously
    addedClosures.forEach((closure) => {
      this.notificationsService.notifyGymClosureChange(id, closure, 'added');
    });
    removedClosures.forEach((closure) => {
      this.notificationsService.notifyGymClosureChange(id, closure, 'deleted');
    });

    return updatedGym;
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
    return updatedGym;
  }

  async removeMedia(id: string, publicId: string) {
    const updatedGym = await this.gymModel
      .findByIdAndUpdate(id, { $pull: { media: { publicId } } }, { new: true })
      .populate('owner')
      .exec();
    if (!updatedGym) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }
    return updatedGym;
  }
}
