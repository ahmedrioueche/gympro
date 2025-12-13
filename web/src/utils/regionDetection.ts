import type { AppCurrency, RegionCode } from "@ahmedrioueche/gympro-client";
import { SUPPORTED_REGIONS, usersApi } from "@ahmedrioueche/gympro-client";

export interface RegionDetection {
  region: string;
  regionName: string;
  currency: AppCurrency;
  timezone?: string;
}

/**
 * Detect region and currency from user's IP address
 */
export async function detectRegion(): Promise<RegionDetection> {
  try {
    const response = await usersApi.detectRegion();
    if (response.data) {
      console.log("Region detected:", response.data);
      return response.data;
    }
  } catch (error) {
    console.error("Failed to detect region:", error);
  }

  // Fallback to default (Algeria)
  return {
    region: "DZ",
    regionName: "Algeria",
    currency: "DZD",
    timezone: "Africa/Algiers",
  };
}

/**
 * Map region code to currency
 */
export function mapRegionToCurrency(regionCode: string): AppCurrency {
  const code = regionCode.toUpperCase() as RegionCode;
  const region = SUPPORTED_REGIONS[code];
  return region?.currency || "DZD";
}

/**
 * Get all supported regions as array for dropdown
 */
export function getSupportedRegions(): Array<{
  code: string;
  name: string;
  currency: AppCurrency;
}> {
  return Object.entries(SUPPORTED_REGIONS).map(([code, data]) => ({
    code,
    name: data.name,
    currency: data.currency,
  }));
}
