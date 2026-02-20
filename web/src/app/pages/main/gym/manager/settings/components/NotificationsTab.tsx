import { type GymSettings } from "@ahmedrioueche/gympro-client";
import { Bell, Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import SettingsTab from "../../../../../../components/settings/SettingsTab";

interface NotificationsTabProps {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  reminderSettings?: GymSettings["reminderSettings"];
  setReminderSettings: (settings: GymSettings["reminderSettings"]) => void;
  notifyScheduleChanges?: boolean;
  setNotifyScheduleChanges: (value: boolean) => void;
}

export default function NotificationsTab({
  notificationsEnabled,
  setNotificationsEnabled,
  reminderSettings,
  setReminderSettings,
  notifyScheduleChanges,
  setNotifyScheduleChanges,
}: NotificationsTabProps) {
  const { t } = useTranslation();

  return (
    <SettingsTab
      title={t("settings.gym.notifications.title", "Notification Settings")}
      description={t(
        "settings.gym.notifications.description",
        "Manage how and when your members receive automated alerts.",
      )}
      icon={Bell}
    >
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("settings.gym.notifications.status", "System Notifications")}
        </h4>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.gym.notifications.enabledDesc",
            "Enable or disable gym-wide notifications",
          )}
        </p>

        <div className="flex items-center gap-3 p-4 bg-surface-hover rounded-xl border border-border mb-6">
          <input
            type="checkbox"
            id="notificationsEnabled"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
          />
          <div className="flex-1">
            <label
              htmlFor="notificationsEnabled"
              className="text-sm font-medium text-text-primary cursor-pointer"
            >
              {t("settings.gym.notifications.enabled", "Notifications Enabled")}
            </label>
          </div>
          <Bell className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t(
            "settings.gym.notifications.remindersTitle",
            "Subscription Reminders",
          )}
        </h4>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.gym.notifications.remindersDesc",
            "Configure which reminders are sent to members.",
          )}
        </p>

        {/* Pre-Expiration */}
        <div className="mb-6">
          <h5 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            {t("settings.gym.notifications.preExpiry", "Before Expiration")}
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: "day3", label: "3 Days Before" },
              { key: "day1", label: "1 Day Before (Tomorrow)" },
              { key: "today", label: "On Expiration Date" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 p-3 bg-surface-hover rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={
                    reminderSettings?.preExpiry?.[
                      key as keyof typeof reminderSettings.preExpiry
                    ] !== false
                  }
                  onChange={(e) =>
                    setReminderSettings({
                      ...reminderSettings,
                      preExpiry: {
                        ...reminderSettings?.preExpiry,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-sm text-text-secondary">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Post-Expiration */}
        <div>
          <h5 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            {t(
              "settings.gym.notifications.postExpiry",
              "After Expiration (Win-back)",
            )}
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: "day3", label: "3 Days After" },
              { key: "day7", label: "7 Days After" },
              { key: "day30", label: "30 Days After" },
              { key: "day60", label: "60 Days After" },
              { key: "day90", label: "90 Days After" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 p-3 bg-surface-hover rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={
                    reminderSettings?.postExpiry?.[
                      key as keyof typeof reminderSettings.postExpiry
                    ] !== false
                  }
                  onChange={(e) =>
                    setReminderSettings({
                      ...reminderSettings,
                      postExpiry: {
                        ...reminderSettings?.postExpiry,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-sm text-text-secondary">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t(
            "settings.gym.notifications.scheduleUpdatesTitle",
            "Schedule Updates",
          )}
        </h4>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.gym.notifications.scheduleUpdatesDesc",
            "Automatically notify members when opening hours or working days change.",
          )}
        </p>

        <div className="flex items-center gap-3 p-4 bg-surface-hover rounded-xl border border-border">
          <input
            type="checkbox"
            id="notifyScheduleChanges"
            checked={!!notifyScheduleChanges}
            onChange={(e) => setNotifyScheduleChanges(e.target.checked)}
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
          />
          <div className="flex-1">
            <label
              htmlFor="notifyScheduleChanges"
              className="text-sm font-medium text-text-primary cursor-pointer"
            >
              {t(
                "settings.gym.notifications.notifyScheduleChangesEnabled",
                "Enable Automatic Notifications",
              )}
            </label>
          </div>
          <Clock className="w-5 h-5 text-primary" />
        </div>
      </div>
    </SettingsTab>
  );
}
