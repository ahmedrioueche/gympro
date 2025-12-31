import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";

interface NotificationsTabProps {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  renewalReminderDays: number;
  setRenewalReminderDays: (value: number) => void;
}

export default function NotificationsTab({
  notificationsEnabled,
  setNotificationsEnabled,
  renewalReminderDays,
  setRenewalReminderDays,
}: NotificationsTabProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {t("settings.gym.notifications.title", "Notification Settings")}
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.gym.notifications.enabledDesc",
            "Enable or disable gym-wide notifications"
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

        <div className="max-w-xs">
          <InputField
            type="number"
            label={t(
              "settings.gym.notifications.renewalReminder",
              "Renewal Reminder"
            )}
            value={renewalReminderDays}
            onChange={(e) =>
              setRenewalReminderDays(parseInt(e.target.value) || 0)
            }
            min={0}
            max={30}
            placeholder={t(
              "settings.gym.notifications.reminderDaysPlaceholder",
              "e.g., 7"
            )}
          />
          <p className="text-xs text-text-secondary mt-2">
            {t(
              "settings.gym.notifications.renewalReminderDesc",
              "Days before subscription expiry to notify members"
            )}
          </p>
        </div>
      </div>

      <div className="p-4 bg-surface-hover rounded-xl border border-border flex items-start gap-3">
        <Bell className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-text-primary">
            {t("settings.gym.notifications.note", "Automated Reminders")}
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            {t(
              "settings.gym.notifications.noteDesc",
              "Members will receive automatic notifications before their subscriptions expire."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
