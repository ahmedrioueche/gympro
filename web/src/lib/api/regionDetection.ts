import type {
  RegionCode,
  RegionDetectionResult,
  SupportedCurrency,
} from "@ahmedrioueche/gympro-client";
import {
  DEFAULT_REGION,
  SUPPORTED_REGIONS,
  usersApi,
} from "@ahmedrioueche/gympro-client";

/**
 * Detect region and currency from user's IP address
 */
export async function detectRegion(): Promise<RegionDetectionResult> {
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
    region: DEFAULT_REGION.region,
    regionName: DEFAULT_REGION.regionName,
    currency: DEFAULT_REGION.currency,
    timezone: DEFAULT_REGION.timezone,
  };
}

/**
 * Map region code to currency
 */
export function mapRegionToCurrency(regionCode: string): string {
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
  currency: SupportedCurrency;
}> {
  return Object.entries(SUPPORTED_REGIONS).map(([code, data]) => {
    const anyData = data as any;
    const name =
      anyData.name ||
      anyData.regionName ||
      anyData.label ||
      code.toString().toUpperCase();

    return {
      code,
      name,
      currency: anyData.currency as SupportedCurrency,
    };
  });
}
