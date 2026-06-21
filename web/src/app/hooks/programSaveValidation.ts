import type { CreateProgramDayDto } from "@ahmedrioueche/gympro-client";

export const hasIncompleteExercises = (
  days: CreateProgramDayDto[] | undefined,
): boolean =>
  (days ?? []).some((day) =>
    day.blocks.some((block) =>
      block.exercises.some((exercise) => !exercise.name?.trim()),
    ),
  );
