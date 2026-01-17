import { type BlockerModalConfig } from "@ahmedrioueche/gympro-client";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { BlockerContent } from "./components/BlockerContent";
import { BlockerFooter } from "./components/BlockerFooter";
import { useSubscriptionBlocker } from "./hooks/useSubscriptionBlocker";

interface Props {
  config: BlockerModalConfig;
  onClose?: () => void;
}

export default function SubscriptionBlockerModal({ config, onClose }: Props) {
  const { t } = useTranslation();
  const { handlePrimaryAction, handleSecondaryAction, isLoading } =
    useSubscriptionBlocker({
      config,
      onClose,
    });

  return (
    <BaseModal
      isOpen={true}
      onClose={() => {}} // No-op for close, handled by hideCloseButton and explicit actions
      title={t(config.titleKey)}
      subtitle={t(
        "subscription.blocker.access_suspended",
        "Your access has been suspended"
      )}
      icon={Lock}
      showFooter={true}
      footer={
        <BlockerFooter
          config={config}
          isLoading={isLoading}
          onPrimaryAction={handlePrimaryAction}
          onSecondaryAction={handleSecondaryAction}
        />
      }
      showEditButton={false}
      hideCloseButton={true}
    >
      <BlockerContent config={config} />
    </BaseModal>
  );
}
