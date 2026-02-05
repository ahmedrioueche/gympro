import {
  CompetitionQueryDto,
  CreateCompetitionDto,
  UpdateCompetitionDto,
} from '@ahmedrioueche/gympro-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompetitionModel } from './competition.schema';

@Injectable()
export class CompetitionService {
  constructor(
    @InjectModel(CompetitionModel.name)
    private competitionModel: Model<CompetitionModel>,
  ) {}

  async findAll(
    gymId: string,
    options: CompetitionQueryDto = {},
  ): Promise<{
    data: CompetitionModel[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search, type, status, page = 1, limit = 12 } = options;
    const skip = (page - 1) * limit;

    const query: any = { gymId };

    if (search && search.trim()) {
      query.$or = [
        { title: new RegExp(search.trim(), 'i') },
        { description: new RegExp(search.trim(), 'i') },
      ];
    }

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    const [data, total] = await Promise.all([
      this.competitionModel
        .find(query)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.competitionModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<CompetitionModel> {
    const competition = await this.competitionModel.findById(id).exec();
    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }
    return competition;
  }

  async create(
    gymId: string,
    dto: CreateCompetitionDto,
    userId: string,
  ): Promise<CompetitionModel> {
    const newCompetition = new this.competitionModel({
      ...dto,
      gymId,
      createdBy: userId,
      participantCount: 0,
    });
    return newCompetition.save();
  }

  async update(
    id: string,
    dto: UpdateCompetitionDto,
    userId: string,
  ): Promise<CompetitionModel> {
    const updatedCompetition = await this.competitionModel
      .findByIdAndUpdate(
        id,
        {
          ...dto,
          updatedBy: userId,
        },
        { new: true },
      )
      .exec();

    if (!updatedCompetition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }
    return updatedCompetition;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const result = await this.competitionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }
    return { success: true };
  }
}
