import { type BlockerModalConfig } from "@ahmedrioueche/gympro-client";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { WarningContent } from "./components/WarningContent";
import { WarningFooter } from "./components/WarningFooter";
import { useSubscriptionWarning } from "./hooks/useSubscriptionWarning";

interface Props {
  config: BlockerModalConfig;
  onDismiss: () => void;
}

export default function SubscriptionWarningModal({ config, onDismiss }: Props) {
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
