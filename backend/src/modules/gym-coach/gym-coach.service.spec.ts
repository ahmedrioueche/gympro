import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications/notifications.service';
import { SessionsService } from '../sessions/sessions.service';
import { MembershipService } from '../gym-membership/membership.service';
import { GymCoachService } from './gym-coach.service';

describe('GymCoachService', () => {
  let service: GymCoachService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GymCoachService,
        {
          provide: getModelToken('GymCoachAffiliation'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: { findById: jest.fn() },
        },
        {
          provide: getModelToken('GymModel'),
          useValue: { findById: jest.fn(), findOne: jest.fn() },
        },
        {
          provide: getModelToken('GymMembership'),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getModelToken('SessionModel'),
          useValue: { find: jest.fn() },
        },
        {
          provide: NotificationsService,
          useValue: { notifyUser: jest.fn() },
        },
        {
          provide: SessionsService,
          useValue: { find: jest.fn() },
        },
        {
          provide: MembershipService,
          useValue: { createMember: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<GymCoachService>(GymCoachService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
