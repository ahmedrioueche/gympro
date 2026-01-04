import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExercisesController } from './exercises.controller';
import { ExerciseModel, ExerciseSchema } from './exercises.schema';
import { ExercisesService } from './exercises.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExerciseModel.name, schema: ExerciseSchema },
    ]),
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
