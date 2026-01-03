import type {
  DaysPerWeek,
  Exercise,
  ExerciseProgress,
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
  @Prop() recommendedSets?: number;
  @Prop() recommendedReps?: number;
  @Prop() durationMinutes?: number;
  @Prop() videoUrl?: string;
}

@Schema({ _id: false })
export class ProgramDayModel implements ProgramDay {
  @Prop({ required: true }) name: string;
  @Prop({ type: [ExerciseModel], required: true }) exercises: ExerciseModel[];
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
export class ExerciseProgressModel implements ExerciseProgress {
  @Prop({ required: true }) exerciseId: string;
  @Prop() setsDone?: number;
  @Prop() repsDone?: number;
  @Prop() durationMinutes?: number;
  @Prop() weightKg?: number;
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
  @Prop({ required: true, enum: ['active', 'completed', 'abandoned'] })
  status: 'active' | 'completed' | 'abandoned';
}

export const ProgramHistorySchema =
  SchemaFactory.createForClass(ProgramHistoryModel);
