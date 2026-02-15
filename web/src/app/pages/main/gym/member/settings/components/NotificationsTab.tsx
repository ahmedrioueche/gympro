import { Bell, Calendar, Megaphone, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import SettingsTab from "../../../../../../components/settings/SettingsTab";

interface NotificationsTabProps {
  classReminders: boolean;
  setClassReminders: (value: boolean) => void;
  subscriptionRenewal: boolean;
  setSubscriptionRenewal: (value: boolean) => void;
  announcements: boolean;
  setAnnouncements: (value: boolean) => void;
}

export default function NotificationsTab({
  classReminders,
  setClassReminders,
  subscriptionRenewal,
  setSubscriptionRenewal,
  announcements,
  setAnnouncements,
}: NotificationsTabProps) {
  const { t } = useTranslation();

  const settings = [
    {
      id: "classReminders",
      title: t(
        "settings.member.notifications.classReminders",
        "Class Reminders",
      ),
      description: t(
        "settings.member.notifications.classRemindersDesc",
        "Get notified before your scheduled classes",
      ),
      icon: Calendar,
      checked: classReminders,
      onChange: setClassReminders,
    },
    {
      id: "subscriptionRenewal",
      title: t(
        "settings.member.notifications.subscriptionRenewal",
        "Renewal Alerts",
      ),
      description: t(
        "settings.member.notifications.subscriptionRenewalDesc",
        "Notified when your subscription is about to expire",
      ),
      icon: RefreshCw,
      checked: subscriptionRenewal,
      onChange: setSubscriptionRenewal,
    },
    {
      id: "announcements",
      title: t(
        "settings.member.notifications.announcements",
        "Gym Announcements",
      ),
      description: t(
        "settings.member.notifications.announcementsDesc",
        "Stay updated with important gym news",
      ),
      icon: Megaphone,
      checked: announcements,
      onChange: setAnnouncements,
    },
  ];

  return (
    <SettingsTab
      title={t("settings.member.notifications.title", "Notification Settings")}
      description={t(
        "settings.member.notifications.description",
        "Choose how and when you want to be notified",
      )}
      icon={Bell}
    >
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("settings.member.notifications.preferences", "Alert Preferences")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "settings.member.notifications.preferencesDesc",
            "Configure your notification channels",
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
    </SettingsTab>
  );
}
