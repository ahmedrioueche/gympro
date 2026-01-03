import {
  CreateProgramDto,
  LogSessionDto,
  ProgramHistory,
  TrainingProgram,
} from '@ahmedrioueche/gympro-client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProgramHistoryModel, TrainingProgramModel } from './training.schema';

@Injectable()
export class TrainingService {
  constructor(
    @InjectModel(TrainingProgramModel.name)
    private programModel: Model<TrainingProgramModel>,
    @InjectModel(ProgramHistoryModel.name)
    private historyModel: Model<ProgramHistoryModel>,
  ) {}

  async createProgram(
    dto: CreateProgramDto,
    userId: string,
  ): Promise<TrainingProgram> {
    const program = new this.programModel({
      ...dto,
      creationType: 'member',
      createdBy: userId,
      createdAt: new Date(),
    });
    return program.save();
  }

  async findAllPrograms(
    filters: {
      source?: string;
      createdBy?: string;
      search?: string;
    } = {},
  ): Promise<TrainingProgram[]> {
    const query: any = {};

    if (filters.source) {
      query.creationType = filters.source;
    }
    if (filters.createdBy) {
      query.createdBy = filters.createdBy;
    }
    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    return this.programModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findProgramById(id: string): Promise<TrainingProgram> {
    const program = await this.programModel.findById(id).exec();
    if (!program) {
      throw new NotFoundException('Program not found');
    }
    return program;
  }

  async updateProgram(
    id: string,
    dto: Partial<CreateProgramDto>,
    userId: string,
  ): Promise<TrainingProgram> {
    const program = await this.programModel.findById(id).exec();
    if (!program) {
      throw new NotFoundException('Program not found');
    }

    // Only allow updating own member-created programs
    if (program.creationType !== 'member' || program.createdBy !== userId) {
      throw new BadRequestException('You can only edit your own programs');
    }

    Object.assign(program, dto, { updatedAt: new Date(), updatedBy: userId });
    return program.save();
  }

  async startProgram(
    programId: string,
    userId: string,
  ): Promise<ProgramHistory> {
    const program = await this.findProgramById(programId);

    // Deactivate current active program if any for this user
    await this.historyModel.updateMany(
      { userId, status: 'active' },
      { $set: { status: 'abandoned', 'progress.endDate': new Date() } },
    );

    const history = new this.historyModel({
      userId,
      program: program,
      status: 'active',
      progress: {
        programId: program._id,
        startDate: new Date(),
        daysCompleted: 0,
        totalDays: program.days.length * 4, // Approx 4 weeks
        dayLogs: [],
      },
    });

    return history.save();
  }

  async getActiveProgram(userId: string): Promise<ProgramHistory | null> {
    return this.historyModel.findOne({ userId, status: 'active' }).exec();
  }

  async getHistory(userId: string): Promise<ProgramHistory[]> {
    return this.historyModel
      .find({ userId })
      .sort({ 'progress.endDate': -1, 'progress.startDate': -1 })
      .exec();
  }

  async logSession(
    userId: string,
    dto: LogSessionDto,
  ): Promise<ProgramHistory> {
    const history = await this.historyModel.findOne({
      userId,
      'program._id': dto.programId,
      status: 'active',
    });

    if (!history) {
      // If no active history for this program, check if we should create one or error?
      // For now, require active program.
      throw new BadRequestException('No active session found for this program');
    }

    // Add day log
    history.progress.dayLogs.push({
      dayName: dto.dayName,
      date: dto.date,
      exercises: dto.exercises,
      notes: dto.notes,
    });

    // Update days completed if unique day?
    // Simplified logic: just increment for now or calc based on unique dates

    return history.save();
  }
}
