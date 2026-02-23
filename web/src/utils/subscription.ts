import type { AppSubscription } from "@ahmedrioueche/gympro-client";

export interface SubscriptionLimits {
  maxGyms: number;
  maxMembers: number;
}

/**
 * Calculates the total limits for a subscription,
 * including base plan limits and any add-ons.
 */
export function calculateSubscriptionLimits(
  subscription: AppSubscription | null | undefined,
): SubscriptionLimits {
  const plan = subscription?.plan;
  const baseLimits = plan?.limits || { maxGyms: 1, maxMembers: 50 };

  const addOns = subscription?.addOns || [];

  const totalLimits = {
    maxGyms: typeof baseLimits.maxGyms === "number" ? baseLimits.maxGyms : 1,
    maxMembers:
      typeof baseLimits.maxMembers === "number" ? baseLimits.maxMembers : 50,
  };

  // Add up all add-ons, but skip if limit is already 0 (unlimited)
  for (const addOn of addOns) {
    if (totalLimits.maxGyms > 0 && addOn.gyms)
      totalLimits.maxGyms += addOn.gyms;
    if (totalLimits.maxMembers > 0 && addOn.members)
      totalLimits.maxMembers += addOn.members;
  }

  return totalLimits;
}
