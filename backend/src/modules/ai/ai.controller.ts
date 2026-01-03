import { apiResponse } from '@ahmedrioueche/gympro-client';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GeminiService } from '../../common/services/gemini.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post()
  async getResponse(@Body() body: { prompt: string }) {
    const response = await this.geminiService.generateText(body.prompt);
    return apiResponse(
      true,
      undefined,
      response,
      'Response generated successfully',
    );
  }
}
