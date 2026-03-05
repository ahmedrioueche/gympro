import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ProgramHistoryModel, TrainingProgramModel } from './training.schema';
import { TrainingService } from './training.service';

describe('TrainingService', () => {
  let service: TrainingService;
  let historyModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingService,
        {
          provide: getModelToken(ProgramHistoryModel.name),
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getModelToken(TrainingProgramModel.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TrainingService>(TrainingService);
    historyModel = module.get(getModelToken(ProgramHistoryModel.name));
  });

  describe('logSession', () => {
    it('should create a new log entry when no duplicate is found', async () => {
      const mockHistory = {
        userId: 'user123',
        program: { _id: 'prog123' },
        status: 'active',
        progress: {
          dayLogs: [] as any[],
        },
        save: jest.fn().mockResolvedValue(true),
      };

      // findOne returns the document directly (no .exec())
      historyModel.findOne.mockResolvedValue(mockHistory);

      const dto = {
        programId: 'prog123',
        dayName: 'Push',
        date: new Date().toISOString(),
        exercises: [],
        submissionId: 'new-id',
      };

      await service.logSession('user123', dto as any);

      expect(mockHistory.progress.dayLogs.length).toBe(1);
      expect(mockHistory.progress.dayLogs[0].submissionId).toBe('new-id');
      expect(mockHistory.save).toHaveBeenCalled();
    });

    it('should update existing entry when submissionId matches', async () => {
      const mockHistory = {
        userId: 'user123',
        program: { _id: 'prog123' },
        status: 'active',
        progress: {
          dayLogs: [{ submissionId: 'same-id', exercises: [], dayName: 'Old' }],
        },
        save: jest.fn().mockResolvedValue(true),
      };

      historyModel.findOne.mockResolvedValue(mockHistory);

      const dto = {
        programId: 'prog123',
        dayName: 'New Push',
        date: new Date().toISOString(),
        exercises: [{ exerciseId: 'ex1', sets: [] }],
        submissionId: 'same-id',
      };

      await service.logSession('user123', dto as any);

      expect(mockHistory.progress.dayLogs.length).toBe(1);
      expect(mockHistory.progress.dayLogs[0].dayName).toBe('New Push');
      expect(mockHistory.progress.dayLogs[0].exercises.length).toBe(1);
      expect(mockHistory.save).toHaveBeenCalled();
    });
  });
});
