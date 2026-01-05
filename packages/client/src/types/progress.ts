import { TrainingProgram } from "./training";

export interface ProgressStats {
  totalWorkouts: number;
  totalDurationMinutes: number;
  totalVolumeKg: number;
  currentStreak: number;
  bestStreak: number;
  workoutsThisWeek: number;
  activeProgram?: TrainingProgram;
}

export interface DailyActivity {
  date: string; // ISO date string YYYY-MM-DD
  workoutCount: number;
  volumeKg: number;
  durationMinutes: number;
}

export type ProgressHistory = DailyActivity;
