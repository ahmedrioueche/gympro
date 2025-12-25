import {
  APP_PLAN_LEVELS,
  APP_SUBSCRIPTION_BILLING_CYCLES,
  type AppPlanLevel,
  type AppSubscriptionBillingCycle,
} from "@ahmedrioueche/gympro-client";

export type PlanChangeType =
  | "subscribe"
  | "upgrade"
  | "downgrade"
  | "switch_up"
  | "switch_down"
  | "same";

export const getPlanChangeType = (
  currentLevel: AppPlanLevel,
  currentCycle: AppSubscriptionBillingCycle,
  targetLevel: AppPlanLevel,
  targetCycle: AppSubscriptionBillingCycle,
  currentPrice?: number, // Optional: current plan price
  targetPrice?: number // Optional: target plan price
): PlanChangeType => {
  // Get indices for hierarchy comparison
  const levelIndexResults = {
    current: APP_PLAN_LEVELS.indexOf(currentLevel),
    target: APP_PLAN_LEVELS.indexOf(targetLevel),
  };

  // Indices: monthly=0, yearly=1, oneTime=2
  const cycleIndexResults = {
    current: APP_SUBSCRIPTION_BILLING_CYCLES.indexOf(currentCycle),
    target: APP_SUBSCRIPTION_BILLING_CYCLES.indexOf(targetCycle),
  };

  if (currentLevel === "free") {
    return "subscribe";
  }

  // Same plan and cycle
  if (
    levelIndexResults.target === levelIndexResults.current &&
    cycleIndexResults.target === cycleIndexResults.current
  ) {
    return "same";
  }

  // PRIORITY 1: Check for tier changes first (upgrade/downgrade)
  // Higher tier = upgrade
  if (levelIndexResults.target > levelIndexResults.current) {
    return "upgrade";
  }

  // Lower tier = downgrade (regardless of cycle change)
  if (levelIndexResults.target < levelIndexResults.current) {
    return "downgrade";
  }

  // PRIORITY 2: Same tier, different cycle = switch
  // At this point, we know the tiers are the same (levelIndexResults.target === levelIndexResults.current)

  // If we have price information, use it to determine if it's really an upgrade or downgrade
  if (currentPrice !== undefined && targetPrice !== undefined) {
    // If target price is higher or equal, it's an upgrade (switch_up)
    if (targetPrice >= currentPrice) {
      if (cycleIndexResults.target > cycleIndexResults.current) {
        return "switch_up"; // e.g. Monthly Premium -> Yearly Premium (more expensive)
      }
    }

    // If target price is lower, treat as downgrade (even if cycle is "better")
    if (targetPrice < currentPrice) {
      return "downgrade"; // e.g. Yearly Premium -> Monthly Premium (less expensive overall)
    }
  }

  // Fallback to cycle-based logic if no price info
  if (cycleIndexResults.target > cycleIndexResults.current) {
    return "switch_up"; // e.g. Monthly -> Yearly (same tier)
  }

  if (cycleIndexResults.target < cycleIndexResults.current) {
    return "switch_down"; // e.g. Yearly -> Monthly (same tier)
  }

  return "same";
};
