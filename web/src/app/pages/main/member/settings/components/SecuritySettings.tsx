import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";
import { useChangePassword } from "../../../../../../hooks/queries/useAuth";

export default function SecuritySettings() {
  const { t } = useTranslation();
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(
        t("settings.security.passwordMismatch", "Passwords do not match")
      );
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword,
      });
      toast.success(
        t("settings.security.success", "Password updated successfully")
      );
      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      // Error handling is managed partly by hook or we can show specific message here
      toast.error(
        error.message ||
          t("settings.security.error", "Failed to update password")
      );
    }
  };

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

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <InputField
            label={t("member.settings.security.currentPassword")}
            placeholder={t(
              "member.settings.security.currentPasswordPlaceholder"
            )}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <InputField
            label={t("member.settings.security.newPassword")}
            placeholder={t("member.settings.security.newPasswordPlaceholder")}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />

          <InputField
            label={t("member.settings.security.confirmPassword")}
            placeholder={t(
              "member.settings.security.confirmPasswordPlaceholder"
            )}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={changePassword.isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {changePassword.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {changePassword.isPending
              ? "Updating..."
              : t("member.settings.security.changePassword")}
          </button>
        </div>
      </form>
    </div>
  );
}
