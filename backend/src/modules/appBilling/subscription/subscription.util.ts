export interface SubscriptionLimits {
  maxGyms: number;
  maxMembers: number;
  maxGems: number;
}

/**
 * Calculates the total limits for a subscription,
 * including base plan limits and any add-ons.
 */
export function calculateSubscriptionLimits(
  subscription: any,
): SubscriptionLimits {
  const plan = subscription?.plan;
  const baseLimits = plan?.limits || { maxGyms: 1, maxMembers: 50 };

  const addOns = subscription?.addOns || [];

  const totalLimits = {
    maxGyms: baseLimits.maxGyms || 1,
    maxMembers: baseLimits.maxMembers || 50,
    maxGems: baseLimits.maxGems || 0,
  };

  // Add up all add-ons
  for (const addOn of addOns) {
    if (addOn.gyms) totalLimits.maxGyms += addOn.gyms;
    if (addOn.members) totalLimits.maxMembers += addOn.members;
    if (addOn.gems) totalLimits.maxGems += addOn.gems;
  }

  return totalLimits;
}
