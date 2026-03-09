import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../components/ui/InputField";
import SettingsTab from "./SettingsTab";

interface SecuritySettingsProps {
  currentPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  newPassword: string;
  onNewPasswordChange: (value: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (value: string) => void;
  title?: string;
  description?: string;
}

export default function SecuritySettings({
  currentPassword,
  onCurrentPasswordChange,
  newPassword,
  onNewPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  title,
  description,
}: SecuritySettingsProps) {
  const { t } = useTranslation();

  return (
    <SettingsTab
      title={title || t("member.settings.security.title", "Security Settings")}
      description={
        description ||
        t(
          "member.settings.security.subtitle",
          "Manage your password and security preferences",
        )
      }
      icon={Lock}
    >
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
    </SettingsTab>
  );
}
