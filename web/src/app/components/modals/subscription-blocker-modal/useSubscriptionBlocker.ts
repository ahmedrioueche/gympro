import { type BlockerModalConfig } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
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

  const handleSecondaryAction = (action: string) => {
    const routes: Record<string, string> = {
      view_plans: `${APP_PAGES.manager.subscription.link}/#plans-section`,
      export_data: "/settings/export",
    };
    if (routes[action]) {
      navigate({ to: routes[action] });
      onClose?.();
    }
  };

  return {
    handlePrimaryAction,
    handleSecondaryAction,
    isLoading: renewCheckout.isPending || reactivateSubscription.isPending,
  };
}
