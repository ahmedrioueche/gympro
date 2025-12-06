import {
  isValidPhoneNumber,
  parsePhoneNumberWithError as libParsePhoneNumber,
  type CountryCode,
} from "libphonenumber-js";
import { COUNTRY_CODES } from "../constants/countryCodes";

/**
 * Create a map of country codes to ISO codes
 * Handles cases where multiple countries share the same code (e.g., +1 for US/CA)
 */
const createCountryCodeMap = (): Record<string, CountryCode> => {
  const map: Record<string, CountryCode> = {};

  // Map of country names to ISO codes
  const nameToISO: Record<string, CountryCode> = {
    "United States": "US",
    Canada: "CA",
    Russia: "RU",
    Kazakhstan: "KZ",
    Algeria: "DZ",
    France: "FR",
    "United Kingdom": "GB",
    Germany: "DE",
    Spain: "ES",
    Italy: "IT",
    Tunisia: "TN",
    Morocco: "MA",
    Egypt: "EG",
    "Saudi Arabia": "SA",
    China: "CN",
    India: "IN",
    Brazil: "BR",
    Mexico: "MX",
    Switzerland: "CH",
    Australia: "AU",
    Japan: "JP",
    "South Korea": "KR",
    Turkey: "TR",
    "United Arab Emirates": "AE",
    "South Africa": "ZA",
    Nigeria: "NG",
    Kenya: "KE",
    Pakistan: "PK",
    Bangladesh: "BD",
    Indonesia: "ID",
    Thailand: "TH",
    Vietnam: "VN",
    Philippines: "PH",
    Malaysia: "MY",
    Singapore: "SG",
    Argentina: "AR",
    Colombia: "CO",
    Chile: "CL",
    Peru: "PE",
    Venezuela: "VE",
    Poland: "PL",
    Ukraine: "UA",
    Romania: "RO",
    Netherlands: "NL",
    Belgium: "BE",
    Sweden: "SE",
    Norway: "NO",
    Denmark: "DK",
    Finland: "FI",
    Austria: "AT",
    Portugal: "PT",
    Greece: "GR",
    "Czech Republic": "CZ",
    Hungary: "HU",
    Ireland: "IE",
    "New Zealand": "NZ",
    Israel: "IL",
    Lebanon: "LB",
    Jordan: "JO",
    Kuwait: "KW",
    Qatar: "QA",
    Bahrain: "BH",
    Oman: "OM",
    Iraq: "IQ",
    Syria: "SY",
    Yemen: "YE",
    Libya: "LY",
  };

  // Build map from COUNTRY_CODES
  COUNTRY_CODES.forEach((country) => {
    const isoCode = nameToISO[country.name];
    if (isoCode) {
      // For duplicate country codes (like +1), use the first one as default
      if (!map[country.code]) {
        map[country.code] = isoCode;
      }
    }
  });

  return map;
};

const countryCodeToISO = createCountryCodeMap();

/**
 * Parse phone number with explicit country code using libphonenumber
 * Handles all international formats correctly
 */
export function parsePhoneNumber(
  countryCode: string,
  phoneNumber: string
): string {
  try {
    const countryISO = countryCodeToISO[countryCode];

    if (!countryISO) {
      // Fallback: simple concatenation for unknown countries
      console.warn(`Unknown country code: ${countryCode}, using fallback`);
      let digits = phoneNumber.replace(/\D/g, "");
      digits = digits.replace(/^0+/, ""); // Remove leading zeros as best guess
      return `${countryCode}${digits}`;
    }

    // Parse with library (handles all edge cases)
    const parsed = libParsePhoneNumber(phoneNumber, countryISO);

    if (!parsed || !parsed.isValid()) {
      throw new Error("Invalid phone number");
    }

    // Return E.164 format
    return parsed.format("E.164");
  } catch (error) {
    // Fallback to manual parsing
    console.warn("Phone parsing failed, using fallback:", error);
    let digits = phoneNumber.replace(/\D/g, "");
    digits = digits.replace(/^0+/, "");
    return `${countryCode}${digits}`;
  }
}

/**
 * Validate phone number for specific country
 */
export function validatePhoneNumberForCountry(
  phoneNumber: string,
  countryCode: string
): boolean {
  try {
    const countryISO = countryCodeToISO[countryCode];
    if (!countryISO) return true; // Skip validation for unknown countries

    const fullNumber = parsePhoneNumber(countryCode, phoneNumber);
    return isValidPhoneNumber(fullNumber, countryISO);
  } catch {
    return false;
  }
}

/**
 * Validate phone number (any country)
 */
export function validatePhoneNumber(phone: string): boolean {
  try {
    return isValidPhoneNumber(phone);
  } catch {
    return false;
  }
}

/**
 * Format phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
  try {
    const parsed = libParsePhoneNumber(phone);
    if (parsed) {
      return parsed.formatInternational(); // e.g., "+213 773 50 84 26"
    }
  } catch {
    // Fallback to basic formatting
  }
  return phone;
}

/**
 * Format digits only for input field display
 */
export function formatPhoneDigitsForInput(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, "");
}

/**
 * Get example phone number for country (helpful for placeholders)
 */
export function getExampleNumber(countryCode: string): string {
  const examples: Record<string, string> = {
    "+1": "(555) 123-4567",
    "+7": "495 123-45-67",
    "+20": "0100 123 4567",
    "+27": "071 234 5678",
    "+30": "691 234 5678",
    "+31": "06 12345678",
    "+32": "0470 12 34 56",
    "+33": "06 12 34 56 78",
    "+34": "612 34 56 78",
    "+36": "06 20 123 4567",
    "+39": "333 123 4567",
    "+40": "0712 345 678",
    "+41": "079 123 45 67",
    "+43": "0664 123456",
    "+44": "07123 456789",
    "+45": "20 12 34 56",
    "+46": "070-123 45 67",
    "+47": "406 12 345",
    "+48": "512 345 678",
    "+49": "0170 1234567",
    "+51": "912 345 678",
    "+52": "55 1234 5678",
    "+53": "5 1234567",
    "+54": "11 2345-6789",
    "+55": "11 98765-4321",
    "+56": "9 8765 4321",
    "+57": "321 1234567",
    "+58": "412-1234567",
    "+60": "012-345 6789",
    "+61": "0412 345 678",
    "+62": "0812-3456-7890",
    "+63": "0905 123 4567",
    "+64": "021 123 4567",
    "+65": "8123 4567",
    "+66": "081 234 5678",
    "+81": "090-1234-5678",
    "+82": "010-1234-5678",
    "+84": "091 234 56 78",
    "+86": "131 2345 6789",
    "+90": "0532 123 45 67",
    "+91": "098765 43210",
    "+92": "0301 2345678",
    "+93": "070 123 4567",
    "+94": "071 234 5678",
    "+95": "09 212 3456",
    "+98": "0912 345 6789",
    "+212": "0612 345678",
    "+213": "0773 60 29 44",
    "+216": "20 123 456",
    "+218": "091-2345678",
    "+220": "301 2345",
    "+221": "77 123 45 67",
    "+222": "22 12 34 56",
    "+223": "70 12 34 56",
    "+224": "601 12 34 56",
    "+225": "01 23 45 67 89",
    "+226": "70 12 34 56",
    "+227": "93 12 34 56",
    "+228": "90 12 34 56",
    "+229": "90 01 12 34",
    "+230": "5251 2345",
    "+231": "770 123 456",
    "+232": "076 123456",
    "+233": "023 123 4567",
    "+234": "0802 123 4567",
    "+235": "63 01 23 45",
    "+236": "70 01 23 45",
    "+237": "6 71 23 45 67",
    "+238": "991 12 34",
    "+239": "981 2345",
    "+240": "222 123 456",
    "+241": "06 01 23 45",
    "+242": "06 123 4567",
    "+243": "0970 123 456",
    "+244": "923 123 456",
    "+245": "955 012 345",
    "+246": "246 123 4567",
    "+248": "2 510 123",
    "+249": "091 123 1234",
    "+250": "072 123 4567",
    "+251": "091 123 4567",
    "+252": "90 7123456",
    "+253": "77 83 10 01",
    "+254": "0712 123456",
    "+255": "0621 234 567",
    "+256": "0712 345678",
    "+257": "79 56 12 34",
    "+258": "82 123 4567",
    "+260": "095 5123456",
    "+261": "032 12 345 67",
    "+262": "0692 12 34 56",
    "+263": "071 234 5678",
    "+264": "081 234 5678",
    "+265": "0991 23 45 67",
    "+266": "5012 3456",
    "+267": "71 123 456",
    "+268": "7612 3456",
    "+269": "321 23 45",
    "+290": "51234",
    "+291": "07 123 456",
    "+297": "560 1234",
    "+298": "211234",
    "+299": "22 12 34",
    "+350": "57123456",
    "+351": "912 345 678",
    "+352": "628 123 456",
    "+353": "085 012 3456",
    "+354": "611 1234",
    "+355": "067 212 3456",
    "+356": "9696 1234",
    "+357": "96 123456",
    "+358": "041 2345678",
    "+359": "048 123 456",
    "+370": "612 34567",
    "+371": "21 234 567",
    "+372": "5123 4567",
    "+373": "0621 12 345",
    "+374": "077 123456",
    "+375": "029 491-19-11",
    "+376": "312 345",
    "+377": "06 12 34 56 78",
    "+378": "66 66 12 12",
    "+380": "050 123 4567",
    "+381": "060 1234567",
    "+382": "067 622 901",
    "+383": "044 123 456",
    "+385": "091 234 5678",
    "+386": "031 234 567",
    "+387": "061 123 456",
    "+389": "072 345 678",
    "+420": "601 123 456",
    "+421": "0912 123 456",
    "+423": "660 234 567",
    "+500": "51234",
    "+501": "622-1234",
    "+502": "5123 4567",
    "+503": "7012 3456",
    "+504": "9123-4567",
    "+505": "8123 4567",
    "+506": "8312 3456",
    "+507": "6123-4567",
    "+508": "055 12 34",
    "+509": "34 10 1234",
    "+590": "0690 30 12 34",
    "+591": "71234567",
    "+592": "609 1234",
    "+593": "099 123 4567",
    "+594": "0694 20 12 34",
    "+595": "0961 456789",
    "+596": "0696 20 12 34",
    "+597": "741-2345",
    "+598": "094 123 456",
    "+599": "9 518 1234",
    "+670": "7721 2345",
    "+672": "12345",
    "+673": "712 3456",
    "+674": "555 1234",
    "+675": "7012 3456",
    "+676": "771 5123",
    "+677": "74 12345",
    "+678": "591 2345",
    "+679": "701 2345",
    "+680": "620 1234",
    "+681": "82 12 34",
    "+682": "71 234",
    "+683": "7290",
    "+685": "601234",
    "+686": "72012345",
    "+687": "75.12.34",
    "+688": "90 1234",
    "+689": "87 12 34 56",
    "+690": "1234",
    "+691": "350 1234",
    "+692": "235 1234",
    "+850": "0192 123 4567",
    "+852": "5123 4567",
    "+853": "6612 3456",
    "+855": "091 234 567",
    "+856": "020 23 123 456",
    "+880": "01812-345678",
    "+886": "0912 345 678",
    "+960": "771-2345",
    "+961": "71 123 456",
    "+962": "07 9012 3456",
    "+963": "0944 567 890",
    "+964": "0791 234 5678",
    "+965": "500 12345",
    "+966": "050 123 4567",
    "+967": "0712 345 678",
    "+968": "9212 3456",
    "+970": "0599 123 456",
    "+971": "050 123 4567",
    "+972": "050-123-4567",
    "+973": "3600 1234",
    "+974": "3312 3456",
    "+975": "17 12 34 56",
    "+976": "8812 3456",
    "+977": "984-1234567",
    "+992": "917 12 3456",
    "+993": "8 66 123456",
    "+994": "040 123 45 67",
    "+995": "555 12 34 56",
    "+996": "0700 123 456",
    "+998": "91 234 56 78",
  };

  return examples[countryCode] || "123456789";
}

/**
 * Detect if input string is a phone number or email
 */
export function isPhoneNumber(input: string): boolean {
  const trimmed = input.trim();
  const phonePattern = /^[\d\s\-\+\(\)]+$/;
  const hasDigits = /\d/.test(trimmed);
  const emailPattern = /@/;

  if (emailPattern.test(trimmed)) {
    return false;
  }

  return phonePattern.test(trimmed) && hasDigits;
}

/**
 * Normalize phone number to E.164 format (legacy function, kept for compatibility)
 */
export function normalizePhoneNumber(
  phone: string,
  defaultCountryCode: string = "+1"
): string {
  let normalized = phone.replace(/[^\d+]/g, "");

  if (!normalized.startsWith("+")) {
    normalized = normalized.replace(/^0+/, "");
    normalized = defaultCountryCode + normalized;
  }

  return normalized;
}

/**
 * Extract country code and national number from a full phone number string
 * Tries to match against known country codes, prioritizing longer codes first
 */
export function extractCountryCodeAndNumber(
  fullPhoneNumber: string
): { countryCode: string; number: string } | null {
  if (!fullPhoneNumber) return null;

  // Remove all non-digit characters except leading +
  const cleanPhone = fullPhoneNumber.trim().replace(/[^\d+]/g, "");

  // Ensure it starts with + for matching
  const phoneWithPlus = cleanPhone.startsWith("+")
    ? cleanPhone
    : "+" + cleanPhone;

  // Sort country codes by length (descending) to match longest prefix first
  // e.g. match +1242 (Bahamas) before +1 (US)
  const sortedCodes = [...COUNTRY_CODES].sort(
    (a, b) => b.code.length - a.code.length
  );

  for (const country of sortedCodes) {
    if (phoneWithPlus.startsWith(country.code)) {
      const number = phoneWithPlus.slice(country.code.length);
      // Basic validation: number should have some digits left
      if (number.length > 0) {
        return {
          countryCode: country.code,
          number: number,
        };
      }
    }
  }

  return null;
}
