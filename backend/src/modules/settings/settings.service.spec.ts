import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let settingsModel: any;
  let userModel: any;

  const mockUser = {
    _id: 'user1',
    appSettings: {
      theme: 'dark',
      viewPreference: 'table',
      notifications: {
        enablePush: true,
        enableEmail: true,
        defaultReminderMinutes: 30,
      },
      locale: { language: 'en', currency: 'USD' },
      timer: { defaultRestTime: 90, sound: 'beep', alarmDuration: 3 },
    },
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: getModelToken('AppSettingsModel'),
          useValue: {
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    settingsModel = module.get(getModelToken('AppSettingsModel'));
    userModel = module.get(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSettings', () => {
    it('should return user settings', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.getSettings('user1');
      expect(result).toEqual(mockUser.appSettings);
    });

    it('should return default settings when user has no appSettings', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'user1', appSettings: null }),
      });

      const result = await service.getSettings('user1');
      expect(result).toBeDefined();
      expect(result.theme).toBe('auto');
    });

    it('should throw NotFoundException when user not found', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getSettings('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateSettings', () => {
    it('should update and return settings', async () => {
      const updatedUser = {
        ...mockUser,
        appSettings: { ...mockUser.appSettings, theme: 'light' },
        save: jest.fn().mockResolvedValue({
          appSettings: { ...mockUser.appSettings, theme: 'light' },
        }),
      };
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.updateSettings('user1', { theme: 'light' });
      expect(updatedUser.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateSettings('invalid', { theme: 'dark' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
