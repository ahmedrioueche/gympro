import { UserRole } from '@ahmedrioueche/gympro-client';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppSubscriptionService } from '../app-billing/subscription/subscription.service';
import * as subUtil from '../app-billing/subscription/subscription.util';
import { AffiliationStatus } from '../gym-coach/schemas/gym-coach-affiliation.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { GymService } from './gym.service';

describe('GymService', () => {
  let service: GymService;
  let gymModel: any;
  let userModel: any;
  let membershipModel: any;
  let affiliationModel: any;
  let notificationsService: any;
  let appSubscriptionService: any;

  beforeEach(async () => {
    gymModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      countDocuments: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      aggregate: jest.fn(),
      distinct: jest.fn(),
      save: jest.fn(),
    };

    // Correctly mock the constructor behavior for 'new this.gymModel'
    const mockGymInstance = {
      ...gymModel,
      _id: new Types.ObjectId(),
      save: jest.fn().mockResolvedValue(true),
      populate: jest.fn().mockReturnThis(),
      toObject: jest.fn().mockReturnValue({}),
    };
    
    const GymModelMock = jest.fn().mockImplementation(() => mockGymInstance);
    Object.assign(GymModelMock, gymModel); // Attach static methods

    userModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      countDocuments: jest.fn(),
    };

    membershipModel = {
      find: jest.fn(),
      aggregate: jest.fn(),
      save: jest.fn(),
      countDocuments: jest.fn(),
    };
    const mockMembershipInstance = {
      ...membershipModel,
      _id: new Types.ObjectId(),
      save: jest.fn().mockResolvedValue(true),
    };
    const MembershipModelMock = jest.fn().mockImplementation(() => mockMembershipInstance);
    Object.assign(MembershipModelMock, membershipModel);

    affiliationModel = {
      find: jest.fn(),
    };

    notificationsService = {
      notifyUser: jest.fn(),
      notifyStaff: jest.fn().mockResolvedValue({}),
      notifyScheduleChange: jest.fn(),
      notifyGymClosureChange: jest.fn(),
    };

    appSubscriptionService = {
      getMySubscription: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GymService,
        {
          provide: getModelToken('GymModel'),
          useValue: GymModelMock,
        },
        {
          provide: getModelToken('User'),
          useValue: userModel,
        },
        {
          provide: getModelToken('GymMembership'),
          useValue: MembershipModelMock,
        },
        {
          provide: getModelToken('GymCoachAffiliation'),
          useValue: affiliationModel,
        },
        {
          provide: NotificationsService,
          useValue: notificationsService,
        },
        {
          provide: AppSubscriptionService,
          useValue: appSubscriptionService,
        },
      ],
    }).compile();

    service = module.get<GymService>(GymService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createGymDto = {
      name: 'Test Gym',
      owner: new Types.ObjectId().toString(),
      address: '123 Test St',
      city: 'Test City',
    };

    it('should throw ConflictException if gym limit reached', async () => {
      appSubscriptionService.getMySubscription.mockResolvedValue({});
      jest.spyOn(subUtil, 'calculateSubscriptionLimits').mockReturnValue({
        maxGyms: 1,
        maxMembersPerGym: 100,
        maxCoachesPerGym: 5,
        features: [],
      } as any);

      const GymModelMock = service['gymModel'] as any;
      GymModelMock.countDocuments.mockResolvedValue(1);

      await expect(service.create(createGymDto as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if gym with same name exists for owner', async () => {
      appSubscriptionService.getMySubscription.mockResolvedValue({});
      jest.spyOn(subUtil, 'calculateSubscriptionLimits').mockReturnValue({
        maxGyms: 5,
        maxMembersPerGym: 100,
        maxCoachesPerGym: 5,
        features: [],
      } as any);

      const GymModelMock = service['gymModel'] as any;
      GymModelMock.countDocuments.mockResolvedValue(1);
      GymModelMock.findOne.mockResolvedValue({ _id: 'existing' });

      await expect(service.create(createGymDto as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create a gym and owner membership', async () => {
      appSubscriptionService.getMySubscription.mockResolvedValue({});
      jest.spyOn(subUtil, 'calculateSubscriptionLimits').mockReturnValue({
        maxGyms: 5,
        maxMembersPerGym: 100,
        maxCoachesPerGym: 5,
        features: [],
      } as any);

      const GymModelMock = service['gymModel'] as any;
      GymModelMock.countDocuments.mockResolvedValue(1);
      GymModelMock.findOne.mockResolvedValue(null);

      const result = await service.create(createGymDto as any);

      expect(result).toBeDefined();
      expect(userModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(notificationsService.notifyStaff).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated gyms', async () => {
      const GymModelMock = service['gymModel'] as any;
      GymModelMock.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });
      
      const mockGym = { 
        _id: new Types.ObjectId(),
        toObject: () => ({ name: 'Test Gym' })
      };
      
      GymModelMock.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockGym]),
      });
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a gym if found', async () => {
      const mockGym = { 
        _id: new Types.ObjectId(),
        toObject: () => ({ name: 'Test Gym' })
      };
      const GymModelMock = service['gymModel'] as any;
      GymModelMock.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockGym),
      });

      const result = await service.findOne('id');
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if not found', async () => {
      const GymModelMock = service['gymModel'] as any;
      GymModelMock.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a gym', async () => {
      const mockGym = { 
        _id: new Types.ObjectId(),
        toObject: () => ({ name: 'Updated Gym' })
      };
      const GymModelMock = service['gymModel'] as any;
      GymModelMock.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockGym),
      });

      const result = await service.update('id', { name: 'Updated Gym' });
      expect(result.name).toBe('Updated Gym');
    });

    it('should throw NotFoundException if not found', async () => {
      gymModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.update('id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a gym', async () => {
      const gId = new Types.ObjectId();
      gymModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: gId }),
      });

      const result = await service.remove(gId.toString());
      expect(result._id).toEqual(gId);
    });

    it('should throw NotFoundException in remove if not found', async () => {
      gymModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.remove('id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUniqueCities', () => {
    it('should return distinct cities', async () => {
      const GymModelMock = service['gymModel'] as any;
      GymModelMock.distinct.mockResolvedValue(['City 1', 'City 2']);

      const result = await service.findUniqueCities();
      expect(result).toEqual(['City 1', 'City 2']);
    });
  });

  describe('findByOwner', () => {
    it('should return gyms for owner and update stats', async () => {
      const mockGymId = new Types.ObjectId();
      const mockGym = { 
        _id: mockGymId,
        toObject: () => ({ name: 'Test Gym' })
      };
      const GymModelMock = service['gymModel'] as any;
      GymModelMock.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockGym]),
      });
      GymModelMock.findById.mockResolvedValue(mockGym);
      GymModelMock.findByIdAndUpdate.mockResolvedValue(mockGym);

      membershipModel.aggregate.mockResolvedValue([{
        total: 10,
        withActiveSubscriptions: 5,
        withExpiredSubscriptions: 3,
        pendingApproval: 2
      }]);

      const result = await service.findByOwner('ownerId');
      expect(result).toHaveLength(1);
      expect(membershipModel.aggregate).toHaveBeenCalled();
    });
  });

  describe('findByMember', () => {
    it('should return gyms where user is a member', async () => {
      const mockGym = { _id: new Types.ObjectId(), toObject: () => ({}) };
      userModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          memberships: [{
            gym: mockGym,
            membershipStatus: 'active',
            roles: ['member']
          }]
        }),
      });

      const result = await service.findByMember('userId');
      expect(result).toHaveLength(1);
    });
  });

  describe('getGymMembers', () => {
    it('should return paginated members of a gym', async () => {
      const gId = new Types.ObjectId().toString();
      membershipModel.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([{ _id: 'm1' }]),
      });
      userModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });
      userModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([{ _id: 'u1', profile: {} }]),
      });

      const result = await service.getGymMembers(gId);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findAllForUser', () => {
    it('should combine and unique gyms from owner, member, coach and staff', async () => {
      const userId = new Types.ObjectId().toString();
      const gym1 = { _id: new Types.ObjectId(), name: 'Gym 1' };
      const gym2 = { _id: new Types.ObjectId(), name: 'Gym 2' };

      jest.spyOn(service, 'findByOwner').mockResolvedValue([gym1 as any]);
      jest.spyOn(service, 'findByMember').mockResolvedValue([gym2 as any]);
      jest.spyOn(service, 'findByCoach').mockResolvedValue([gym1 as any]);
      jest.spyOn(service, 'findByStaff').mockResolvedValue([]);

      const result = await service.findAllForUser(userId);
      expect(result).toHaveLength(2);
    });
  });

  describe('findByCoach', () => {
    it('should return gyms where user is an active coach', async () => {
      const uId = new Types.ObjectId();
      const gId = new Types.ObjectId();
      affiliationModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([{ gymId: gId }]),
      });
      gymModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([{ _id: gId, name: 'Coach Gym' }]),
      });

      const result = await service.findByCoach(uId.toString());
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Coach Gym');
    });
  });

  describe('findByStaff', () => {
    it('should return gyms where user is a staff member', async () => {
      const uId = new Types.ObjectId();
      const gId = new Types.ObjectId();
      const staffGym = { _id: gId, name: 'Staff Gym' };
      userModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          memberships: [
            {
              gym: staffGym,
              membershipStatus: 'active',
              roles: [UserRole.Manager],
            },
          ],
        }),
      });

      const result = await service.findByStaff(uId.toString());
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Staff Gym');
    });
  });

  describe('findAll filters', () => {
    it('should exclude gyms where user is a member or coach if excludeUserId is provided', async () => {
      const uId = new Types.ObjectId();
      const gId = new Types.ObjectId();

      membershipModel.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ gym: gId }]),
      });
      affiliationModel.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });

      gymModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });
      gymModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([{ _id: new Types.ObjectId(), name: 'Other Gym' }]),
      });

      await service.findAll({ excludeUserId: uId.toString() });
      expect(gymModel.find).toHaveBeenCalledWith(expect.objectContaining({
        _id: { $nin: [gId.toString()] }
      }));
    });
  });

  describe('updateSettings', () => {
    it('should throw ConflictException if not the owner', async () => {
      const mockGym = { 
        owner: new Types.ObjectId().toString(),
        toObject: () => ({ settings: {} })
      };
      const GymModelMock = service['gymModel'] as any;
      GymModelMock.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockGym),
      });

      await expect(service.updateSettings('gymId', {}, 'wrongUserId')).rejects.toThrow(ConflictException);
    });

    it('should update settings and notify schedule change', async () => {
      const ownerId = new Types.ObjectId().toString();
      const mockGym = { 
        owner: ownerId,
        settings: { notifyScheduleChanges: true },
        toObject: () => ({ settings: { notifyScheduleChanges: true } })
      };
      const GymModelMock = service['gymModel'] as any;
      GymModelMock.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockGym),
      });
      GymModelMock.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockGym),
      });

      await service.updateSettings('gymId', { workingDays: ['monday'] }, ownerId);
      expect(notificationsService.notifyScheduleChange).toHaveBeenCalled();
    });

    it('should detect temporary closure changes', async () => {
      const gId = new Types.ObjectId().toString();
      const uId = new Types.ObjectId().toString();
      const oldClosures = [{ start: '2023-01-01', end: '2023-01-02' }];
      const newClosures = [{ start: '2023-01-03', end: '2023-01-04' }];
      
      gymModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: gId,
          owner: uId,
          settings: { temporaryClosures: oldClosures },
          toObject: () => ({ settings: { temporaryClosures: oldClosures } })
        }),
      });
      gymModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ _id: gId, settings: { temporaryClosures: newClosures } }),
      });

      await service.updateSettings(gId, { temporaryClosures: newClosures }, uId);
      expect(gymModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should detect schedule changes', async () => {
      const gId = new Types.ObjectId().toString();
      const uId = new Types.ObjectId().toString();
      const currentSettings = { workingDays: ['monday'], workingHours: { start: '08:00', end: '20:00' } };
      
      gymModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: gId,
          owner: uId,
          settings: { ...currentSettings, notifyScheduleChanges: true },
          toObject: () => ({ settings: { ...currentSettings, notifyScheduleChanges: true } })
        }),
      });
      gymModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ _id: gId, settings: {} }),
      });

      const updateDto = { 
        workingDays: ['tuesday'], 
        workingHours: { start: '09:00', end: '21:00' },
        femaleOnlyHours: { enabled: true, start: '10:00', end: '12:00' }
      };
      await service.updateSettings(gId, updateDto, uId);
      expect(notificationsService.notifyScheduleChange).toHaveBeenCalled();
    });

    it('should not notify schedule change if settings are identical', async () => {
      const gId = new Types.ObjectId().toString();
      const uId = new Types.ObjectId().toString();
      const currentSettings = { workingDays: ['monday'], workingHours: { start: '08:00', end: '20:00' } };
      
      gymModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: gId,
          owner: uId,
          settings: currentSettings,
          toObject: () => ({ settings: currentSettings })
        }),
      });
      gymModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ _id: gId, settings: currentSettings }),
      });

      await service.updateSettings(gId, currentSettings, uId);
      expect(notificationsService.notifyScheduleChange).not.toHaveBeenCalled();
    });

    it('should notify gym closure change if temporaryClosures are different', async () => {
      const gId = new Types.ObjectId().toString();
      const uId = new Types.ObjectId().toString();
      const oldClosures = [{ start: '2023-01-01', end: '2023-01-02' }];
      const newClosures = [{ start: '2023-01-03', end: '2023-01-04' }];
      
      gymModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: gId,
          owner: uId,
          settings: { temporaryClosures: oldClosures },
          toObject: () => ({ settings: { temporaryClosures: oldClosures } })
        }),
      });
      gymModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ _id: gId, settings: { temporaryClosures: newClosures } }),
      });

      await service.updateSettings(gId, { temporaryClosures: newClosures }, uId);
      expect(notificationsService.notifyGymClosureChange).toHaveBeenCalled();
    });

    it('should not notify gym closure change if temporaryClosures are identical', async () => {
      const gId = new Types.ObjectId().toString();
      const uId = new Types.ObjectId().toString();
      const currentClosures = [{ start: '2023-01-01', end: '2023-01-02' }];
      
      gymModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: gId,
          owner: uId,
          settings: { temporaryClosures: currentClosures },
          toObject: () => ({ settings: { temporaryClosures: currentClosures } })
        }),
      });
      gymModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ _id: gId, settings: { temporaryClosures: currentClosures } }),
      });

      await service.updateSettings(gId, { temporaryClosures: currentClosures }, uId);
      expect(notificationsService.notifyGymClosureChange).not.toHaveBeenCalled();
    });
  });

  describe('facilities', () => {
    it('should add a facility', async () => {
      const gId = new Types.ObjectId().toString();
      gymModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: gId, facilities: [] }),
      });

      const result = await service.addFacility(gId, { name: 'Pool' });
      expect(result).toBeDefined();
    });

    it('should remove a facility', async () => {
      const gId = new Types.ObjectId().toString();
      const fId = new Types.ObjectId().toString();
      gymModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: gId, facilities: [] }),
      });

      const result = await service.removeFacility(gId, fId);
      expect(result).toBeDefined();
    });

    it('should update a facility', async () => {
      const gId = new Types.ObjectId().toString();
      const fId = new Types.ObjectId().toString();
      const updatedFacility = { _id: fId, name: 'Updated Pool' };
      gymModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: gId, facilities: [updatedFacility] }),
      });

      const result = await service.updateFacility(gId, fId, { name: 'Updated Pool' });
      expect(result.facilities[0].name).toBe('Updated Pool');
    });

    it('should throw NotFoundException if facility to update is not found', async () => {
      const gId = new Types.ObjectId().toString();
      const fId = new Types.ObjectId().toString();
      gymModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.updateFacility(gId, fId, { name: 'Updated Pool' })).rejects.toThrow(NotFoundException);
    });

    it('should validate a facility', async () => {
      const gId = new Types.ObjectId().toString();
      const fId = new Types.ObjectId().toString();
      gymModel.findOne.mockResolvedValue({ _id: gId });

      const result = await service.validateFacility(gId, fId);
      expect(result).toBe(true);
    });
  });

  describe('setBanner', () => {
    it('should set banner for a gym', async () => {
      const gId = new Types.ObjectId().toString();
      const banner = { url: 'banner.jpg', publicId: 'b1' };
      gymModel.findByIdAndUpdate.mockResolvedValue({ _id: gId, bannerUrl: banner.url });

      const result = await service.setBanner(gId, banner);
      expect(result.bannerUrl).toBe(banner.url);
    });

    it('should throw error in setBanner if gym not found', async () => {
      gymModel.findByIdAndUpdate.mockResolvedValue(null);
      await expect(service.setBanner('id', { url: '', publicId: '' })).rejects.toThrow('Gym not found');
    });
  });

  describe('media management', () => {
    it('should add media to a gym', async () => {
      const gId = new Types.ObjectId().toString();
      gymModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ _id: gId, media: [{ publicId: 'pid' }] }),
      });

      const result = await service.addMedia(gId, { publicId: 'pid', url: 'url' });
      expect(result).toBeDefined();
    });

    it('should remove media from a gym', async () => {
      const gId = new Types.ObjectId().toString();
      gymModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ _id: gId, media: [] }),
      });

      const result = await service.removeMedia(gId, 'pid');
      expect(result).toBeDefined();
    });
  });

  describe('exportManagerData', () => {
    it('should export gym and member data to excel', async () => {
      const userId = new Types.ObjectId().toString();
      const res = {
        setHeader: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
      };
      
      const gym = { 
        _id: new Types.ObjectId(), 
        name: 'Gym 1', 
        city: 'City', 
        address: 'Addr',
        memberStats: { total: 10 }
      };

      gymModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([gym]),
      });
      
      membershipModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });
      
      membershipModel.countDocuments.mockResolvedValue(5);

      userModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      await service.exportManagerData(userId, res as any);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', expect.any(String));
      expect(res.end).toHaveBeenCalled();
    });
  });

  describe('normalizeGym', () => {
    it('should normalize servicesOffered from strings to objects', () => {
      const gym = {
        settings: {
          servicesOffered: ['Yoga', 'Boxing']
        },
        toObject: function() { return this; }
      };

      const result = service['normalizeGym'](gym);
      expect(result.settings.servicesOffered[0]).toHaveProperty('name', 'Yoga');
      expect(result.settings.servicesOffered[0]).toHaveProperty('_id');
    });

    it('should return null if gym is null', () => {
      expect(service['normalizeGym'](null)).toBeNull();
    });
  });
});
