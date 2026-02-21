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
    maxGyms: baseLimits.maxGyms === 0 ? 0 : baseLimits.maxGyms || 1,
    maxMembers: baseLimits.maxMembers === 0 ? 0 : baseLimits.maxMembers || 50,
    maxGems: baseLimits.maxGems === 0 ? 0 : baseLimits.maxGems || 0,
  };

  // Add up all add-ons, but skip if limit is already 0 (Infinity)
  for (const addOn of addOns) {
    if (totalLimits.maxGyms !== 0 && addOn.gyms)
      totalLimits.maxGyms += addOn.gyms;
    if (totalLimits.maxMembers !== 0 && addOn.members)
      totalLimits.maxMembers += addOn.members;
    if (totalLimits.maxGems !== 0 && addOn.gems)
      totalLimits.maxGems += addOn.gems;
  }

  return totalLimits;
}
