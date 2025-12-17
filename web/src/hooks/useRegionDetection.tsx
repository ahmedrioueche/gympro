import type { RegionDetectionResult } from "@ahmedrioueche/gympro-client";
import {
  DEFAULT_REGION,
} from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import { detectRegion } from "../lib/api/regionDetection";

interface UseRegionDetectionOptions {
  /**
   * Whether to automatically detect region on mount
   * @default true
   */
  autoDetect?: boolean;
  /**
   * Callback when region is detected
   */
  onDetected?: (result: RegionDetectionResult) => void;
  /**
   * Callback when detection fails
   */
  onError?: (error: Error) => void;
}

interface UseRegionDetectionReturn {
  /**
   * Detected region data
   */
  regionData: RegionDetectionResult;
  /**
   * Whether the region was successfully detected (vs using default)
   */
  isDetected: boolean;
  /**
   * Whether detection is in progress
   */
  isLoading: boolean;
  /**
   * Error if detection failed
   */
  error: Error | null;
  /**
   * Manually trigger region detection
   */
  detectRegion: () => Promise<void>;
  /**
   * Manually update region data
   */
  updateRegionData: (data: Partial<RegionDetectionResult>) => void;
}

/**
 * Hook to handle region detection with IP and geolocation fallback
 */
export function useRegionDetection(
  options: UseRegionDetectionOptions = {}
): UseRegionDetectionReturn {
  const {
    autoDetect = true,
    onDetected,
    onError,
  } = options;

  const [regionData, setRegionData] = useState<RegionDetectionResult>({
    region: DEFAULT_REGION.region,
    regionName: DEFAULT_REGION.regionName,
    currency: DEFAULT_REGION.currency,
    timezone: DEFAULT_REGION.timezone,
  });
  const [isDetected, setIsDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Detect region from IP address
   */
  const detectFromIP = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const detected = await detectRegion();

      // Check if detection was successful (not just default fallback)
      const wasDetected =
        detected.region !== DEFAULT_REGION.region ||
        detected.regionName !== DEFAULT_REGION.regionName;

      setRegionData(detected);
      setIsDetected(wasDetected);
      onDetected?.(detected);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Detection failed");
      setError(error);
      onError?.(error);

      // Set default region on error
      setRegionData({
        region: DEFAULT_REGION.region,
        regionName: DEFAULT_REGION.regionName,
        currency: DEFAULT_REGION.currency,
        timezone: DEFAULT_REGION.timezone,
      });
      setIsDetected(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manually update region data
   */
  const updateRegionData = (data: Partial<RegionDetectionResult>) => {
    setRegionData((prev) => ({ ...prev, ...data }));
  };

  // Auto-detect on mount if enabled
  useEffect(() => {
    if (autoDetect) {
      detectFromIP();
    }
  }, [autoDetect]);

  return {
    regionData,
    isDetected,
    isLoading,
    error,
    detectRegion: detectFromIP,
    updateRegionData,
  };
}
