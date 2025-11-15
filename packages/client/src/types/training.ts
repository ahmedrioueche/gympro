import { AuditInfo, DaysPerWeek } from "./common";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type ProgramPurpose =
  | "strength"
  | "hypertrophy"
  | "weight_loss"
  | "endurance"
  | "mobility"
  | "general_fitness";

export type MuscleGroup =
  | "chest"
  | "back"
  | "biceps"
  | "triceps"
  | "shoulders"
  | "legs"
  | "abs"
  | "glutes"
  | "calves";

export interface Exercise {
  _id: string;
  name: string;
  description?: string;
  targetMuscles?: MuscleGroup[];
  equipment?: string[];
  recommendedSets?: number;
  recommendedReps?: number;
  durationMinutes?: number;
}

export interface ProgramDay {
  name: string;
  exercises: Exercise[];
}

export interface TrainingProgram extends AuditInfo {
  _id: string;
  name: string;
  experience: ExperienceLevel;
  purpose: ProgramPurpose;
  daysPerWeek: DaysPerWeek;
  days: ProgramDay[];
  creationType: "member" | "coach" | "template";
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
  program: TrainingProgram;
  progress: ProgramProgress;
}
