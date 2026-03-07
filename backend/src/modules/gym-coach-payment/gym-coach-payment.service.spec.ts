import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GymCoachPaymentService } from './gym-coach-payment.service';

describe('GymCoachPaymentService', () => {
  let service: GymCoachPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GymCoachPaymentService,
        {
          provide: getModelToken('GymCoachPayment'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            countDocuments: jest.fn(),
            aggregate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GymCoachPaymentService>(GymCoachPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
