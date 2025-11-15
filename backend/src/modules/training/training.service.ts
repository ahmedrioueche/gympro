import type {
  DaysPerWeek,
  Exercise,
  ExerciseProgress,
  ExperienceLevel,
  MuscleGroup,
  ProgramDay,
  ProgramDayProgress,
  ProgramHistory,
  ProgramProgress,
  ProgramPurpose,
  TrainingProgram,
} from '@ahmedrioueche/gympro-client';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const muscleGroups = [
  'chest',
  'back',
  'biceps',
  'triceps',
  'shoulders',
  'legs',
  'abs',
  'glutes',
  'calves',
] as const;
const experienceLevels = ['beginner', 'intermediate', 'advanced'] as const;
const programPurposes = [
  'strength',
  'hypertrophy',
  'weight_loss',
  'endurance',
  'mobility',
  'general_fitness',
] as const;
const creationTypes = ['member', 'coach', 'template'] as const;
const daysPerWeek = [1, 2, 3, 4, 5, 6, 7] as const;

@Schema({ _id: false })
export class ExerciseModel implements Exercise {
  @Prop() declare _id: string;
  @Prop({ required: true }) name: string;
  @Prop() description?: string;
  @Prop({ type: [String], enum: muscleGroups }) targetMuscles?: MuscleGroup[];
  @Prop({ type: [String] }) equipment?: string[];
  @Prop() recommendedSets?: number;
  @Prop() recommendedReps?: number;
  @Prop() durationMinutes?: number;
}
@Schema({ _id: false })
export class ProgramDayModel implements ProgramDay {
  @Prop({ required: true }) name: string;
  @Prop({ type: [ExerciseModel], required: true }) exercises: ExerciseModel[];
}
@Schema({ timestamps: true })
export class TrainingProgramModel extends Document implements TrainingProgram {
  @Prop() declare _id: string;
  @Prop({ required: true }) name: string;
  @Prop({ required: true, enum: experienceLevels }) experience: ExperienceLevel;
  @Prop({ required: true, enum: programPurposes }) purpose: ProgramPurpose;
  @Prop({ required: true, enum: daysPerWeek }) daysPerWeek: DaysPerWeek;
  @Prop({ type: [ProgramDayModel], required: true }) days: ProgramDayModel[];
  @Prop({ required: true, enum: creationTypes }) creationType:
    | 'member'
    | 'coach'
    | 'template';
  @Prop() createdBy?: string;
  @Prop({ required: true }) createdAt: string;
  @Prop() updatedAt?: string;
}
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
  @Prop({ required: true }) date: string;
  @Prop({ type: [ExerciseProgressModel], required: true })
  exercises: ExerciseProgressModel[];
  @Prop() notes?: string;
}
@Schema({ _id: false })
export class ProgramProgressModel implements ProgramProgress {
  @Prop({ required: true }) programId: string;
  @Prop({ required: true }) startDate: string;
  @Prop() endDate?: string;
  @Prop({ required: true }) daysCompleted: number;
  @Prop({ required: true }) totalDays: number;
  @Prop({ type: [ProgramDayProgressModel], required: true })
  dayLogs: ProgramDayProgressModel[];
}
@Schema({ timestamps: true })
export class ProgramHistoryModel extends Document implements ProgramHistory {
  @Prop({ type: TrainingProgramModel, required: true })
  program: TrainingProgramModel;
  @Prop({ type: ProgramProgressModel, required: true })
  progress: ProgramProgressModel;
}
export const ExerciseSchema = SchemaFactory.createForClass(ExerciseModel);
export const TrainingProgramSchema =
  SchemaFactory.createForClass(TrainingProgramModel);
export const ProgramDaySchema = SchemaFactory.createForClass(ProgramDayModel);
export const ExerciseProgressSchema = SchemaFactory.createForClass(
  ExerciseProgressModel,
);
export const ProgramDayProgressSchema = SchemaFactory.createForClass(
  ProgramDayProgressModel,
);
export const ProgramProgressSchema =
  SchemaFactory.createForClass(ProgramProgressModel);
export const ProgramHistorySchema =
  SchemaFactory.createForClass(ProgramHistoryModel);
