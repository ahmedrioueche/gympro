import type { Gym } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";

interface GymSettingsViewProps {
  gym: Gym;
  onBack: () => void;
}

export function GymSettingsView({ gym, onBack }: GymSettingsViewProps) {
  const { t } = useTranslation();

  return (
    <div className="p-6 md:p-8 lg:p-10">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        {t("gymCard.settingsTitle", "Gym Details & Settings")}
      </h3>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-surface/50 rounded-xl p-5 border border-border/50">
          <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span>ℹ️</span>
            {t("gymCard.basicInfo", "Basic Information")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                {t("gymCard.ownerName")}
              </p>
              <p className="text-sm font-medium text-text-primary break-all">
                {gym.owner?.profile?.username || t("common.unknown")}
              </p>
            </div>
            {gym.timezone && (
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                  {t("gymCard.timezone", "Timezone")}
                </p>
                <p className="text-sm font-medium text-text-primary">
                  {gym.timezone}
                </p>
              </div>
            )}
            {gym.settings?.defaultCurrency && (
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                  {t("gymCard.currency", "Currency")}
                </p>
                <p className="text-sm font-medium text-text-primary">
                  {gym.settings.defaultCurrency}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        {gym.settings && (
          <div className="bg-surface/50 rounded-xl p-5 border border-border/50">
            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <span>⚙️</span>
              {t("gymCard.settings", "Settings")}
            </h4>
            <div className="space-y-3">
              {gym.settings.paymentMethods &&
                gym.settings.paymentMethods.length > 0 && (
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                      {t("gymCard.paymentMethods", "Payment Methods")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {gym.settings.paymentMethods.map((method, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                    {t("gymCard.customSubscriptions", "Custom Subscriptions")}
                  </p>
                  <p className="text-sm font-medium text-text-primary">
                    {gym.settings.allowCustomSubscriptions
                      ? "✅ Enabled"
                      : "❌ Disabled"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                    {t("gymCard.notifications", "Notifications")}
                  </p>
                  <p className="text-sm font-medium text-text-primary">
                    {gym.settings.notificationsEnabled
                      ? "✅ Enabled"
                      : "❌ Disabled"}
                  </p>
                </div>
              </div>

              {gym.settings.subscriptionRenewalReminderDays !== undefined && (
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                    {t("gymCard.renewalReminder", "Renewal Reminder Days")}
                  </p>
                  <p className="text-sm font-medium text-text-primary">
                    {gym.settings.subscriptionRenewalReminderDays} days before
                    expiry
                  </p>
                </div>
              )}

              {gym.settings.workingHours && (
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                    {t("gymCard.workingHours", "Working Hours")}
                  </p>
                  <p className="text-sm font-medium text-text-primary">
                    {gym.settings.workingHours.start} -{" "}
                    {gym.settings.workingHours.end}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                  {t("gymCard.mixedTraining", "Mixed Training")}
                </p>
                <p className="text-sm font-medium text-text-primary">
                  {gym.settings.isMixed
                    ? "✅ Males and females can train together"
                    : "❌ Separate training times"}
                </p>
              </div>

              {gym.settings.femaleOnlyHours &&
                gym.settings.femaleOnlyHours.length > 0 && (
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
                      {t("gymCard.femaleOnlyHours", "Female-Only Hours")}
                    </p>
                    <div className="space-y-2">
                      {gym.settings.femaleOnlyHours.map((timeRange, idx) => (
                        <div
                          key={idx}
                          className="text-sm font-medium text-text-primary bg-primary/5 px-3 py-2 rounded-lg"
                        >
                          {timeRange.days.join(", ")}: {timeRange.range.start} -{" "}
                          {timeRange.range.end}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {gym.settings.servicesOffered &&
                gym.settings.servicesOffered.length > 0 && (
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
                      {t("gymCard.servicesOffered", "Services Offered")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {gym.settings.servicesOffered.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Member Stats */}
        {gym.memberStats && (
          <div className="bg-surface/50 rounded-xl p-5 border border-border/50">
            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <span>📊</span>
              {t("gymCard.memberStats", "Member Statistics")}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-primary/5 rounded-lg">
                <p className="text-2xl font-bold text-text-primary">
                  {gym.memberStats.total}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {t("gymCard.totalMembers", "Total")}
                </p>
              </div>
              <div className="text-center p-3 bg-success/5 rounded-lg">
                <p className="text-2xl font-bold text-success">
                  {gym.memberStats.checkedIn}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {t("gymCard.checkedIn", "Checked In")}
                </p>
              </div>
              <div className="text-center p-3 bg-success/5 rounded-lg">
                <p className="text-2xl font-bold text-success">
                  {gym.memberStats.withActiveSubscriptions}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {t("gymCard.activeSubscriptions", "Active")}
                </p>
              </div>
              <div className="text-center p-3 bg-error/5 rounded-lg">
                <p className="text-2xl font-bold text-error">
                  {gym.memberStats.withExpiredSubscriptions}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {t("gymCard.expiredSubscriptions", "Expired")}
                </p>
              </div>
              <div className="text-center p-3 bg-warning/5 rounded-lg">
                <p className="text-2xl font-bold text-warning">
                  {gym.memberStats.pendingApproval}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {t("gymCard.pendingApproval", "Pending")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* App Subscription */}
        {gym.appSubscription && (
          <div className="bg-surface/50 rounded-xl p-5 border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                  {t("gymCard.subscriptionStatus", "Status")}
                </p>
                <p className="text-sm font-medium text-text-primary">
                  {gym.appSubscription.status}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
          className="w-full py-4 px-6 text-center rounded-xl bg-surface border-2 border-border text-text-primary font-semibold text-lg hover:bg-surface/50 hover:border-primary hover:text-primary transition-all duration-300 active:scale-95"
        >
          {t("gymCard.back", "← Back to Overview")}
        </button>
      </div>
    </div>
  );
}
