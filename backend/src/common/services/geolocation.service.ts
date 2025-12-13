import { AppCurrency } from '@ahmedrioueche/gympro-client';
import { Injectable, Logger } from '@nestjs/common';

export interface RegionDetectionResult {
  region: string;
  regionName: string;
  currency: AppCurrency;
  timezone?: string;
}

@Injectable()
export class GeolocationService {
  private readonly logger = new Logger(GeolocationService.name);
  private readonly IPAPI_BASE_URL = 'https://ipapi.co';
  private readonly DEFAULT_REGION = {
    region: 'DZ',
    regionName: 'Algeria',
    currency: 'DZD' as AppCurrency,
    timezone: 'Africa/Algiers',
  };

  // Simple in-memory cache to reduce API calls
  private cache = new Map<string, RegionDetectionResult>();
  private readonly CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

  /**
   * Detect region from IP address using ipapi.co
   */
  async detectRegionFromIP(ip: string): Promise<RegionDetectionResult> {
    // Check cache first
    const cached = this.cache.get(ip);
    if (cached) {
      this.logger.debug(`Using cached region for IP: ${ip}`);
      return cached;
    }

    try {
      // Handle localhost and private IPs
      if (this.isPrivateIP(ip)) {
        this.logger.warn(
          `Private/localhost IP detected (${ip}), using default region`,
        );
        return this.DEFAULT_REGION;
      }

      // Call ipapi.co API
      const response = await fetch(`${this.IPAPI_BASE_URL}/${ip}/json/`);

      if (!response.ok) {
        throw new Error(`ipapi.co returned status ${response.status}`);
      }

      const data = await response.json();

      // Check for API errors
      if (data.error) {
        throw new Error(`ipapi.co error: ${data.reason || 'Unknown error'}`);
      }

      const result: RegionDetectionResult = {
        region: data.country_code || this.DEFAULT_REGION.region,
        regionName: data.country_name || this.DEFAULT_REGION.regionName,
        currency: this.mapRegionToCurrency(data.country_code),
        timezone: data.timezone || this.DEFAULT_REGION.timezone,
      };

      // Cache the result
      this.cache.set(ip, result);
      setTimeout(() => this.cache.delete(ip), this.CACHE_TTL);

      this.logger.log(
        `Detected region for IP ${ip}: ${result.regionName} (${result.region})`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to detect region from IP ${ip}: ${error.message}`,
      );
      // Return default region on error
      return this.DEFAULT_REGION;
    }
  }

  /**
   * Map country code to supported currency
   */
  private mapRegionToCurrency(countryCode: string): AppCurrency {
    const currencyMap: Record<string, AppCurrency> = {
      DZ: 'DZD',
      US: 'USD',
      FR: 'EUR',
      DE: 'EUR',
      IT: 'EUR',
      ES: 'EUR',
      BE: 'EUR',
      NL: 'EUR',
      PT: 'EUR',
      AT: 'EUR',
      IE: 'EUR',
      GR: 'EUR',
    };

    return currencyMap[countryCode] || 'DZD'; // Default to DZD if unknown
  }

  /**
   * Check if IP is private/localhost
   */
  private isPrivateIP(ip: string): boolean {
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
      return true;
    }

    // Check for private IP ranges
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^::1$/,
      /^fc00:/,
    ];

    return privateRanges.some((range) => range.test(ip));
  }
}
