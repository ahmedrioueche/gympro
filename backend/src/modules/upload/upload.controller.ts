import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ALL_ALLOWED_MIME_TYPES,
  formatFileSize,
  getMaxSizeForMime,
  UPLOAD_LIMITS,
} from './upload.constants';
import { UploadService } from './upload.service';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) {}

  @Post('public')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: UPLOAD_LIMITS.VIDEO_MAX_SIZE, // Max possible size (videos)
      },
      fileFilter: (req, file, callback) => {
        // Validate MIME type
        if (!ALL_ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
          return callback(
            new BadRequestException(
              `Invalid file type: ${file.mimetype}. Allowed types: images, videos, documents`,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadPublicFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('resourceType') resourceType?: 'auto' | 'raw' | 'image',
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size based on type
    const maxSize = getMaxSizeForMime(file.mimetype);
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File too large. Maximum size for this file type is ${formatFileSize(maxSize)}`,
      );
    }

    // Default to 'auto' if not provided
    const type = resourceType || 'auto';

    // Basic validation of resourceType
    if (!['auto', 'raw', 'image'].includes(type)) {
      throw new BadRequestException('Invalid resourceType');
    }

    this.logger.log(
      `📤 Upload started: ${file.originalname} (${formatFileSize(file.size)}, ${file.mimetype})`,
    );

    try {
      const result = await this.uploadService.uploadFile(file, type);
      this.logger.log(
        `✅ Upload complete: ${file.originalname} -> ${result.url}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`❌ Upload failed: ${file.originalname}`, error);
      throw error;
    }
  }
}
