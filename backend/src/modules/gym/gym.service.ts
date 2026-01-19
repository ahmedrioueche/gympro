import { CreateGymDto, GymSettings } from '@ahmedrioueche/gympro-client';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { GymMembershipModel } from '../gymMembership/membership.schema';
import { GymModel } from './gym.schema';

@Injectable()
export class GymService {
  constructor(
    @InjectModel('GymModel') private gymModel: Model<GymModel>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel('GymMembership')
    private membershipModel: Model<GymMembershipModel>,
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

    return createdGym;
  }

  async findAll() {
    return this.gymModel.find().populate('owner').exec();
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
          ['active', 'pending'].includes(membership.membershipStatus)
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

    // Combine and deduplicate by _id
    const allGyms = [...ownedGyms, ...memberGyms];
    const uniqueGyms = Array.from(
      new Map(allGyms.map((gym) => [gym._id.toString(), gym])).values(),
    );

    return uniqueGyms;
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

    // Update the gym with new settings
    const updatedGym = await this.gymModel
      .findByIdAndUpdate(id, { settings: updatedSettings }, { new: true })
      .populate('owner')
      .exec();

    return updatedGym;
  }

  async remove(id: string) {
    const deletedGym = await this.gymModel.findByIdAndDelete(id).exec();
    if (!deletedGym) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }
    return deletedGym;
  }
}
