import type { BlockerModalConfig } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../constants/navigation";
import { useCreateRenewalChargilyCheckout } from "../../../hooks/queries/useChargilyCheckout";
import { useReactivateSubscription } from "../../../hooks/queries/useSubscription";
import { handleContactSupport } from "../../../utils/contact";

interface Props {
  config: BlockerModalConfig;
  onDismiss: () => void;
}

export default function SubscriptionWarningModal({ config, onDismiss }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // Hooks for renew and reactivate
  const renewCheckout = useCreateRenewalChargilyCheckout({
    onSuccess: () => {
      onDismiss();
    },
  });

  const reactivateSubscription = useReactivateSubscription();

  // Countdown timer
  useEffect(() => {
    if (!config.softGraceExpiresAt || !config.showCountdown) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(config.softGraceExpiresAt!).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining(t("subscription.blocker.time_expired", "Expired"));
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(
        t("subscription.blocker.time_format", "{{hours}}h {{minutes}}m", {
          hours,
          minutes,
        })
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [config.softGraceExpiresAt, config.showCountdown, t]);

  const handlePrimaryAction = () => {
    if (config.primaryAction === "renew") {
      // Use the renew checkout hook
      renewCheckout.mutate({});
    } else if (config.primaryAction === "reactivate") {
      // Use the reactivate subscription hook
      reactivateSubscription.mutate();
    } else if (config.primaryAction === "subscribe") {
      // Navigate to plans page
      navigate({ to: "/subscription/plans" });
    }
  };

  const handleSecondaryAction = (action: string) => {
    const routes: Record<string, string> = {
      view_plans: `${APP_PAGES.manager.subscription.link}/#plans-section`,
      export_data: "/settings/export",
    };
    if (routes[action]) {
      onDismiss();
      navigate({ to: routes[action] });
    }
  };

  const isLoading = renewCheckout.isPending || reactivateSubscription.isPending;

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl shadow-2xl max-w-2xl max-h-screen w-full border border-border overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {t(config.titleKey)}
                </h3>
                <p className="text-white/80 text-sm">
                  {t("subscription.blocker.action_required", "Action Required")}
                </p>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-white/80 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto hide-scrollbar">
          {/* Message */}
          <div className="space-y-3">
            <p className="text-text-primary leading-relaxed">
              {t(config.messageKey)}
            </p>

            {/* Urgency Notice with Countdown */}
            {config.urgencyMessageKey &&
              config.hoursUntilBlock !== undefined && (
                <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <Clock className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-900 dark:text-red-100 mb-1">
                      {t(
                        "subscription.blocker.urgency_title",
                        "Time Remaining"
                      )}
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

        {/* Footer */}
        <div className="p-6 bg-surface-secondary border-t border-border">
          <div className="flex flex-col gap-3">
            {/* Primary Action */}
            <button
              onClick={handlePrimaryAction}
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("common.processing", "Processing...")}
                </>
              ) : (
                <>
                  {t(
                    `subscription.blocker.action.${config.primaryAction}`,
                    config.primaryAction.charAt(0).toUpperCase() +
                      config.primaryAction.slice(1)
                  )}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Secondary Actions */}
            {config.secondaryActions && config.secondaryActions.length > 0 && (
              <div className="flex gap-2">
                {config.secondaryActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleSecondaryAction(action)}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary bg-surface hover:bg-surface-secondary border border-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t(
                      `subscription.blocker.action.${action}`,
                      action
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
              {/* Dismiss */}
              <button
                onClick={onDismiss}
                disabled={isLoading}
                className="px-6 py-2 rounded-xl font-medium text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("subscription.blocker.remind_later", "Remind Me Later")}
              </button>

              {/* Help Text */}
              <p className="text-center md:text-right text-text-secondary">
                {t("subscription.blocker.need_help", "Need help?")}{" "}
                <button
                  onClick={() => handleContactSupport(t)}
                  className="text-primary hover:text-primary/80 underline transition-colors whitespace-nowrap"
                >
                  {t(
                    "subscription.blocker.contact_support",
                    "Contact our support team"
                  )}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
