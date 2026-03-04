import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TrainingService } from './training.service';

describe('TrainingService', () => {
  let service: TrainingService;
  let historyModel: any;

  const mockHistory = {
    userId: 'user123',
    program: { _id: 'prog123' },
    status: 'active',
    progress: {
      dayLogs: [],
      save: jest.fn().mockResolvedValue(true),
    },
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingService,
        {
          provide: getModelToken('ProgramHistory'), // Use real model name
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getModelToken('TrainingProgram'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TrainingService>(TrainingService);
    historyModel = module.get(getModelToken('ProgramHistory'));
  });

  describe('logSession', () => {
    it('should create a new log entry when no duplicate is found', async () => {
      historyModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockHistory),
      });

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
    });

    it('should update existing entry when submissionId matches', async () => {
      const existingHistory = {
        ...mockHistory,
        progress: {
          dayLogs: [{ submissionId: 'same-id', exercises: [], dayName: 'Old' }],
        },
        save: jest.fn().mockResolvedValue(true),
      };

      historyModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingHistory),
      });

      const dto = {
        programId: 'prog123',
        dayName: 'New Push',
        date: new Date().toISOString(),
        exercises: [{ exerciseId: 'ex1', sets: [] }],
        submissionId: 'same-id',
      };

      await service.logSession('user123', dto as any);

      expect(existingHistory.progress.dayLogs.length).toBe(1);
      expect(existingHistory.progress.dayLogs[0].dayName).toBe('New Push');
      expect(existingHistory.progress.dayLogs[0].exercises.length).toBe(1);
    });
  });
});
