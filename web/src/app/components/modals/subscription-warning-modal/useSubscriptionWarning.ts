import { gymApi, type BlockerModalConfig } from "@ahmedrioueche/gympro-client";
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

  const [isExporting, setIsExporting] = useState(false);

  const handleSecondaryAction = async (action: string) => {
    if (action === "export_data") {
      try {
        setIsExporting(true);

        const blob = await gymApi.exportData();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "gym_data_export.xlsx";
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        a.remove();
      } catch (error) {
        console.error("Export failed:", error);
      } finally {
        setIsExporting(false);
        onDismiss();
      }
      return;
    }

    const routes: Record<string, string> = {
      view_plans: `${APP_PAGES.manager.subscription.link}/#plans-section`,
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
    isLoading:
      renewCheckout.isPending ||
      reactivateSubscription.isPending ||
      isExporting,
  };
}
