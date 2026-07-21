import { describe, expect, it } from "vitest";
import {
  closeSessionTimer,
  createSessionTimer,
  getElapsedSeconds,
  materializeSessionTimer,
  SESSION_INACTIVITY_MS,
} from "./useSessionTimer";

describe("closeSessionTimer", () => {
  it("anchors lastActivityAt at close without pausing the segment", () => {
    const start = 1_000_000;
    const running = createSessionTimer(0, start);

    const closed = closeSessionTimer(running, start + 5 * 60_000);

    expect(closed.segmentStartedAt).toBe(start);
    expect(closed.lastActivityAt).toBe(start + 5 * 60_000);
    expect(getElapsedSeconds(closed, start + 10 * 60_000)).toBe(10 * 60);
  });

  it("includes the 15-minute grace after close in elapsed time", () => {
    const start = 2_000_000;
    const running = createSessionTimer(0, start);
    const closedAt = start + 10 * 60_000;
    const closed = closeSessionTimer(running, closedAt);

    const afterGrace = closedAt + SESSION_INACTIVITY_MS + 60_000;
    const materialized = materializeSessionTimer(closed, afterGrace);

    expect(materialized.segmentStartedAt).toBeNull();
    expect(materialized.elapsedSeconds).toBe(10 * 60 + 15 * 60);
  });
});
