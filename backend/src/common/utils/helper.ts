import { AppCurrency } from '@ahmedrioueche/gympro-client';

export function convertToSmallestUnit(
  amount: number,
  currency: AppCurrency,
): number {
  // DZD uses centimes (1 DZD = 100 centimes)
  const multiplier = currency === 'DZD' ? 1 : 100;
  return Math.round(amount * multiplier);
}
