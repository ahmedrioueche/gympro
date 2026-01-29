import { useTranslation } from "react-i18next";
import InputField from "../../../components/ui/InputField";

interface SecuritySettingsProps {
  currentPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  newPassword: string;
  onNewPasswordChange: (value: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (value: string) => void;
}

export default function SecuritySettings({
  currentPassword,
  onCurrentPasswordChange,
  newPassword,
  onNewPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
}: SecuritySettingsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          {t("member.settings.security.title")}
        </h3>
        <p className="text-sm text-text-secondary">
          {t("member.settings.security.subtitle")}
        </p>
      </div>

      <form className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <InputField
            label={t("member.settings.security.currentPassword")}
            placeholder={t(
              "member.settings.security.currentPasswordPlaceholder",
            )}
            type="password"
            value={currentPassword}
            onChange={(e) => onCurrentPasswordChange(e.target.value)}
            required
            autoComplete="current-password"
          />

          <InputField
            label={t("member.settings.security.newPassword")}
            placeholder={t("member.settings.security.newPasswordPlaceholder")}
            type="password"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />

          <InputField
            label={t("member.settings.security.confirmPassword")}
            placeholder={t(
              "member.settings.security.confirmPasswordPlaceholder",
            )}
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
      </form>
    </div>
  );
}
