import { useSubscriptionBlockerQuery } from "../../../../hooks/queries/useSubscriptionBlocker";
import { useModalStore } from "../../../../store/modal";
import { useModalLayer } from "../../../../hooks/useModalLayer";
import SubscriptionWarningModal from "./SubscriptionWarningModal";

export default function SubscriptionWarningModalWrapper() {
  const { closeModal, subscriptionWarningProps } = useModalStore();

  const { isOpen, zIndex, closeModal: closeLayerModal } = useModalLayer("subscription_warning");

  // If config was explicitly passed via openModal payload, use it
  // Otherwise resolve it directly from the local environment queries
  const { data: fetchedConfig } = useSubscriptionBlockerQuery();

  const config = subscriptionWarningProps?.config || fetchedConfig;

  if (!isOpen || !config) return null;

  return <SubscriptionWarningModal config={config} onDismiss={closeModal} zIndex={zIndex} />;
}
