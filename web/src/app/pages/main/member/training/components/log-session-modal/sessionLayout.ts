import type {
  ExerciseProgress,
  TrainingProgram,
} from "@ahmedrioueche/gympro-client";

export type SessionLayoutEntry =
  | {
      kind: "program-block";
      blockIndex: number;
      exerciseIndices: number[];
    }
  | {
      kind: "added";
      exerciseIndex: number;
    };

export interface SessionExerciseMeta {
  name: string;
  videoUrl?: string;
  recommendedSets?: number;
  recommendedReps?: number;
  restTime?: number;
}

const programExerciseId = (
  ex: TrainingProgram["days"][0]["blocks"][0]["exercises"][0],
) => ex._id || ex.name || "unknown_exercise";

export const buildLayoutFromProgram = (
  day: TrainingProgram["days"][0],
): SessionLayoutEntry[] => {
  const layout: SessionLayoutEntry[] = [];
  let idx = 0;

  day.blocks.forEach((block, blockIndex) => {
    const exerciseIndices = block.exercises.map(() => idx++);
    layout.push({ kind: "program-block", blockIndex, exerciseIndices });
  });

  return layout;
};

const matchesProgramExercise = (
  saved: ExerciseProgress,
  progEx: TrainingProgram["days"][0]["blocks"][0]["exercises"][0],
) => {
  const id = programExerciseId(progEx);
  return (
    saved.exerciseId === progEx._id ||
    saved.exerciseId === progEx.name ||
    saved.exerciseId === id
  );
};

export const buildLayoutForEdit = (
  day: TrainingProgram["days"][0],
  savedExercises: ExerciseProgress[],
): {
  exercises: ExerciseProgress[];
  layout: SessionLayoutEntry[];
  meta: Record<string, SessionExerciseMeta>;
} => {
  const usedSaved = new Set<number>();
  const exercises: ExerciseProgress[] = [];
  const layout: SessionLayoutEntry[] = [];
  const meta: Record<string, SessionExerciseMeta> = {};

  day.blocks.forEach((block, blockIndex) => {
    const exerciseIndices: number[] = [];

    block.exercises.forEach((progEx) => {
      const savedIdx = savedExercises.findIndex(
        (s, i) => !usedSaved.has(i) && matchesProgramExercise(s, progEx),
      );
      if (savedIdx >= 0) {
        usedSaved.add(savedIdx);
        exerciseIndices.push(exercises.length);
        exercises.push(savedExercises[savedIdx]);
      }
    });

    if (exerciseIndices.length > 0) {
      layout.push({ kind: "program-block", blockIndex, exerciseIndices });
    }
  });

  savedExercises.forEach((ex, savedIdx) => {
    if (usedSaved.has(savedIdx)) return;
    const exerciseIndex = exercises.length;
    exercises.push(ex);
    layout.push({ kind: "added", exerciseIndex });
    meta[ex.exerciseId] = { name: ex.exerciseId };
  });

  return { exercises, layout, meta };
};

export const removeExerciseFromLayout = (
  layout: SessionLayoutEntry[],
  removedIndex: number,
): SessionLayoutEntry[] => {
  const adjust = (i: number) => (i > removedIndex ? i - 1 : i);

  return layout
    .map((entry) => {
      if (entry.kind === "program-block") {
        const exerciseIndices = entry.exerciseIndices
          .filter((i) => i !== removedIndex)
          .map(adjust);
        if (exerciseIndices.length === 0) return null;
        return { ...entry, exerciseIndices };
      }
      if (entry.exerciseIndex === removedIndex) return null;
      return { ...entry, exerciseIndex: adjust(entry.exerciseIndex) };
    })
    .filter((entry): entry is SessionLayoutEntry => entry !== null);
};

export const rebuildLayoutFromExercises = (
  day: TrainingProgram["days"][0],
  exercises: ExerciseProgress[],
): SessionLayoutEntry[] => {
  const used = new Set<number>();
  const layout: SessionLayoutEntry[] = [];

  day.blocks.forEach((block, blockIndex) => {
    const exerciseIndices: number[] = [];

    block.exercises.forEach((progEx) => {
      const matchIdx = exercises.findIndex(
        (s, i) => !used.has(i) && matchesProgramExercise(s, progEx),
      );
      if (matchIdx >= 0) {
        used.add(matchIdx);
        exerciseIndices.push(matchIdx);
      }
    });

    if (exerciseIndices.length > 0) {
      layout.push({ kind: "program-block", blockIndex, exerciseIndices });
    }
  });

  exercises.forEach((_, idx) => {
    if (!used.has(idx)) {
      layout.push({ kind: "added", exerciseIndex: idx });
    }
  });

  return layout;
};
