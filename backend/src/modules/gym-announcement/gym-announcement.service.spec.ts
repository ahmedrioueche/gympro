import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MembershipService } from '../gym-membership/membership.service';
import { NotificationsService } from '../notifications/notifications.service';
import { GymAnnouncementService } from './gym-announcement.service';

describe('GymAnnouncementService', () => {
  let service: GymAnnouncementService;
  let model: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GymAnnouncementService,
        {
          provide: getModelToken('GymAnnouncementModel'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            create: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: getModelToken('GymModel'),
          useValue: { findById: jest.fn() },
        },
        {
          provide: MembershipService,
          useValue: {
            findAllActiveMembers: jest.fn(),
            findAllStaff: jest.fn(),
          },
        },
        {
          provide: NotificationsService,
          useValue: { notifyUser: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<GymAnnouncementService>(GymAnnouncementService);
    model = module.get(getModelToken('GymAnnouncementModel'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
