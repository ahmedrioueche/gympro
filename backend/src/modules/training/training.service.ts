import {
  CreateProgramDto,
  LogSessionDto,
  ProgramHistory,
  SessionTimerResponse,
  SyncSessionTimerDto,
  TrainingProgram,
  computeDurationMinutes,
  createSessionTimer,
  closeSessionTimer,
  isSessionTimerRunning,
  materializeSessionTimer,
  MAX_SESSION_SECONDS,
  pauseSessionTimer,
  resumeSessionTimer,
  sanitizeProgramPayload,
  snapshotToState,
  stateToSnapshot,
  touchSessionTimer,
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
      ...sanitizeProgramPayload(dto),
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
      excludeCreatedBy?: string;
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
    if (filters.excludeCreatedBy) {
      query.createdBy = { $ne: filters.excludeCreatedBy };
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

    Object.assign(
      program,
      sanitizeProgramPayload(dto),
      { updatedAt: new Date(), updatedBy: userId },
    );
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
    const currentProgram = await this.historyModel
      .findOne({ userId, status: { $in: ['active', 'paused'] } })
      .exec();

    if (currentProgram) {
      if (!force) {
        throw new BadRequestException(
          'Cannot start new program while another is active or paused. Please complete or archive the current program first.',
        );
      }
      // If forced, abandon previous program
      currentProgram.status = 'abandoned';
      currentProgram.progress.endDate = new Date();
      await currentProgram.save();
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
        totalDays: program.daysPerWeek * ((program as any).durationWeeks || 12),
        dayLogs: [],
      },
    });

    return history.save();
  }

  async abandonProgram(userId: string): Promise<ProgramHistory> {
    const currentProgram = await this.historyModel
      .findOne({ userId, status: { $in: ['active', 'paused'] } })
      .exec();

    if (!currentProgram) {
      throw new BadRequestException(
        'No active or paused program found to archive.',
      );
    }

    currentProgram.status = 'abandoned';
    currentProgram.progress.endDate = new Date();
    return currentProgram.save();
  }

  async getActiveProgram(userId: string): Promise<ProgramHistory | null> {
    // Return either active or paused so user can see state
    // Prioritize 'active' status, then newest
    return this.historyModel
      .findOne({ userId, status: { $in: ['active', 'paused'] } })
      .sort({ status: 1, createdAt: -1 }) // 'active' < 'paused', so active comes first
      .exec();
  }

  async resumeHistory(
    historyId: string,
    userId: string,
  ): Promise<ProgramHistory> {
    const ongoing = await this.historyModel
      .findOne({ userId, status: { $in: ['active', 'paused'] } })
      .exec();

    if (ongoing) {
      throw new BadRequestException(
        'Cannot resume a program while another is active. Please archive the current one first.',
      );
    }

    const history = await this.historyModel
      .findOne({ _id: historyId, userId })
      .exec();

    if (!history) {
      throw new NotFoundException('Program history not found.');
    }

    history.status = 'active';
    history.progress.endDate = undefined;
    return history.save();
  }

  async getHistory(userId: string): Promise<ProgramHistory[]> {
    return this.historyModel
      .find({ userId })
      .sort({ 'progress.endDate': -1, 'progress.startDate': -1 })
      .exec();
  }

  private findDayLogIndex(
    history: ProgramHistoryModel,
    sessionId?: string,
    submissionId?: string,
  ): number {
    if (submissionId) {
      const bySubmission = history.progress.dayLogs.findIndex(
        (log) => (log as any).submissionId === submissionId,
      );
      if (bySubmission >= 0) return bySubmission;
    }
    if (sessionId) {
      return history.progress.dayLogs.findIndex(
        (log) => (log as any)._id?.toString() === sessionId,
      );
    }
    return -1;
  }

  async syncSessionTimer(
    userId: string,
    dto: SyncSessionTimerDto,
  ): Promise<SessionTimerResponse> {
    const history = await this.historyModel.findOne({
      userId,
      'program._id': dto.programId,
      status: 'active',
    });

    if (!history) {
      throw new BadRequestException('No active session found for this program');
    }

    const now = Date.now();
    const dayLogIndex = this.findDayLogIndex(
      history,
      dto.sessionId,
      dto.submissionId,
    );

    const seedRunningTimer = (dayLog?: { date?: string }) => {
      const seed = dto.seedElapsedSeconds;
      if (typeof seed === 'number' && Number.isFinite(seed) && seed >= 0) {
        return createSessionTimer(
          Math.min(Math.floor(seed), MAX_SESSION_SECONDS),
          now,
        );
      }
      if (dayLog?.date) {
        const startMs = Date.parse(dayLog.date);
        if (Number.isFinite(startMs)) {
          const wall = Math.min(
            MAX_SESSION_SECONDS,
            Math.max(0, Math.floor((now - startMs) / 1000)),
          );
          return createSessionTimer(wall, now);
        }
      }
      return createSessionTimer(0, now);
    };

    // No day log yet — never invent a fresh zero timer that would wipe the
    // client's running clock on keepalive. Ephemeral `start` may seed locally.
    if (dayLogIndex < 0) {
      if (dto.action === 'start') {
        const snapshot = seedRunningTimer();
        return {
          sessionTimer: snapshotToState(snapshot),
          durationMinutes: computeDurationMinutes(snapshot, now),
        };
      }
      return {
        sessionTimer: null,
        durationMinutes: 0,
      };
    }

    const dayLog = history.progress.dayLogs[dayLogIndex] as any;
    const hasPersistedTimer = Boolean(dayLog?.sessionTimer);

    let snapshot = hasPersistedTimer
      ? materializeSessionTimer(stateToSnapshot(dayLog.sessionTimer), now)
      : seedRunningTimer(dayLog);

    switch (dto.action) {
      case 'start':
        if (!hasPersistedTimer) {
          // Already seeded above — first attach to the day log.
        } else if (!isSessionTimerRunning(snapshot)) {
          snapshot = resumeSessionTimer(snapshot, now);
        } else {
          snapshot = touchSessionTimer(snapshot, now);
        }
        break;
      case 'touch':
        if (!hasPersistedTimer) {
          // Already seeded — persist on first touch after autosave.
        } else if (isSessionTimerRunning(snapshot)) {
          snapshot = touchSessionTimer(snapshot, now);
        } else {
          snapshot = resumeSessionTimer(snapshot, now);
        }
        break;
      case 'sync':
        break;
      case 'close':
        snapshot = closeSessionTimer(
          hasPersistedTimer
            ? stateToSnapshot(dayLog.sessionTimer)
            : snapshot,
          now,
        );
        break;
      case 'stop':
        snapshot = pauseSessionTimer(snapshot, now);
        break;
      default:
        throw new BadRequestException('Invalid timer action');
    }

    dayLog.sessionTimer = snapshotToState(snapshot);
    dayLog.durationMinutes = computeDurationMinutes(snapshot, now);

    await history.save();

    return {
      sessionTimer: dayLog.sessionTimer,
      durationMinutes: dayLog.durationMinutes,
      sessionId: dayLog._id?.toString(),
    };
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

    // Match sessions using multiple strategies to prevent duplicates
    const sessionId = (dto as any).sessionId;
    const submissionId = (dto as any).submissionId;
    let existingIndex = this.findDayLogIndex(history, sessionId, submissionId);

    console.log(
      '[LogSession] submissionId:',
      submissionId,
      'existingIndex:',
      existingIndex,
      'dayLogs count:',
      history.progress.dayLogs.length,
    );

    if (existingIndex >= 0) {
      // Update existing
      console.log('[LogSession] UPDATING existing log at index', existingIndex);
      const dayLog = history.progress.dayLogs[existingIndex] as any;
      dayLog.exercises = dto.exercises;
      dayLog.dayName = dto.dayName;
      // Keep original session start — do not overwrite on autosave/edit.

      // Never pause on autosave/update — only materialize idle cutoff.
      // Done/stop is handled by syncSessionTimer("stop") before logSession.
      if (dayLog.sessionTimer) {
        const materialized = materializeSessionTimer(
          stateToSnapshot(dayLog.sessionTimer),
        );
        dayLog.sessionTimer = snapshotToState(materialized);
        dayLog.durationMinutes = computeDurationMinutes(materialized);
      } else if (dto.durationMinutes) {
        dayLog.durationMinutes = dto.durationMinutes;
      }

      if (dto.notes) dayLog.notes = dto.notes;
      // Update submissionId if not set (migration)
      if (submissionId && !dayLog.submissionId) {
        dayLog.submissionId = submissionId;
      }
    } else {
      // Add new day log
      console.log('[LogSession] CREATING new log');
      history.progress.dayLogs.push({
        dayName: dto.dayName,
        date: dto.date,
        durationMinutes: dto.durationMinutes,
        exercises: dto.exercises,
        notes: dto.notes,
        submissionId: submissionId,
      } as any);
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
  async countPrograms(userId: string): Promise<number> {
    return this.programModel.countDocuments({ createdBy: userId });
  }

  async deleteSession(
    userId: string,
    programId: string,
    sessionId: string,
  ): Promise<ProgramHistory> {
    const history = await this.historyModel
      .findOne({
        userId,
        'program._id': programId,
        status: { $in: ['active', 'paused'] },
      })
      .sort({ status: 1, createdAt: -1 });

    if (!history) {
      throw new BadRequestException('No active session found for this program');
    }

    const initialLength = history.progress.dayLogs.length;

    history.progress.dayLogs = history.progress.dayLogs.filter(
      (log: any) =>
        log._id?.toString() !== sessionId && log.submissionId !== sessionId,
    );

    if (history.progress.dayLogs.length === initialLength) {
      throw new NotFoundException('Session not found');
    }

    return history.save();
  }
}
