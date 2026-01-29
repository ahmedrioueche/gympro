import { type BlockerModalConfig } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../constants/navigation";
import { useCreateRenewalChargilyCheckout } from "../../../../hooks/queries/useChargilyCheckout";
import { useReactivateSubscription } from "../../../../hooks/queries/useSubscription";

interface UseSubscriptionWarningProps {
  config: BlockerModalConfig;
  onDismiss: () => void;
}

export function useSubscriptionWarning({
  config,
  onDismiss,
}: UseSubscriptionWarningProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const renewCheckout = useCreateRenewalChargilyCheckout({
    onSuccess: () => {
      onDismiss();
    },
  });

  const reactivateSubscription = useReactivateSubscription();

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
        }),
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);

    return () => clearInterval(interval);
  }, [config.softGraceExpiresAt, config.showCountdown, t]);

  const handlePrimaryAction = () => {
    if (config.primaryAction === "renew") {
      renewCheckout.mutate({});
    } else if (config.primaryAction === "reactivate") {
      reactivateSubscription.mutate();
    } else if (config.primaryAction === "subscribe") {
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

  return {
    timeRemaining,
    handlePrimaryAction,
    handleSecondaryAction,
    isLoading: renewCheckout.isPending || reactivateSubscription.isPending,
  };
}
