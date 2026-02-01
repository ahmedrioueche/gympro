import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('public')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPublicFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('resourceType') resourceType?: 'auto' | 'raw' | 'image',
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Default to 'auto' if not provided
    const type = resourceType || 'auto';

    // Basic validation of resourceType
    if (!['auto', 'raw', 'image'].includes(type)) {
      throw new BadRequestException('Invalid resourceType');
    }

    return this.uploadService.uploadFile(file, type);
  }
}
