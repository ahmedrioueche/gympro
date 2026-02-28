import { gymApi, type BlockerModalConfig } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { APP_PAGES } from "../../../../constants/navigation";
import { useCreateRenewalChargilyCheckout } from "../../../../hooks/queries/useChargilyCheckout";
import { useReactivateSubscription } from "../../../../hooks/queries/useSubscription";

interface UseSubscriptionBlockerProps {
  config: BlockerModalConfig;
  onClose?: () => void;
}

export function useSubscriptionBlocker({
  config,
  onClose,
}: UseSubscriptionBlockerProps) {
  const navigate = useNavigate();
  const renewCheckout = useCreateRenewalChargilyCheckout();
  const reactivateSubscription = useReactivateSubscription();

  const handlePrimaryAction = () => {
    if (config.primaryAction === "renew") {
      renewCheckout.mutate({});
    } else if (config.primaryAction === "reactivate") {
      reactivateSubscription.mutate(undefined, {
        onSuccess: () => {
          onClose?.();
        },
      });
    } else if (config.primaryAction === "subscribe") {
      navigate({ to: `${APP_PAGES.manager.subscription.link}/#plans-section` });
      onClose?.();
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
        onClose?.();
      }
      return;
    }

    const routes: Record<string, string> = {
      view_plans: `${APP_PAGES.manager.subscription.link}/#plans-section`,
    };
    if (routes[action]) {
      navigate({ to: routes[action] });
      onClose?.();
    }
  };

  return {
    handlePrimaryAction,
    handleSecondaryAction,
    isLoading:
      renewCheckout.isPending ||
      reactivateSubscription.isPending ||
      isExporting,
  };
}
