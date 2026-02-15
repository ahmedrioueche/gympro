import { Eye, Shield, ShieldCheck, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import SettingsTab from "../../../../../../components/settings/SettingsTab";

interface PrivacyTabProps {
  publicProfile: boolean;
  setPublicProfile: (value: boolean) => void;
  shareProgress: boolean;
  setShareProgress: (value: boolean) => void;
}

export default function PrivacyTab({
  publicProfile,
  setPublicProfile,
  shareProgress,
  setShareProgress,
}: PrivacyTabProps) {
  const { t } = useTranslation();

  const settings = [
    {
      id: "publicProfile",
      title: t("settings.member.privacy.publicProfile", "Public Profile (Gym)"),
      description: t(
        "settings.member.privacy.publicProfileDesc",
        "Allow other gym members to see your profile",
      ),
      icon: UserCheck,
      checked: publicProfile,
      onChange: setPublicProfile,
    },
    {
      id: "shareProgress",
      title: t("settings.member.privacy.shareProgress", "Share Progress"),
      description: t(
        "settings.member.privacy.shareProgressDesc",
        "Allow gym coaches to see your workout history",
      ),
      icon: ShieldCheck,
      checked: shareProgress,
      onChange: setShareProgress,
    },
  ];

  return (
    <SettingsTab
      title={t("settings.member.privacy.title", "Privacy Settings")}
      description={t(
        "settings.member.privacy.description",
        "Control your data and visibility within the gym",
      )}
      icon={Shield}
    >
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("settings.member.privacy.visibility", "Visibility Control")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "settings.member.privacy.visibilityDesc",
            "Manage who can see your activity details",
          )}
        </p>

        <div className="space-y-3">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center gap-4 p-4 bg-surface-hover/50 rounded-2xl border border-border/50 hover:bg-surface-hover transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  setting.checked
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-surface text-text-secondary border border-border/50"
                }`}
              >
                <setting.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label
                  htmlFor={setting.id}
                  className="text-sm font-semibold text-text-primary cursor-pointer block"
                >
                  {setting.title}
                </label>
                <p className="text-xs text-text-secondary mt-0.5">
                  {setting.description}
                </p>
              </div>
              <button
                onClick={() => setting.onChange(!setting.checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  setting.checked ? "bg-primary" : "bg-border/60"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    setting.checked ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-10 border-t border-border">
        <div className="p-5 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-start gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-text-primary">
              {t("settings.member.privacy.tip", "Privacy Control")}
            </h4>
            <p className="text-sm text-text-secondary mt-1 max-w-lg">
              {t(
                "settings.member.privacy.tipDesc",
                "These settings are gym-specific. You can have different privacy settings for each gym you follow.",
              )}
            </p>
          </div>
        </div>
      </div>
    </SettingsTab>
  );
}
