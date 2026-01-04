import {
  EXERCISE_TYPES,
  ExerciseDifficulty,
  ExerciseType,
  MuscleGroup,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ExerciseModel extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  instructions?: string;

  @Prop({ type: [String] })
  targetMuscles?: MuscleGroup[];

  @Prop({ type: [String] })
  equipment?: string[];

  @Prop({ enum: ['beginner', 'intermediate', 'expert'] })
  difficulty?: ExerciseDifficulty;

  @Prop({
    enum: EXERCISE_TYPES,
  })
  type?: ExerciseType;

  @Prop()
  recommendedSets?: number;

  @Prop()
  recommendedReps?: number;

  @Prop()
  durationMinutes?: number;

  @Prop()
  videoUrl?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  updatedBy?: string;

  declare _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ExerciseSchema = SchemaFactory.createForClass(ExerciseModel);

// Create text index for search
ExerciseSchema.index({ name: 'text', description: 'text' });
