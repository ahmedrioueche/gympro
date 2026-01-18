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
      // Use text search with the text index for better performance
      query.$text = { $search: filters.search };
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
    const updatedProgram = await program.save();

    // Update the program in any active/paused history for this user
    await this.historyModel.updateMany(
      {
        userId,
        'program._id': id,
        status: { $in: ['active', 'paused'] },
      },
      {
        $set: { program: updatedProgram.toObject() },
      },
    );

    return updatedProgram;
  }

  async startProgram(
    programId: string,
    userId: string,
    force: boolean = false,
  ): Promise<ProgramHistory> {
    const activeProgram = await this.historyModel
      .findOne({ userId, status: 'active' })
      .exec();

    if (activeProgram) {
      if (!force) {
        throw new BadRequestException(
          'Cannot start new program while another is active. Please pause the current program first.',
        );
      }
      // If forced, abandon previous program
      activeProgram.status = 'abandoned';
      activeProgram.progress.endDate = new Date();
      await activeProgram.save();
    }

    const program = await this.findProgramById(programId);

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

  async pauseProgram(userId: string): Promise<ProgramHistory> {
    const activeProgram = await this.historyModel
      .findOne({ userId, status: 'active' })
      .exec();

    if (!activeProgram) {
      throw new BadRequestException('No active program to pause');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastPause = activeProgram.lastPauseDate
      ? new Date(activeProgram.lastPauseDate)
      : null;
    if (lastPause) lastPause.setHours(0, 0, 0, 0);

    let pausesToday = activeProgram.pausesToday || 0;

    // Reset counter if new day
    if (!lastPause || lastPause.getTime() < today.getTime()) {
      pausesToday = 0;
    }

    if (pausesToday >= 2) {
      throw new BadRequestException(
        'Daily pause limit reached (2 pauses per day)',
      );
    }

    activeProgram.status = 'paused';
    activeProgram.pausesToday = pausesToday + 1;
    activeProgram.lastPauseDate = new Date();

    return activeProgram.save();
  }

  async resumeProgram(userId: string): Promise<ProgramHistory> {
    const pausedProgram = await this.historyModel
      .findOne({ userId, status: 'paused' })
      .exec();

    if (!pausedProgram) {
      throw new BadRequestException('No paused program found');
    }

    // Ensure no other program is active (though UI should prevent this)
    const activeProgram = await this.historyModel
      .findOne({ userId, status: 'active' })
      .exec();

    if (activeProgram) {
      throw new BadRequestException(
        'Cannot resume while another program is active',
      );
    }

    pausedProgram.status = 'active';
    return pausedProgram.save();
  }

  async getActiveProgram(userId: string): Promise<ProgramHistory | null> {
    // Return either active or paused so user can see state
    return this.historyModel
      .findOne({ userId, status: { $in: ['active', 'paused'] } })
      .exec();
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
      throw new BadRequestException('No active session found for this program');
    }

    // Check for existing session on same date + dayName
    const existingIndex = history.progress.dayLogs.findIndex((log) => {
      const logDate = new Date(log.date).toISOString().split('T')[0];
      const newDate = new Date(dto.date).toISOString().split('T')[0];
      return logDate === newDate && log.dayName === dto.dayName;
    });

    if (existingIndex >= 0) {
      // Update existing
      history.progress.dayLogs[existingIndex].exercises = dto.exercises;
      if (dto.notes) history.progress.dayLogs[existingIndex].notes = dto.notes;
    } else {
      // Add new day log
      history.progress.dayLogs.push({
        dayName: dto.dayName,
        date: dto.date,
        exercises: dto.exercises,
        notes: dto.notes,
      });
    }

    return history.save();
  }

  async addComment(
    programId: string,
    userId: string,
    userName: string,
    userImage: string | undefined,
    text: string,
    rating: number,
  ): Promise<TrainingProgram> {
    const program = await this.programModel.findById(programId).exec();
    if (!program) {
      throw new NotFoundException('Program not found');
    }

    // Initialize comments if undefined (for old records)
    if (!program.comments) {
      program.comments = [];
    }

    // Add new comment
    program.comments.push({
      userId,
      userName,
      userImage,
      text,
      rating,
      createdAt: new Date(),
    });

    // Recalculate average rating
    const totalRatingSum = program.comments.reduce(
      (sum, comment) => sum + comment.rating,
      0,
    );
    program.totalRatings = program.comments.length;
    program.averageRating = Number(
      (totalRatingSum / program.totalRatings).toFixed(1),
    );

    return program.save();
  }
}
