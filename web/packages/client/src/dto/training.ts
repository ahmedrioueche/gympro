import { DaysPerWeek } from "../types/common";
import {
  ExerciseProgress,
  ExperienceLevel,
  MuscleGroup,
  ProgramPurpose,
} from "../types/training";

export interface CreateExerciseDto {
  name: string;
  description?: string;
  targetMuscles?: MuscleGroup[];
  equipment?: string[];
  recommendedSets?: number;
  recommendedReps?: number;
  durationMinutes?: number;
  videoUrl?: string;
}

export interface CreateProgramDayDto {
  name: string;
  exercises: CreateExerciseDto[];
}

export interface CreateProgramDto {
  name: string;
  experience: ExperienceLevel;
  purpose: ProgramPurpose;
  daysPerWeek: DaysPerWeek;
  days: CreateProgramDayDto[];
  description?: string;
  isPublic?: boolean;
}

export interface LogSessionDto {
  programId: string;
  dayName: string;
  date: string;
  exercises: ExerciseProgress[];
  notes?: string;
}
