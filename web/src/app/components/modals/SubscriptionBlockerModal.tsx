import type { BlockerModalConfig } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Lock, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../constants/navigation";
import { useCreateRenewalChargilyCheckout } from "../../../hooks/queries/useChargilyCheckout";
import { useReactivateSubscription } from "../../../hooks/queries/useSubscription";
import { handleContactSupport } from "../../../utils/contact";

interface Props {
  config: BlockerModalConfig;
  onClose?: () => void; // Optional callback to close modal
}

export default function SubscriptionBlockerModal({ config, onClose }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Hooks for renew and reactivate
  const renewCheckout = useCreateRenewalChargilyCheckout();
  const reactivateSubscription = useReactivateSubscription();

  const handlePrimaryAction = () => {
    if (config.primaryAction === "renew") {
      // Use the renew checkout hook
      renewCheckout.mutate({});
      // Don't close - user will be redirected to payment
    } else if (config.primaryAction === "reactivate") {
      // Use the reactivate subscription hook
      reactivateSubscription.mutate(undefined, {
        onSuccess: () => {
          // Close modal after successful reactivation
          onClose?.();
        },
      });
    } else if (config.primaryAction === "subscribe") {
      // Navigate to plans page and close modal
      navigate({ to: `${APP_PAGES.manager.subscription.link}/#plans-section` });
      onClose?.();
    }
  };

  const handleSecondaryAction = (action: string) => {
    const routes: Record<string, string> = {
      view_plans: `${APP_PAGES.manager.subscription.link}/#plans-section`,
      export_data: "/settings/export",
    };
    if (routes[action]) {
      navigate({ to: routes[action] });
      // Close modal when navigating to secondary actions
      onClose?.();
    }
  };

  const isLoading = renewCheckout.isPending || reactivateSubscription.isPending;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-2xl max-h-screen w-full border-2 border-red-500/50 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {t(config.titleKey)}
              </h2>
              <p className="text-white/90 text-sm">
                {t(
                  "subscription.blocker.access_suspended",
                  "Your access has been suspended"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto hide-scrollbar">
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
                  <span className="text-sm text-text-secondary">
                    {item.text}
                  </span>
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

        {/* Footer - Sticky Actions */}
        <div className="p-6 bg-surface-secondary border-t-2 border-border">
          <div className="flex flex-col gap-3">
            {/* Primary Action - Prominent */}
            <button
              onClick={handlePrimaryAction}
              disabled={isLoading}
              className="w-full px-6 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("common.processing", "Processing...")}
                </>
              ) : (
                <>
                  {t(
                    `subscription.blocker.action.${config.primaryAction}`,
                    config.primaryAction.charAt(0).toUpperCase() +
                      config.primaryAction.slice(1)
                  )}
                  <ArrowRight className="w-6 h-6" />
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
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Help Text */}
            <p className="text-center text-xs text-text-secondary mt-2">
              {t("subscription.blocker.need_help", "Need help?")}{" "}
              <button
                onClick={() => handleContactSupport(t)}
                className="text-primary hover:text-primary/80 underline transition-colors"
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
  );
}
