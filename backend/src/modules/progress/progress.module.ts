import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProgramHistoryModel,
  ProgramHistorySchema,
  TrainingProgramModel,
  TrainingProgramSchema,
} from '../training/training.schema';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProgramHistoryModel.name, schema: ProgramHistorySchema },
      { name: TrainingProgramModel.name, schema: TrainingProgramSchema },
    ]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
