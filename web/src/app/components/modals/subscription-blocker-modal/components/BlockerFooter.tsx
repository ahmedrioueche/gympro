import { type BlockerModalConfig } from "@ahmedrioueche/gympro-client";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { handleContactSupport } from "../../../../../utils/contact";

interface BlockerFooterProps {
  config: BlockerModalConfig;
  isLoading: boolean;
  onPrimaryAction: () => void;
  onSecondaryAction: (action: string) => void;
}

export function BlockerFooter({
  config,
  isLoading,
  onPrimaryAction,
  onSecondaryAction,
}: BlockerFooterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      {/* Primary Action */}
      <button
        onClick={onPrimaryAction}
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
              onClick={() => onSecondaryAction(action)}
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
  );
}
