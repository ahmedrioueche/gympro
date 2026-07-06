import type {
  CreateExerciseDto,
  Exercise,
  ExerciseFilters,
} from '@ahmedrioueche/gympro-client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExerciseModel } from './exercises.schema';

export interface PaginatedExercisesResult {
  data: Exercise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(ExerciseModel.name)
    private exerciseModel: Model<ExerciseModel>,
  ) {}

  async createExercise(
    dto: CreateExerciseDto,
    userId: string,
  ): Promise<Exercise> {
    const exercise = new this.exerciseModel({
      ...dto,
      createdBy: userId,
    });
    return exercise.save();
  }

  private buildExerciseQuery(filters: ExerciseFilters = {}) {
    const query: any = {};
    const andCriteria: any[] = [];

    if (filters.myExercises && filters.createdBy) {
      andCriteria.push({ createdBy: filters.createdBy });
    } else if (!filters.myExercises) {
      const visibilityOr: any[] = [{ isPublic: true }];
      if (filters.createdBy) {
        visibilityOr.push({ createdBy: filters.createdBy });
      }
      andCriteria.push({ $or: visibilityOr });
    }

    if (filters.search) {
      const searchRegex = { $regex: filters.search, $options: 'i' };
      andCriteria.push({
        $or: [{ name: searchRegex }, { targetMuscles: searchRegex }],
      });
    }

    if (filters.targetMuscle) {
      andCriteria.push({ targetMuscles: filters.targetMuscle });
    }

    if (filters.equipment) {
      andCriteria.push({
        equipment: { $regex: filters.equipment, $options: 'i' },
      });
    }

    if (filters.difficulty) {
      andCriteria.push({ difficulty: filters.difficulty });
    }

    if (filters.type) {
      andCriteria.push({ type: filters.type });
    }

    if (andCriteria.length > 0) {
      query.$and = andCriteria;
    }

    return query;
  }

  async findAllExercises(
    filters: ExerciseFilters = {},
  ): Promise<PaginatedExercisesResult> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 12));
    const skip = (page - 1) * limit;
    const query = this.buildExerciseQuery(filters);

    const [data, total] = await Promise.all([
      this.exerciseModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.exerciseModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findExerciseById(id: string): Promise<Exercise> {
    const exercise = await this.exerciseModel.findById(id).exec();
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }
    return exercise;
  }

  async updateExercise(
    id: string,
    dto: Partial<CreateExerciseDto>,
    userId: string,
  ): Promise<Exercise> {
    const exercise = await this.exerciseModel.findById(id).exec();
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    if (exercise.createdBy !== userId) {
      throw new BadRequestException('You can only edit your own exercises');
    }

    Object.assign(exercise, dto, { updatedBy: userId });
    return exercise.save();
  }

  async deleteExercise(id: string, userId: string): Promise<void> {
    const exercise = await this.exerciseModel.findById(id).exec();
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    if (exercise.createdBy !== userId) {
      throw new BadRequestException('You can only delete your own exercises');
    }

    await this.exerciseModel.findByIdAndDelete(id).exec();
  }
}
