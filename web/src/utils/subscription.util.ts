import {
  APP_PLAN_LEVELS,
  APP_SUBSCRIPTION_BILLING_CYCLES,
  type AppPlanLevel,
  type AppSubscriptionBillingCycle,
} from "@ahmedrioueche/gympro-client";

export type PlanChangeType =
  | "upgrade"
  | "downgrade"
  | "switch_up"
  | "switch_down"
  | "same";

export const getPlanChangeType = (
  currentLevel: AppPlanLevel,
  currentCycle: AppSubscriptionBillingCycle,
  targetLevel: AppPlanLevel,
  targetCycle: AppSubscriptionBillingCycle
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

  if (levelIndexResults.target > levelIndexResults.current) {
    return "upgrade";
  }

  // If we change cycle, it's a switch (unless it's an upgrade handled above)
  if (cycleIndexResults.target > cycleIndexResults.current) {
    return "switch_up"; // e.g. Monthly -> Yearly
  }

  if (cycleIndexResults.target < cycleIndexResults.current) {
    return "switch_down"; // e.g. Yearly -> Monthly
  }

  // Same Cycle, Lower Level
  if (levelIndexResults.target < levelIndexResults.current) {
    return "downgrade";
  }

  return "same";
};
