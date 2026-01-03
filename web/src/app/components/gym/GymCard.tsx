import type { Gym } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../context/ThemeContext";

interface GymCardProps {
  gym: Gym;
  onSelect: () => void;
}

export default function GymCard({ gym, onSelect }: GymCardProps) {
  const { t } = useTranslation();
  const [showSettings, setShowSettings] = useState(false);
  const { isDark } = useTheme();

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        onSelect();
      }}
      className={`w-full hover:cursor-pointer ${
        isDark
          ? "dark:bg-gradient-to-br dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900"
          : "bg-background"
      } border border-border rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group`}
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-6 md:p-8 border-b border-border/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Icon or Gym Image + Name */}
          <div className="flex items-center gap-4 md:gap-6">
            {gym.logoUrl ? (
              <img
                src={gym.logoUrl}
                alt={gym.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center text-4xl md:text-5xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                🏢
              </div>
            )}

            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-1 group-hover:text-primary transition-colors duration-300">
                {gym.name}
              </h2>

              {gym.slogan && (
                <p className="text-sm md:text-base text-text-secondary italic">
                  "{gym.slogan}"
                </p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`absolute top-4 right-4 md:relative md:top-auto md:right-auto px-3 py-1.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold shadow-md ${
              gym.isActive
                ? "bg-success/20 text-success border-2 border-success/30"
                : "bg-text-secondary/20 text-text-secondary border-2 border-text-secondary/30"
            }`}
          >
            {gym.isActive
              ? t("gymCard.activeStatus", "● Active")
              : t("gymCard.inactiveStatus", "○ Inactive")}
          </div>
        </div>
      </div>

      {/* Main Content - Toggle between overview and settings */}
      {!showSettings ? (
        // Overview View
        <div className="p-6 md:p-8 lg:p-10">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Location */}
            <div className="bg-surface/50 rounded-xl p-5 border border-border/50 hover:border-primary/50 transition-all duration-300">
              <div className="flex items-start gap-3">
                <span className="text-3xl">📍</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                    {t("gymCard.location", "Location")}
                  </h4>
                  <p className="text-sm font-medium text-text-primary break-words">
                    {gym.address ||
                      t("gymCard.noAddress", "No address provided")}
                  </p>

                  {(gym.city || gym.state || gym.country) && (
                    <p className="text-xs text-text-secondary mt-1">
                      {gym.city}
                      {gym.state && `, ${gym.state}`}
                      {gym.country && ` - ${gym.country}`}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-surface/50 rounded-xl p-5 border border-border/50 hover:border-primary/50 transition-all duration-300">
              <div className="flex items-start gap-3">
                <span className="text-3xl">📞</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                    {t("gymCard.contact", "Contact")}
                  </h4>
                  <p className="text-sm font-medium text-text-primary break-all">
                    {gym.phone || t("gymCard.noPhone", "No phone")}
                  </p>

                  {gym.email && (
                    <p className="text-xs text-text-secondary mt-1 break-all">
                      {gym.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="bg-surface/50 rounded-xl p-5 border border-border/50 hover:border-primary/50 transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="flex items-start gap-3">
                <span className="text-3xl">👥</span>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                    {t("gymCard.members", "Members")}
                  </h4>
                  <p className="text-2xl font-bold text-text-primary">
                    0{" "}
                    <span className="text-sm font-normal text-text-secondary">
                      {t("gymCard.activeMembers", "active members")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Website */}
          {gym.website && (
            <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">🌐</span>
                <span className="text-text-secondary">
                  {t("gymCard.website", "Website")}:
                </span>
                <a
                  href={gym.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium break-all"
                >
                  {gym.website}
                </a>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div
            onClick={() => onSelect()}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="flex-1 py-4 px-6 text-center rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
              {t("gymCard.manageGym", "Manage Gym")}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(true);
              }}
              className="flex-1 py-4 px-6 text-center rounded-xl bg-surface border-2 border-border text-text-primary font-semibold text-lg hover:bg-surface/50 hover:border-primary hover:text-primary transition-all duration-300 active:scale-95"
            >
              {t("gymCard.viewMoreDetails")}
            </button>
          </div>
        </div>
      ) : (
        // Settings View
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
                    {gym.owner.profile.username}
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
                {gym.defaultCurrency && (
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                      {t("gymCard.currency", "Currency")}
                    </p>
                    <p className="text-sm font-medium text-text-primary">
                      {gym.defaultCurrency}
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
                        {t(
                          "gymCard.customSubscriptions",
                          "Custom Subscriptions"
                        )}
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

                  {gym.settings.subscriptionRenewalReminderDays !==
                    undefined && (
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                        {t("gymCard.renewalReminder", "Renewal Reminder Days")}
                      </p>
                      <p className="text-sm font-medium text-text-primary">
                        {gym.settings.subscriptionRenewalReminderDays} days
                        before expiry
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
                          {gym.settings.femaleOnlyHours.map(
                            (timeRange, idx) => (
                              <div
                                key={idx}
                                className="text-sm font-medium text-text-primary bg-primary/5 px-3 py-2 rounded-lg"
                              >
                                {timeRange.days.join(", ")}:{" "}
                                {timeRange.range.start} - {timeRange.range.end}
                              </div>
                            )
                          )}
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
                setShowSettings(false);
              }}
              className="w-full py-4 px-6 text-center rounded-xl bg-surface border-2 border-border text-text-primary font-semibold text-lg hover:bg-surface/50 hover:border-primary hover:text-primary transition-all duration-300 active:scale-95"
            >
              {t("gymCard.back", "← Back to Overview")}
            </button>
          </div>
        </div>
      )}

      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
    </div>
  );
}
