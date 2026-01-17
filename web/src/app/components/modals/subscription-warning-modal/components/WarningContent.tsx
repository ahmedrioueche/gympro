import { type BlockerModalConfig } from "@ahmedrioueche/gympro-client";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WarningContentProps {
  config: BlockerModalConfig;
  timeRemaining?: string;
}

export function WarningContent({ config, timeRemaining }: WarningContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Message */}
      <div className="space-y-3">
        <p className="text-text-primary leading-relaxed">
          {t(config.messageKey)}
        </p>

        {/* Urgency Notice with Countdown */}
        {config.urgencyMessageKey && config.hoursUntilBlock !== undefined && (
          <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <Clock className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-900 dark:text-red-100 mb-1">
                {t("subscription.blocker.urgency_title", "Time Remaining")}
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">
                {t(config.urgencyMessageKey, {
                  hours: config.hoursUntilBlock,
                })}
              </p>
              {config.showCountdown && timeRemaining && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/40 rounded-lg">
                  <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-mono font-semibold text-red-900 dark:text-red-100">
                    {timeRemaining}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Features Lost Warning */}
      <div className="bg-surface-secondary rounded-xl p-4 space-y-2">
        <p className="font-semibold text-text-primary text-sm">
          {t(
            "subscription.blocker.after_grace_period",
            "After the grace period expires:"
          )}
        </p>
        <ul className="space-y-1.5 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">•</span>
            {t(
              "subscription.blocker.lose_access",
              "You'll lose access to all features"
            )}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">•</span>
            {t(
              "subscription.blocker.data_safe",
              "Your data will be safe but inaccessible"
            )}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">•</span>
            {t(
              "subscription.blocker.cannot_create",
              "You won't be able to create or edit content"
            )}
          </li>
        </ul>
      </div>

      {/* Info Notice */}
      <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <svg
          className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-sm">
          <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
            {t("subscription.blocker.can_continue", "You Can Still Work")}
          </p>
          <p className="text-blue-700 dark:text-blue-300">
            {t(
              "subscription.blocker.grace_period_info",
              "You have full access during the grace period. Take your time to renew or export your data."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
