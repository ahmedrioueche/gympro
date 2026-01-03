import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingController } from './training.controller';
import {
  ProgramHistoryModel,
  ProgramHistorySchema,
  TrainingProgramModel,
  TrainingProgramSchema,
} from './training.schema';
import { TrainingService } from './training.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrainingProgramModel.name, schema: TrainingProgramSchema },
      { name: ProgramHistoryModel.name, schema: ProgramHistorySchema },
    ]),
  ],
  controllers: [TrainingController],
  providers: [TrainingService],
  exports: [TrainingService],
})
export class TrainingModule {}
