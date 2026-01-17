import { type BlockerModalConfig } from "@ahmedrioueche/gympro-client";
import { XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BlockerContentProps {
  config: BlockerModalConfig;
}

export function BlockerContent({ config }: BlockerContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Critical Message */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border-2 border-red-200 dark:border-red-800">
        <div className="flex gap-3">
          <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-100 mb-2">
              {t(
                "subscription.blocker.blocked_title",
                "Account Access Blocked"
              )}
            </p>
            <p className="text-red-800 dark:text-red-200 leading-relaxed">
              {t(config.messageKey)}
            </p>
          </div>
        </div>
      </div>

      {/* What's Blocked */}
      <div className="space-y-3">
        <p className="font-semibold text-text-primary text-sm">
          {t(
            "subscription.blocker.currently_blocked",
            "What's currently blocked:"
          )}
        </p>
        <div className="grid gap-2">
          {[
            {
              icon: "🚫",
              text: t(
                "subscription.blocker.blocked_features",
                "All premium features"
              ),
            },
            {
              icon: "✏️",
              text: t(
                "subscription.blocker.blocked_editing",
                "Creating and editing content"
              ),
            },
            {
              icon: "👥",
              text: t(
                "subscription.blocker.blocked_members",
                "Managing members and gyms"
              ),
            },
            {
              icon: "📊",
              text: t(
                "subscription.blocker.blocked_reports",
                "Viewing reports and analytics"
              ),
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-surface-secondary rounded-lg"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-text-secondary">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reason-specific info */}
      {config.reason === "manual_expired" && (
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
              {t(
                "subscription.blocker.manual_renewal_title",
                "Manual Renewal Required"
              )}
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              {t(
                "subscription.blocker.manual_renewal_message",
                "Your subscription requires manual renewal through Chargily. Click below to complete the payment process."
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
