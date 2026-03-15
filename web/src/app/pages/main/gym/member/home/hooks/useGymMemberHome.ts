import type {
  GymSettings,
} from "@ahmedrioueche/gympro-client";
import { useGymStatus } from "../../../../../../hooks/useGymStatus";

export type { GymStatus } from "../../../../../../hooks/useGymStatus";

/**
 * Hook to calculate gym open/closed status based on working hours
 * Now delegates to shared useGymStatus hook
 */
export function useGymMemberHome(settings?: GymSettings) {
  return useGymStatus(settings);
}

/**
 * Generate Google Maps URL from address components
 */
export function getGoogleMapsUrl(gym: {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}): string {
  const parts = [gym.address, gym.city, gym.state, gym.country].filter(Boolean);
  const query = encodeURIComponent(parts.join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/**
 * Format full address from components
 */
export function formatAddress(gym: {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}): string {
  return [gym.address, gym.city, gym.state, gym.country]
    .filter(Boolean)
    .join(", ");
}
