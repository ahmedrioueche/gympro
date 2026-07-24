import { describe, expect, it } from "vitest";
import {
  closeSessionTimer,
  createSessionTimer,
  getElapsedSeconds,
  materializeSessionTimer,
  reconcileSessionTimer,
  seedRunningSessionTimer,
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

describe("reconcileSessionTimer", () => {
  it("rejects a fresh zero-reset while local is running", () => {
    const t0 = 5_000_000;
    const now = t0 + 10 * 60_000;
    const local = createSessionTimer(0, t0);
    const incoming = createSessionTimer(0, now);

    const result = reconcileSessionTimer({ local, incoming, now });

    expect(result).toBe(local);
    expect(getElapsedSeconds(result, now)).toBe(10 * 60);
  });

  it("rejects a sharp downward jump while local is running", () => {
    const now = 8_000_000;
    const local = createSessionTimer(600, now - 1_000);
    const incoming = createSessionTimer(30, now);

    const result = reconcileSessionTimer({ local, incoming, now });

    expect(result).toBe(local);
  });

  it("accepts stop/forceAccept even when incoming is lower", () => {
    const now = 9_000_000;
    const local = createSessionTimer(600, now - 1_000);
    const incoming = {
      elapsedSeconds: 120,
      segmentStartedAt: null,
      lastActivityAt: now,
    };

    const result = reconcileSessionTimer({
      local,
      incoming,
      now,
      forceAccept: true,
    });

    expect(result).toBe(incoming);
  });

  it("keeps local when incoming is null", () => {
    const local = createSessionTimer(90);
    expect(reconcileSessionTimer({ local, incoming: null })).toBe(local);
  });
});

describe("seedRunningSessionTimer", () => {
  it("preserves seeded elapsed on attach", () => {
    const now = 10_000_000;
    const seeded = seedRunningSessionTimer(487, now);

    expect(seeded.elapsedSeconds).toBe(487);
    expect(seeded.segmentStartedAt).toBe(now);
    expect(getElapsedSeconds(seeded, now)).toBe(487);
  });
});
