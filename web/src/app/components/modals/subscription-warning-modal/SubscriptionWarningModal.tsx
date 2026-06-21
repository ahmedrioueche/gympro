import { type BlockerModalConfig } from "@ahmedrioueche/gympro-client";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { WarningContent } from "./WarningContent";
import { WarningFooter } from "./WarningFooter";
import { useSubscriptionWarning } from "./useSubscriptionWarning";

interface Props {
  config: BlockerModalConfig;
  onDismiss: () => void;
  zIndex?: number;
}

export default function SubscriptionWarningModal({ config, onDismiss, zIndex }: Props) {
  const { t } = useTranslation();
  const {
    timeRemaining,
    handlePrimaryAction,
    handleSecondaryAction,
    isLoading,
  } = useSubscriptionWarning({
    config,
    onDismiss,
  });

  return (
    <BaseModal
      isOpen={true}
      zIndex={zIndex}
      onClose={onDismiss}
      title={t(config.titleKey)}
      subtitle={t("subscription.blocker.action_required", "Action Required")}
      icon={AlertTriangle}
      showFooter={true}
      footer={
        <WarningFooter
          config={config}
          isLoading={isLoading}
          onPrimaryAction={handlePrimaryAction}
          onSecondaryAction={handleSecondaryAction}
          onDismiss={onDismiss}
        />
      }
      showEditButton={false}
    >
      <WarningContent config={config} timeRemaining={timeRemaining} />
    </BaseModal>
  );
}
