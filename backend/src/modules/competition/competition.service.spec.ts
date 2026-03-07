import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications/notifications.service';
import { CompetitionService } from './competition.service';

describe('CompetitionService', () => {
  let service: CompetitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionService,
        {
          provide: getModelToken('CompetitionModel'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: { findById: jest.fn() },
        },
        {
          provide: getModelToken('GymMembership'),
          useValue: { find: jest.fn() },
        },
        {
          provide: NotificationsService,
          useValue: { notifyUser: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CompetitionService>(CompetitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
