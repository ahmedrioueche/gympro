import { Eye, ShieldCheck, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

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
        "Allow other gym members to see your profile"
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
        "Allow gym coaches to see your workout history"
      ),
      icon: ShieldCheck,
      checked: shareProgress,
      onChange: setShareProgress,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {t("settings.member.privacy.title", "Privacy Settings")}
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.member.privacy.description",
            "Control your data and visibility within the gym"
          )}
        </p>

        <div className="space-y-3">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center gap-4 p-4 bg-surface-hover rounded-xl border border-border"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  setting.checked
                    ? "bg-primary/10 text-primary"
                    : "bg-surface text-text-secondary border border-border"
                }`}
              >
                <setting.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label
                  htmlFor={setting.id}
                  className="text-sm font-medium text-text-primary cursor-pointer block"
                >
                  {setting.title}
                </label>
                <p className="text-xs text-text-secondary mt-0.5">
                  {setting.description}
                </p>
              </div>
              <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <input
                  type="checkbox"
                  id={setting.id}
                  checked={setting.checked}
                  onChange={(e) => setting.onChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
        <Eye className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-primary">
            {t("settings.member.privacy.tip", "Privacy Control")}
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            {t(
              "settings.member.privacy.tipDesc",
              "These settings are gym-specific. You can have different privacy settings for each gym you follow."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
