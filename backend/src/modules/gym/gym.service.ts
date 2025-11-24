import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GymModel } from './gym.schema';

@Injectable()
export class GymService {
    constructor(@InjectModel(GymModel.name) private gymModel: Model<GymModel>) { }

    async create(createGymDto: any) {
        const createdGym = new this.gymModel(createGymDto);
        return createdGym.save();
    }

    async findAll() {
        return this.gymModel.find().exec();
    }

    async findOne(id: string) {
        const gym = await this.gymModel.findById(id).exec();
        if (!gym) {
            throw new NotFoundException(`Gym with ID ${id} not found`);
        }
        return gym;
    }

    async update(id: string, updateGymDto: any) {
        const updatedGym = await this.gymModel
            .findByIdAndUpdate(id, updateGymDto, { new: true })
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
