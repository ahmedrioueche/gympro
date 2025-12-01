import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../components/ui/InputField";

interface FormData {
  email: string;
  phoneNumber: string;
  fullName: string;
  gender: string;
  age: string;
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

  const genderOptions = [
    { value: "", label: t("createMember.form.gender.placeholder") },
    { value: "male", label: t("createMember.form.gender.male") },
    { value: "female", label: t("createMember.form.gender.female") },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
          <span className="text-2xl">👤</span>
          {t("createMember.steps.general.title")}
        </h2>
        <p className="text-text-secondary text-sm">
          {t("createMember.steps.general.description")}
        </p>
      </div>

      {/* Contact Method Selection */}
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
        <InputField
          type="tel"
          label={t("createMember.form.phone.label")}
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          placeholder={t("createMember.form.phone.placeholder")}
          error={errors.phoneNumber}
          required
        />
      )}

      {/* Full Name */}
      <InputField
        type="text"
        label={t("createMember.form.fullName.label")}
        value={formData.fullName}
        onChange={(e) => handleInputChange("fullName", e.target.value)}
        placeholder={t("createMember.form.fullName.placeholder")}
        required
      />

      {/* Gender and Age Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CustomSelect
          title={t("createMember.form.gender.label")}
          options={genderOptions}
          selectedOption={formData.gender}
          onChange={(value) => handleInputChange("gender", value)}
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
        />
      </div>

      {errors.contact && (
        <p className="text-danger text-sm flex items-center gap-2">
          <span>⚠️</span>
          {errors.contact}
        </p>
      )}
    </div>
  );
}

export default StepGeneralInfo;
