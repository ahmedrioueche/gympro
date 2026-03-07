import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GymCoachPaymentService } from '../gym-coach-payment/gym-coach-payment.service';
import { GymCoachService } from '../gym-coach/gym-coach.service';
import { SessionsService } from './sessions.service';

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getModelToken('SessionModel'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            insertMany: jest.fn(),
            findOne: jest.fn(),
            updateMany: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: { findById: jest.fn(), find: jest.fn() },
        },
        {
          provide: getModelToken('GymMembership'),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getModelToken('SubscriptionTypeModel'),
          useValue: { findById: jest.fn() },
        },
        {
          provide: GymCoachService,
          useValue: { validateFacility: jest.fn(), findAffiliation: jest.fn() },
        },
        {
          provide: GymCoachPaymentService,
          useValue: { create: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
