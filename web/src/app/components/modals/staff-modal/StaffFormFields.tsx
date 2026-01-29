import type { GymPermission } from "@ahmedrioueche/gympro-client";
import { Mail, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../components/ui/CustomSelect";
import InputField from "../../../../components/ui/InputField";
import PhoneNumberInput from "../../../../components/ui/PhoneNumberInput";
import PermissionSelector from "./PermissionSelector";

type StaffRole =
  | "manager"
  | "receptionist"
  | "coach"
  | "cleaner"
  | "maintenance";

interface StaffFormFieldsProps {
  formData: {
    fullName: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    role: StaffRole;
    permissions: GymPermission[];
  };
  errors: Partial<{
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
  }>;
  onChange: (field: string, value: string | GymPermission[]) => void;
}

export default function StaffFormFields({
  formData,
  errors,
  onChange,
}: StaffFormFieldsProps) {
  const { t } = useTranslation();

  const roleOptions = [
    { value: "manager", label: t("staff.roles.manager") },
    { value: "receptionist", label: t("staff.roles.receptionist") },
    { value: "coach", label: t("staff.roles.coach") },
    { value: "cleaner", label: t("staff.roles.cleaner") },
    { value: "maintenance", label: t("staff.roles.maintenance") },
  ];

  const isOfflineRole = ["cleaner", "maintenance"].includes(formData.role);

  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div className="space-y-4">
        {/* Full Name */}
        <InputField
          id="fullName"
          name="fullName"
          label={t("staff.form.name")}
          placeholder={t("staff.form.namePlaceholder")}
          value={formData.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          error={errors.fullName}
          leftIcon={<User className="w-5 h-5" />}
          required
        />

        {/* Email */}
        <InputField
          id="email"
          name="email"
          type="email"
          label={t("staff.form.email")}
          placeholder={t("staff.form.emailPlaceholder")}
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="w-5 h-5" />}
        />

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t("staff.form.phone")}
          </label>
          <PhoneNumberInput
            countryCode={formData.countryCode}
            phoneNumber={formData.phoneNumber}
            onCountryCodeChange={(code) => onChange("countryCode", code)}
            onPhoneNumberChange={(digits) => onChange("phoneNumber", digits)}
            placeholder={t("staff.form.phonePlaceholder")}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Role Selection */}
        <CustomSelect
          title={t("staff.form.role")}
          label={t("staff.form.role")}
          selectedOption={formData.role}
          onChange={(val) => onChange("role", val)}
          options={roleOptions}
          error={errors.role}
        />

        {/* Contact Hint */}
        <p className="text-xs text-text-secondary">
          {isOfflineRole
            ? t("staff.form.offlineRoleHint")
            : t("staff.form.contactHint")}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Permissions Section - Only show for login roles */}
      {!isOfflineRole && (
        <PermissionSelector
          selectedPermissions={formData.permissions}
          onChange={(permissions) => onChange("permissions", permissions)}
          role={formData.role}
        />
      )}
    </div>
  );
}
