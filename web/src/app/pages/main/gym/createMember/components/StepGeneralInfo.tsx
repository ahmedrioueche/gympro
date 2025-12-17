import { DEFAULT_COUNTRY_CODE } from "@ahmedrioueche/gympro-client";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../components/ui/InputField";
import PhoneNumberInput, {
  usePhoneNumber,
} from "../../../../../../components/ui/PhoneNumberInput";

interface FormData {
  email: string;
  phoneNumber: string;
  fullName: string;
  gender: string;
  age: string;
  isContactless: boolean;
  subscriptionTypeId: string;
  subscriptionStartDate: string;
  paymentMethod: string;
  contactMethod: "email" | "phone";
  sendWelcomeMessage: boolean;
  notes: string;
}

interface FormErrors {
  email?: string;
  phoneNumber?: string;
  fullName?: string;
  gender?: string;
  age?: string;
  contact?: string;
}

interface StepGeneralInfoProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (field: keyof FormData, value: string | boolean) => void;
}

function StepGeneralInfo({
  formData,
  errors,
  handleInputChange,
}: StepGeneralInfoProps) {
  const { t } = useTranslation();
  const phone = usePhoneNumber(DEFAULT_COUNTRY_CODE);

  const genderOptions = [
    { value: "", label: t("createMember.form.gender.placeholder") },
    { value: "male", label: t("createMember.form.gender.male") },
    { value: "female", label: t("createMember.form.gender.female") },
  ];

  useEffect(() => {
    if (formData.contactMethod === "phone" && !formData.isContactless) {
      // Only derive full phone number when the input looks long enough to avoid
      // noisy libphonenumber parsing errors while the user is still typing.
      if (phone.isValid()) {
        const fullPhoneNumber = phone.getFullPhoneNumber();
        handleInputChange("phoneNumber", fullPhoneNumber);
      }
    }
  }, [
    phone.countryCode,
    phone.phoneNumber,
    formData.contactMethod,
    formData.isContactless,
  ]);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
          <span className="text-2xl">👤</span>
          {t("createMember.steps.general.title")}
        </h2>
        <p className="text-text-secondary text-sm">
          {t("createMember.steps.general.description")}
        </p>
      </div>

      {/* Personal Info Row */}
      <div className="grid grid-cols-1 gap-6">
        <InputField
          type="text"
          label={t("createMember.form.fullName.label")}
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          placeholder={t("createMember.form.fullName.placeholder")}
          required
          error={errors.fullName}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CustomSelect
            title={t("createMember.form.gender.label")}
            options={genderOptions}
            selectedOption={formData.gender}
            onChange={(value) => handleInputChange("gender", value)}
            error={errors.gender}
          />

          <InputField
            type="number"
            label={t("createMember.form.age.label")}
            value={formData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            placeholder={t("createMember.form.age.placeholder")}
            min="1"
            max="150"
            error={errors.age}
            required
          />
        </div>
      </div>

      <div className="border-t border-border my-6"></div>

      {/* Contactless Toggle */}
      <div className="bg-surface/50 border border-border rounded-xl p-4 transition-all hover:border-primary/50">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary mb-1">
              Enable Contactless Member
            </h3>
            <p className="text-sm text-text-secondary">
              Create a member without email or phone number. They won't receive
              notifications or login credentials.
            </p>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.isContactless}
              onChange={(e) =>
                handleInputChange("isContactless", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </div>
        </label>
      </div>

      {/* Contact Method Selection (Only show if NOT contactless) */}
      {!formData.isContactless && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-3">
              {t("createMember.form.contactMethod.label")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange("contactMethod", "email")}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.contactMethod === "email"
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-border bg-surface hover:border-primary/50"
                }`}
              >
                <div className="flex flex-row justify-center items-center gap-2">
                  <span className="text-3xl">📧</span>
                  <span
                    className={`text-sm font-semibold ${
                      formData.contactMethod === "email"
                        ? "text-primary"
                        : "text-text-primary"
                    }`}
                  >
                    {t("createMember.form.contactMethod.email")}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleInputChange("contactMethod", "phone")}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.contactMethod === "phone"
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-border bg-surface hover:border-primary/50"
                }`}
              >
                <div className="flex flex-row justify-center items-center gap-2">
                  <span className="text-3xl">📱</span>
                  <span
                    className={`text-sm font-semibold ${
                      formData.contactMethod === "phone"
                        ? "text-primary"
                        : "text-text-primary"
                    }`}
                  >
                    {t("createMember.form.contactMethod.phone")}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Contact Field */}
          {formData.contactMethod === "email" ? (
            <InputField
              type="email"
              label={t("createMember.form.email.label")}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={t("createMember.form.email.placeholder")}
              error={errors.email}
              required
            />
          ) : (
            <div>
              <PhoneNumberInput
                countryCode={phone.countryCode}
                phoneNumber={phone.phoneNumber}
                onCountryCodeChange={phone.setCountryCode}
                onPhoneNumberChange={phone.setPhoneNumber}
                required
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-danger">{errors.phoneNumber}</p>
              )}
            </div>
          )}
        </div>
      )}

      {errors.contact && (
        <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm flex items-center gap-2 animate-pulse">
          <span>⚠️</span>
          {errors.contact}
        </div>
      )}
    </div>
  );
}

export default StepGeneralInfo;
