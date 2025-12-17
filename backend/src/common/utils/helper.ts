import { SupportedCurrency } from '@ahmedrioueche/gympro-client';

export function convertToSmallestUnit(
  amount: number,
  currency: SupportedCurrency,
): number {
  // DZD uses centimes (1 DZD = 100 centimes)
  const multiplier = currency === 'DZD' ? 1 : 100;
  return Math.round(amount * multiplier);
}
