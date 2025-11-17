export enum Platform {
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
}

export interface PlatformConfig {
  platform: Platform;
  userAgent?: string;
  customScheme?: string; // For deep links
}

/**
 * Detect platform from user agent or custom header
 */
export const detectPlatform = (
  userAgent: string,
  customHeader?: string,
): Platform => {
  // Check custom header first (e.g., X-App-Platform: mobile)
  if (customHeader) {
    return customHeader as Platform;
  }

  // Detect mobile apps by user agent
  if (userAgent.includes('GymProMobile')) {
    return Platform.MOBILE;
  }

  // Detect desktop apps
  if (userAgent.includes('Electron') || userAgent.includes('GymProDesktop')) {
    return Platform.DESKTOP;
  }

  // Default to web
  return Platform.WEB;
};

/**
 * Get frontend URL based on platform and environment
 */
export const getFrontendUrl = (platform: Platform = Platform.WEB): string => {
  const isDev = process.env.NODE_ENV === 'dev';

  if (isDev) {
    switch (platform) {
      case Platform.MOBILE:
        return process.env.DEV_MOBILE_URL || 'http://localhost:8081'; // Expo/React Native dev server
      case Platform.DESKTOP:
        return process.env.DEV_DESKTOP_URL || 'http://localhost:5174'; // Desktop app dev server
      case Platform.WEB:
      default:
        return process.env.DEV_FRONTEND_URL || 'http://localhost:5173';
    }
  }

  // Production
  switch (platform) {
    case Platform.MOBILE:
      return process.env.PROD_MOBILE_URL || 'gympro://'; // Deep link scheme
    case Platform.DESKTOP:
      return process.env.PROD_DESKTOP_URL || 'https://desktop.gympro-power.com';
    case Platform.WEB:
    default:
      return process.env.PROD_FRONTEND_URL || 'https://gympro-power.vercel.app';
  }
};

/**
 * Build redirect URL for specific platform
 */
export const buildRedirectUrl = (
  platform: Platform,
  path: string,
  params?: Record<string, string>,
): string => {
  const baseUrl = getFrontendUrl(platform);

  // For mobile deep links, use custom scheme
  if (platform === Platform.MOBILE && baseUrl.startsWith('gympro://')) {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return `${baseUrl}${path}${queryString}`;
  }

  // For web/desktop, use standard URLs
  const url = new URL(path, baseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
};
