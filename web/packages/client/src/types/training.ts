import { AuditInfo, DaysPerWeek } from "./common";

export const EXPERIENCE_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;
export const PROGRAM_PURPOSES = [
  "strength",
  "hypertrophy",
  "weight_loss",
  "endurance",
  "mobility",
  "general_fitness",
] as const;
export const MUSCLE_GROUPS = [
  "chest",
  "back",
  "biceps",
  "triceps",
  "shoulders",
  "legs",
  "abs",
  "glutes",
  "calves",
] as const;

export const CREATION_TYPES = ["member", "coach", "template"] as const;
// Then derive the types from the constants
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
export type ProgramPurpose = (typeof PROGRAM_PURPOSES)[number];
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export interface Exercise {
  _id?: string;
  name: string;
  description?: string;
  targetMuscles?: MuscleGroup[];
  equipment?: string[];
  recommendedSets?: number;
  recommendedReps?: number;
  durationMinutes?: number;
  videoUrl?: string;
}

export interface ProgramDay {
  name: string;
  exercises: Exercise[];
}

export interface TrainingProgram extends AuditInfo {
  _id?: string;
  name: string;
  experience: ExperienceLevel;
  purpose: ProgramPurpose;
  daysPerWeek: DaysPerWeek;
  days: ProgramDay[];
  creationType: "member" | "coach" | "template";
  description?: string;
  isPublic?: boolean;
}

// Progress for a single exercise in a session
export interface ExerciseProgress {
  exerciseId: string; // links to Exercise._id
  setsDone?: number;
  repsDone?: number;
  durationMinutes?: number;
  weightKg?: number;
  notes?: string; // optional notes for that exercise
}

// Progress for a training day
export interface ProgramDayProgress {
  dayName: string; // matches ProgramDay.name
  date: string | Date;
  exercises: ExerciseProgress[];
  notes?: string; // optional overall day notes
}

// Member’s progress for the current program
export interface ProgramProgress {
  programId: string; // links to TrainingProgram._id
  startDate: string | Date;
  endDate?: string | Date; // optional if program ongoing
  daysCompleted: number;
  totalDays: number;
  dayLogs: ProgramDayProgress[];
}

export interface ProgramHistory {
  _id?: string;
  program: TrainingProgram;
  progress: ProgramProgress;
  status: "active" | "completed" | "abandoned";
}
