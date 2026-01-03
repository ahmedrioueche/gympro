import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { AiController } from './ai.controller';

@Module({
  imports: [CommonModule],
  controllers: [AiController],
})
export class AiModule {}
