import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ProgramHistoryModel,
  TrainingProgramModel,
} from '../training/training.schema';
import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  let service: ProgressService;
  let historyModel: any;
  let programModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: getModelToken(ProgramHistoryModel.name),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getModelToken(TrainingProgramModel.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
    historyModel = module.get(getModelToken(ProgramHistoryModel.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStats', () => {
    it('should return stats with zero values when no history', async () => {
      historyModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.getStats('user1');
      expect(result.totalWorkouts).toBe(0);
      expect(result.totalVolumeKg).toBe(0);
      expect(result.currentStreak).toBe(0);
    });

    it('should calculate stats from history', async () => {
      const mockHistory = [
        {
          userId: 'user1',
          status: 'active',
          program: { _id: 'prog1' },
          progress: {
            dayLogs: [
              {
                date: new Date().toISOString(),
                dayName: 'Push',
                durationMinutes: 60,
                exercises: [
                  {
                    sets: [
                      { weight: 100, reps: 10, completed: true },
                      { weight: 100, reps: 8, completed: true },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ];

      historyModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockHistory),
      });

      const result = await service.getStats('user1');
      expect(result.totalWorkouts).toBe(1);
      expect(result.totalVolumeKg).toBe(1800); // 100*10 + 100*8
      expect(result.totalDurationMinutes).toBe(60);
    });
  });

  describe('getHistory', () => {
    it('should return aggregated daily activity', async () => {
      const today = new Date().toISOString();
      historyModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          {
            progress: {
              dayLogs: [
                {
                  date: today,
                  durationMinutes: 45,
                  exercises: [
                    { sets: [{ weight: 50, reps: 10, completed: true }] },
                  ],
                },
              ],
            },
          },
        ]),
      });

      const result = await service.getHistory('user1');
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].workoutCount).toBe(1);
    });

    it('should return empty array when no history', async () => {
      historyModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.getHistory('user1');
      expect(result).toEqual([]);
    });
  });

  describe('calculateStreaks', () => {
    it('should return 0 for empty dates', () => {
      const result = (service as any).calculateStreaks([]);
      expect(result.currentStreak).toBe(0);
      expect(result.bestStreak).toBe(0);
    });

    it('should calculate consecutive day streaks', () => {
      const today = new Date();
      const dates: string[] = [];
      for (let i = 0; i < 5; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }

      const result = (service as any).calculateStreaks(dates);
      expect(result.bestStreak).toBeGreaterThanOrEqual(5);
      expect(result.currentStreak).toBeGreaterThanOrEqual(5);
    });
  });
});
