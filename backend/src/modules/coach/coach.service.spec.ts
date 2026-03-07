import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications/notifications.service';
import { SessionsService } from '../sessions/sessions.service';
import { TrainingService } from '../training/training.service';
import { CoachService } from './coach.service';

describe('CoachService', () => {
  let service: CoachService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachService,
        {
          provide: getModelToken('CoachRequest'),
          useValue: { find: jest.fn(), findById: jest.fn() },
        },
        {
          provide: getModelToken('User'),
          useValue: { find: jest.fn(), findById: jest.fn() },
        },
        {
          provide: NotificationsService,
          useValue: { notifyUser: jest.fn() },
        },
        {
          provide: TrainingService,
          useValue: { find: jest.fn() },
        },
        {
          provide: SessionsService,
          useValue: { find: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CoachService>(CoachService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
