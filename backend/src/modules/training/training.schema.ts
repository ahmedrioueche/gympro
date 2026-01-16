import type {
  DaysPerWeek,
  Exercise,
  ExerciseDifficulty,
  ExerciseProgress,
  ExerciseSet,
  ExerciseType,
  ExperienceLevel,
  MuscleGroup,
  ProgramDay,
  ProgramDayProgress,
  ProgramProgress,
  ProgramPurpose,
} from '@ahmedrioueche/gympro-client';
import {
  CREATION_TYPES,
  DAYS_PER_WEEK,
  EXERCISE_DIFFICULTIES,
  EXERCISE_TYPES,
  EXPERIENCE_LEVELS,
  MUSCLE_GROUPS,
  PROGRAM_PURPOSES,
} from '@ahmedrioueche/gympro-client';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ExerciseModel implements Exercise {
  _id: string;
  @Prop({ required: true }) name: string;
  @Prop() description?: string;
  @Prop({ type: [String], enum: MUSCLE_GROUPS }) targetMuscles?: MuscleGroup[];
  @Prop({ type: [String] }) equipment?: string[];
  @Prop({ type: String, enum: EXERCISE_DIFFICULTIES })
  difficulty?: ExerciseDifficulty;
  @Prop({ type: String, enum: EXERCISE_TYPES }) type?: ExerciseType;
  @Prop() recommendedSets?: number;
  @Prop() recommendedReps?: number;
  @Prop() durationMinutes?: number;
  @Prop() videoUrl?: string;
  @Prop() imageUrl?: string;
  @Prop() instructions?: string;
  @Prop() isPublic?: boolean;
  @Prop({ required: true, default: Date.now }) createdAt: Date;
  @Prop() createdBy?: string;
  @Prop() updatedAt?: Date;
  @Prop() updatedBy?: string;
}

@Schema({ _id: false })
export class ProgramDayModel implements ProgramDay {
  @Prop({ required: true }) name: string;
  @Prop({ type: [ExerciseModel], required: true }) exercises: ExerciseModel[];
}

@Schema({ _id: false })
export class ProgramCommentModel {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) userName: string;
  @Prop() userImage?: string;
  @Prop({ required: true }) text: string;
  @Prop({ required: true, min: 1, max: 5 }) rating: number;
  @Prop({ default: Date.now }) createdAt: Date;
}

@Schema({ timestamps: true })
export class TrainingProgramModel extends Document {
  declare _id: string;
  @Prop({ required: true }) name: string;
  @Prop({
    type: String, // ← Add explicit type
    required: true,
    enum: EXPERIENCE_LEVELS,
  })
  experience: ExperienceLevel;
  @Prop({
    type: String, // ← Add explicit type
    required: true,
    enum: PROGRAM_PURPOSES,
  })
  purpose: ProgramPurpose;
  @Prop({
    type: Number, // ← Add explicit type
    required: true,
    enum: DAYS_PER_WEEK,
  })
  daysPerWeek: DaysPerWeek;
  @Prop({ type: [ProgramDayModel], required: true }) days: ProgramDayModel[];
  @Prop({
    type: String, // ← Add explicit type
    required: true,
    enum: CREATION_TYPES,
  })
  creationType: 'member' | 'coach' | 'template';
  @Prop() description?: string;
  @Prop() isPublic?: boolean;

  @Prop({ type: [ProgramCommentModel], default: [] })
  comments: ProgramCommentModel[];

  @Prop({ default: 0 }) averageRating: number;
  @Prop({ default: 0 }) totalRatings: number;

  @Prop({ required: true }) createdAt: Date;
  @Prop() createdBy?: string;
  @Prop() updatedAt?: Date;
  @Prop() updatedBy?: string;
}

export const TrainingProgramSchema =
  SchemaFactory.createForClass(TrainingProgramModel);

// Add index for search performance
TrainingProgramSchema.index({ name: 'text' });

@Schema({ _id: false })
export class ExerciseSetModel implements ExerciseSet {
  @Prop({ required: true }) reps: number;
  @Prop({ required: true }) weight: number;
  @Prop({ required: true }) completed: boolean;
}

@Schema({ _id: false })
export class ExerciseProgressModel implements ExerciseProgress {
  @Prop({ required: true }) exerciseId: string;
  @Prop({ type: [ExerciseSetModel], required: true }) sets: ExerciseSetModel[];
  @Prop() notes?: string;
}

@Schema({ _id: false })
export class ProgramDayProgressModel implements ProgramDayProgress {
  @Prop({ required: true }) dayName: string;
  @Prop({ type: Date, required: true }) date: Date | string;
  @Prop({ type: [ExerciseProgressModel], required: true })
  exercises: ExerciseProgressModel[];
  @Prop() notes?: string;
}

@Schema({ _id: false })
export class ProgramProgressModel implements ProgramProgress {
  @Prop({ required: true }) programId: string;
  @Prop({ type: Date, required: true }) startDate: Date | string;
  @Prop({ type: Date }) endDate?: Date | string;
  @Prop({ required: true }) daysCompleted: number;
  @Prop({ required: true }) totalDays: number;
  @Prop({ type: [ProgramDayProgressModel], required: true })
  dayLogs: ProgramDayProgressModel[];
}

export const ProgramProgressSchema =
  SchemaFactory.createForClass(ProgramProgressModel);

@Schema({ timestamps: true })
export class ProgramHistoryModel extends Document {
  declare _id: string;
  @Prop({ required: true }) userId: string;
  @Prop({ type: TrainingProgramSchema, required: true })
  program: TrainingProgramModel;
  @Prop({ type: ProgramProgressSchema, required: true })
  progress: ProgramProgressModel;
  @Prop({
    required: true,
    enum: ['active', 'paused', 'completed', 'abandoned'],
  })
  status: 'active' | 'paused' | 'completed' | 'abandoned';

  @Prop({ default: 0 })
  pausesToday: number;

  @Prop()
  lastPauseDate?: Date;
}

export const ProgramHistorySchema =
  SchemaFactory.createForClass(ProgramHistoryModel);
