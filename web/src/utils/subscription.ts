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
    maxGyms: baseLimits.maxGyms || 1,
    maxMembers: baseLimits.maxMembers || 50,
  };

  // Add up all add-ons
  for (const addOn of addOns) {
    if (addOn.gyms) totalLimits.maxGyms += addOn.gyms;
    if (addOn.members) totalLimits.maxMembers += addOn.members;
  }

  return totalLimits;
}
