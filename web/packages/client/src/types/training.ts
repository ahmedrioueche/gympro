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
  "glutes",
  "calves",
  "core",
] as const;

export const MUSCLE_SUBGROUPS = {
  chest: ["upper_chest", "mid_chest", "lower_chest", "inner_chest"],

  back: [
    "lats",
    "upper_back",
    "mid_back",
    "lower_back",
    "traps_upper",
    "traps_middle",
    "traps_lower",
  ],

  shoulders: ["front_delts", "lateral_delts", "rear_delts", "rotator_cuff"],

  arms: [
    "arms",
    "biceps",
    "triceps",
    "forearms",
    "biceps_long_head",
    "biceps_short_head",
    "brachialis",
    "triceps_long_head",
    "triceps_lateral_head",
    "triceps_medial_head",
    "forearms_flexors",
    "forearms_extensors",
  ],

  legs: [
    "quads",
    "hamstrings",
    "glutes",
    "calves",
    "adductors",
    "abductors",

    // quads detail
    "quads_rectus_femoris",
    "quads_vastus_lateralis",
    "quads_vastus_medialis",
    "quads_vastus_intermedius",

    // hamstrings detail
    "hamstrings_biceps_femoris",
    "hamstrings_semitendinosus",
    "hamstrings_semimembranosus",
  ],

  glutes: ["glute_max", "glute_med", "glute_min"],

  calves: ["gastrocnemius_medial", "gastrocnemius_lateral", "soleus"],

  core: [
    "abs",
    "upper_abs",
    "lower_abs",
    "obliques_internal",
    "obliques_external",
    "transverse_abdominis",
    "erector_spinae",
  ],
} as const;

export const EXERCISE_DIFFICULTIES = [
  "beginner",
  "intermediate",
  "expert",
] as const;

export const EXERCISE_TYPES = [
  "cardio",
  "strength",
  "stretching",
  "powerlifting",
  "plyometrics",
  "olympic_weightlifting",
  "strongman",
] as const;

export const CREATION_TYPES = ["member", "coach", "template"] as const;
// Then derive the types from the constants
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
export type ProgramPurpose = (typeof PROGRAM_PURPOSES)[number];

export type MuscleSubgroups = typeof MUSCLE_SUBGROUPS;
export type MuscleSubgroup = MuscleSubgroups[keyof MuscleSubgroups][number];
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number] | MuscleSubgroup;

export type ExerciseDifficulty = (typeof EXERCISE_DIFFICULTIES)[number];
export type ExerciseType = (typeof EXERCISE_TYPES)[number];

export interface Exercise extends AuditInfo {
  _id?: string;
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
}

export interface ProgramBlock {
  type: "single" | "superset" | "circuit";
  exercises: Exercise[];
  rounds?: number;
}

export interface ProgramDay {
  name: string;
  blocks: ProgramBlock[];
}

export interface ProgramComment {
  userId: string;
  userName: string;
  userImage?: string;
  text: string;
  rating: number; // 1-5
  createdAt: Date | string;
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
  comments?: ProgramComment[];
  averageRating?: number;
  totalRatings?: number;
}

// Progress for a single exercise in a session
export interface ExerciseSet {
  reps: number;
  weight: number;
  completed: boolean;
  drops?: {
    weight: number;
    reps: number;
  }[];
}

export interface ExerciseProgress {
  exerciseId: string; // links to Exercise._id
  sets: ExerciseSet[];
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
  status: "active" | "paused" | "completed" | "abandoned";
}

// DTOs for Exercise Library

export interface ExerciseFilters {
  search?: string;
  targetMuscle?: MuscleGroup;
  equipment?: string;
  difficulty?: ExerciseDifficulty;
  type?: ExerciseType;
  createdBy?: string;
  myExercises?: boolean;
}
