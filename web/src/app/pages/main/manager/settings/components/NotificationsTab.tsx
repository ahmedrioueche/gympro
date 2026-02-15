import { Bell, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";
import SettingsTab from "../../../../../components/settings/SettingsTab";

interface NotificationsTabProps {
  reminderMinutes: number;
  setReminderMinutes: (value: number) => void;
}

export default function NotificationsTab({
  reminderMinutes,
  setReminderMinutes,
}: NotificationsTabProps) {
  const { t } = useTranslation();

  return (
    <SettingsTab
      title={t("settings.tabs.notifications", "Notification Settings")}
      description={t(
        "settings.notifications.alertsDesc",
        "Configure how early you want to be notified of events",
      )}
      icon={Bell}
    >
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("settings.notifications.alerts", "Reminder Settings")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "settings.notifications.alertsDesc",
            "Configure how early you want to be notified of events",
          )}
        </p>

        <div className="max-w-xs">
          <InputField
            type="number"
            label={t(
              "settings.notifications.reminderMinutes",
              "Default Reminder (minutes)",
            )}
            value={reminderMinutes}
            onChange={(e) => setReminderMinutes(parseInt(e.target.value) || 0)}
            min={0}
            max={1440}
            leftIcon={<Clock className="w-4 h-4" />}
          />
        </div>
      </div>

      <div className="pt-8 border-t border-border">
        <div className="p-5 bg-surface-hover/50 rounded-2xl border border-border flex items-start gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-text-primary">
              {t("settings.notifications.note", "Real-time delivery")}
            </h4>
            <p className="text-sm text-text-secondary mt-1 max-w-lg">
              {t(
                "settings.notifications.noteDesc",
                "Notifications are delivered instantly via WebSockets when you are online.",
              )}
            </p>
          </div>
        </div>
      </div>
    </SettingsTab>
  );
}
