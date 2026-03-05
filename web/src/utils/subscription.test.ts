import { describe, expect, it } from "vitest";
import { calculateSubscriptionLimits } from "./subscription";

describe("calculateSubscriptionLimits", () => {
  it("should return defaults for null subscription", () => {
    const result = calculateSubscriptionLimits(null);
    expect(result).toEqual({ maxGyms: 1, maxMembers: 50 });
  });

  it("should return defaults for undefined subscription", () => {
    const result = calculateSubscriptionLimits(undefined);
    expect(result).toEqual({ maxGyms: 1, maxMembers: 50 });
  });

  it("should use plan limits when available", () => {
    const sub = {
      plan: {
        limits: { maxGyms: 5, maxMembers: 200 },
      },
    } as any;

    const result = calculateSubscriptionLimits(sub);
    expect(result).toEqual({ maxGyms: 5, maxMembers: 200 });
  });

  it("should add add-on limits to base limits", () => {
    const sub = {
      plan: {
        limits: { maxGyms: 2, maxMembers: 100 },
      },
      addOns: [
        { gyms: 3, members: 50 },
        { gyms: 1, members: 25 },
      ],
    } as any;

    const result = calculateSubscriptionLimits(sub);
    expect(result).toEqual({ maxGyms: 6, maxMembers: 175 });
  });

  it("should not add to limits when base is 0 (unlimited)", () => {
    const sub = {
      plan: {
        limits: { maxGyms: 0, maxMembers: 0 },
      },
      addOns: [{ gyms: 5, members: 100 }],
    } as any;

    const result = calculateSubscriptionLimits(sub);
    // 0 means unlimited, so add-ons shouldn't increase it
    expect(result).toEqual({ maxGyms: 0, maxMembers: 0 });
  });

  it("should handle subscription with no add-ons", () => {
    const sub = {
      plan: {
        limits: { maxGyms: 3, maxMembers: 150 },
      },
    } as any;

    const result = calculateSubscriptionLimits(sub);
    expect(result).toEqual({ maxGyms: 3, maxMembers: 150 });
  });

  it("should handle add-ons with partial fields", () => {
    const sub = {
      plan: {
        limits: { maxGyms: 2, maxMembers: 100 },
      },
      addOns: [
        { gyms: 1 }, // no members
        { members: 50 }, // no gyms
      ],
    } as any;

    const result = calculateSubscriptionLimits(sub);
    expect(result).toEqual({ maxGyms: 3, maxMembers: 150 });
  });
});
