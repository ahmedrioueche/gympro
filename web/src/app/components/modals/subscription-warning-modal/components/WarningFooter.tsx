import { type BlockerModalConfig } from "@ahmedrioueche/gympro-client";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { handleContactSupport } from "../../../../../utils/contact";

interface WarningFooterProps {
  config: BlockerModalConfig;
  isLoading: boolean;
  onPrimaryAction: () => void;
  onSecondaryAction: (action: string) => void;
  onDismiss: () => void;
}

export function WarningFooter({
  config,
  isLoading,
  onPrimaryAction,
  onSecondaryAction,
  onDismiss,
}: WarningFooterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      {/* Primary Action */}
      <button
        onClick={onPrimaryAction}
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
              onClick={() => onSecondaryAction(action)}
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
  );
}
