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

  async findAllExercises(filters: ExerciseFilters = {}): Promise<Exercise[]> {
    const query: any = {};
    const andCriteria: any[] = [];

    // Filter by public exercises or user's own exercises
    if (filters.myExercises && filters.createdBy) {
      andCriteria.push({ createdBy: filters.createdBy });
    } else if (!filters.myExercises) {
      const visibilityOr: any[] = [{ isPublic: true }];
      if (filters.createdBy) {
        visibilityOr.push({ createdBy: filters.createdBy });
      }
      andCriteria.push({ $or: visibilityOr });
    }

    // Search by name or muscle (partial match)
    if (filters.search) {
      const searchRegex = { $regex: filters.search, $options: 'i' };
      andCriteria.push({
        $or: [{ name: searchRegex }, { targetMuscles: searchRegex }],
      });
    }

    // Filter by target muscle (exact match)
    if (filters.targetMuscle) {
      andCriteria.push({ targetMuscles: filters.targetMuscle });
    }

    // Filter by equipment
    if (filters.equipment) {
      andCriteria.push({
        equipment: { $regex: filters.equipment, $options: 'i' },
      });
    }

    // Filter by difficulty
    if (filters.difficulty) {
      andCriteria.push({ difficulty: filters.difficulty });
    }

    // Filter by type
    if (filters.type) {
      andCriteria.push({ type: filters.type });
    }

    if (andCriteria.length > 0) {
      query.$and = andCriteria;
    }

    return this.exerciseModel.find(query).sort({ createdAt: -1 }).exec();
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

    // Only creator can edit
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

    // Only creator can delete
    if (exercise.createdBy !== userId) {
      throw new BadRequestException('You can only delete your own exercises');
    }

    await this.exerciseModel.findByIdAndDelete(id).exec();
  }
}
