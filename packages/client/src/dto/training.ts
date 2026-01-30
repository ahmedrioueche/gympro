import { DaysPerWeek } from "../types/common";
import {
  ExerciseDifficulty,
  ExerciseProgress,
  ExerciseType,
  ExperienceLevel,
  MuscleGroup,
  ProgramPurpose,
} from "../types/training";

export interface CreateExerciseDto {
  name: string;
  description?: string;
  instructions?: string;
  targetMuscles?: MuscleGroup[];
  equipment?: string[];
  difficulty?: ExerciseDifficulty;
  type?: ExerciseType;
  recommendedSets?: number;
  recommendedReps?: number;
  durationMinutes?: number;
  videoUrl?: string;
  imageUrl?: string;
  isPublic?: boolean;
  restTime?: number;
}

export interface CreateProgramBlockDto {
  type: "single" | "superset" | "circuit";
  exercises: CreateExerciseDto[];
  rounds?: number;
}

export interface CreateProgramDayDto {
  name: string;
  blocks: CreateProgramBlockDto[];
}

export interface CreateProgramDto {
  name: string;
  experience: ExperienceLevel;
  purpose: ProgramPurpose;
  daysPerWeek: DaysPerWeek;
  durationWeeks?: number;
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
