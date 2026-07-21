import { describe, expect, it } from "vitest";
import type { ProgramDayProgress } from "@ahmedrioueche/gympro-client";
import {
  isSameSession,
  shouldResumeTimerForSession,
} from "./sessionDraftUtils";

const makeSession = (
  overrides: Partial<ProgramDayProgress> & {
    _id?: string;
    submissionId?: string;
  },
): ProgramDayProgress =>
  ({
    dayName: "Push",
    date: new Date().toISOString(),
    exercises: [
      {
        exerciseId: "ex1",
        sets: [{ reps: 10, weight: 50, completed: false }],
      },
    ],
    ...overrides,
  }) as ProgramDayProgress;

describe("sessionDraftUtils", () => {
  it("isSameSession matches submissionId or _id", () => {
    const a = makeSession({ submissionId: "sub-1", _id: "mongo-1" });
    const b = makeSession({ submissionId: "sub-1", _id: "mongo-2" });
    expect(isSameSession(a, b)).toBe(true);
  });

  it("shouldResumeTimerForSession is true for the resumable incomplete server session", () => {
    const programId = "prog-1";
    const session = makeSession({
      _id: "log-1",
      submissionId: "sub-1",
      exercises: [
        {
          exerciseId: "ex1",
          sets: [{ reps: 10, weight: 50, completed: true }],
        },
        {
          exerciseId: "ex2",
          sets: [{ reps: 8, weight: 40, completed: false }],
        },
      ],
    });

    const dayLogs = [session];

    expect(
      shouldResumeTimerForSession(session, programId, dayLogs),
    ).toBe(true);
  });

  it("shouldResumeTimerForSession is false when all sets are completed", () => {
    const session = makeSession({
      _id: "log-2",
      submissionId: "sub-2",
      exercises: [
        {
          exerciseId: "ex1",
          sets: [{ reps: 10, weight: 50, completed: true }],
        },
      ],
    });

    expect(
      shouldResumeTimerForSession(session, "prog-1", [session]),
    ).toBe(false);
  });
});
