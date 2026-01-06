import { Calendar, Megaphone, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

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
        "Class Reminders"
      ),
      description: t(
        "settings.member.notifications.classRemindersDesc",
        "Get notified before your scheduled classes"
      ),
      icon: Calendar,
      checked: classReminders,
      onChange: setClassReminders,
    },
    {
      id: "subscriptionRenewal",
      title: t(
        "settings.member.notifications.subscriptionRenewal",
        "Renewal Alerts"
      ),
      description: t(
        "settings.member.notifications.subscriptionRenewalDesc",
        "Notified when your subscription is about to expire"
      ),
      icon: RefreshCw,
      checked: subscriptionRenewal,
      onChange: setSubscriptionRenewal,
    },
    {
      id: "announcements",
      title: t(
        "settings.member.notifications.announcements",
        "Gym Announcements"
      ),
      description: t(
        "settings.member.notifications.announcementsDesc",
        "Stay updated with important gym news"
      ),
      icon: Megaphone,
      checked: announcements,
      onChange: setAnnouncements,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {t("settings.member.notifications.title", "Notifications")}
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.member.notifications.description",
            "Choose how and when you want to be notified"
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
    </div>
  );
}
