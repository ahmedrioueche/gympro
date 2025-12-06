import { Phone } from "lucide-react";
import React from "react";
import { COUNTRY_CODES } from "../../constants/countryCodes";
import {
  formatPhoneDigitsForInput,
  getExampleNumber,
  parsePhoneNumber,
} from "../../utils/phone.util";
import CustomSelect from "./CustomSelect";

interface PhoneNumberInputProps {
  // Value props
  countryCode: string;
  phoneNumber: string;

  // Change handlers
  onCountryCodeChange: (code: string) => void;
  onPhoneNumberChange: (digits: string) => void;

  // Optional props
  id?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;

  // Layout customization
  countryCodeWidth?: string;
  showIcon?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  id = "phoneNumber",
  name = "phoneNumber",
  required = false,
  placeholder,
  disabled = false,
  className = "",
  countryCodeWidth = "w-32",
  showIcon = true,
}) => {
  // Format country code options with flags
  const countryCodeOptions = COUNTRY_CODES.map((country) => ({
    value: country.code,
    label: country.code,
    flag: country.flag,
  }));

  // Handle phone number input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");
    onPhoneNumberChange(digitsOnly);
  };

  // Get placeholder text
  const placeholderText = placeholder || getExampleNumber(countryCode);

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Country Code Selector */}
      <div className={`${countryCodeWidth} flex-shrink-0`}>
        <CustomSelect
          title=""
          options={countryCodeOptions}
          selectedOption={countryCode}
          onChange={onCountryCodeChange}
          className="text-sm"
          marginTop="mt-0"
          disabled={disabled}
        />
      </div>

      {/* Phone Number Input */}
      <div className="flex-1">
        <div className="relative">
          {showIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-text-secondary" />
            </div>
          )}
          <input
            id={id}
            name={name}
            type="tel"
            required={required}
            disabled={disabled}
            value={formatPhoneDigitsForInput(phoneNumber)}
            onChange={handlePhoneChange}
            placeholder={placeholderText}
            className={`${
              showIcon ? "pl-10" : "pl-4"
            } w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        </div>
      </div>
    </div>
  );
};

// Helper hook for managing phone number state
export const usePhoneNumber = (initialCountryCode = "+213") => {
  const [countryCode, setCountryCode] = React.useState(initialCountryCode);
  const [phoneNumber, setPhoneNumber] = React.useState("");

  // Get the full formatted phone number
  const getFullPhoneNumber = () => {
    return parsePhoneNumber(countryCode, phoneNumber);
  };

  // Validate phone number
  const isValid = () => {
    return phoneNumber.trim().length >= 7 && phoneNumber.length <= 15;
  };

  // Reset phone number
  const reset = () => {
    setCountryCode(initialCountryCode);
    setPhoneNumber("");
  };

  return {
    countryCode,
    phoneNumber,
    setCountryCode,
    setPhoneNumber,
    getFullPhoneNumber,
    isValid,
    reset,
  };
};

export default PhoneNumberInput;
