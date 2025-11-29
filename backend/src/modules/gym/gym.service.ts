import { CreateGymDto } from '@ahmedrioueche/gympro-client';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../common/schemas/user.schema';
import { GymModel } from './gym.schema';

@Injectable()
export class GymService {
  constructor(
    @InjectModel(GymModel.name) private gymModel: Model<GymModel>,
    @InjectModel(User.name) private userModel: Model<User>,
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

    const createdGym = new this.gymModel(createGymDto);
    await createdGym.save();

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
    return query.exec();
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

  async remove(id: string) {
    const deletedGym = await this.gymModel.findByIdAndDelete(id).exec();
    if (!deletedGym) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }
    return deletedGym;
  }
}
