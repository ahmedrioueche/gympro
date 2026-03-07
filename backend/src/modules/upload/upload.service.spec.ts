import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config: Record<string, string> = {
                CLOUDINARY_CLOUD_NAME: 'test-cloud',
                CLOUDINARY_API_KEY: 'test-key',
                CLOUDINARY_API_SECRET: 'test-secret',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have the uploadFile method', () => {
    expect(service.uploadFile).toBeDefined();
    expect(typeof service.uploadFile).toBe('function');
  });
});
