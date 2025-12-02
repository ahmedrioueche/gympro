/**
 * Phone number utilities for normalization and validation
 */

/**
 * Normalize phone number to E.164 format
 * @param phone - Phone number to normalize
 * @param defaultCountryCode - Default country code if not provided (e.g., '+213')
 * @returns Normalized phone number in E.164 format
 */
export function normalizePhoneNumber(
  phone: string,
  defaultCountryCode: string = '+1',
): string {
  // Remove all non-digit characters except +
  let normalized = phone.replace(/[^\d+]/g, '');

  // If it doesn't start with +, add the default country code
  if (!normalized.startsWith('+')) {
    // Remove leading zeros
    normalized = normalized.replace(/^0+/, '');
    normalized = defaultCountryCode + normalized;
  }

  return normalized;
}

/**
 * Validate phone number format (basic E.164 validation)
 * @param phone - Phone number to validate
 * @returns true if valid E.164 format
 */
export function validatePhoneNumber(phone: string): boolean {
  // E.164 format: +[country code][number]
  // Length: 8-15 digits (including country code)
  const e164Regex = /^\+[1-9]\d{7,14}$/;
  return e164Regex.test(phone);
}

/**
 * Detect if input string is a phone number or email
 * @param input - Input string to check
 * @returns true if input appears to be a phone number
 */
export function isPhoneNumber(input: string): boolean {
  // Remove whitespace
  const trimmed = input.trim();

  // Check if it starts with + or contains only digits and common phone separators
  const phonePattern = /^[\d\s\-\+\(\)]+$/;

  // Must contain at least some digits
  const hasDigits = /\d/.test(trimmed);

  // Email pattern (basic check)
  const emailPattern = /@/;

  // If it contains @, it's likely an email
  if (emailPattern.test(trimmed)) {
    return false;
  }

  // If it matches phone pattern and has digits, it's likely a phone
  return phonePattern.test(trimmed) && hasDigits;
}

/**
 * Format phone number for display
 * @param phone - Phone number in E.164 format
 * @returns Formatted phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return '';

  // Remove + prefix for formatting
  const digits = phone.replace(/^\+/, '');

  // Basic formatting (can be enhanced based on country code)
  if (digits.length >= 10) {
    // Format as: +X XXX XXX XXXX (generic format)
    const countryCode = digits.slice(0, digits.length - 9);
    const areaCode = digits.slice(-9, -6);
    const firstPart = digits.slice(-6, -3);
    const lastPart = digits.slice(-3);

    return `+${countryCode} ${areaCode} ${firstPart} ${lastPart}`;
  }

  return phone;
}

/**
 * Extract country code from phone number
 * @param phone - Phone number in E.164 format
 * @returns Country code (e.g., '+1', '+213')
 */
export function extractCountryCode(phone: string): string | null {
  if (!phone.startsWith('+')) return null;

  // Common country codes are 1-3 digits
  const match = phone.match(/^\+(\d{1,3})/);
  return match ? `+${match[1]}` : null;
}
