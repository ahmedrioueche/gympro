import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import { useModalStore } from "../../../../../../../store/modal";
import { ContactStep } from "./components/ContactStep";
import { ReasonStep } from "./components/ReasonStep";
import { useCancelSubscription } from "./hooks/useCancelSubscription";

function CancelSubscriptionModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, cancelSubscriptionProps } = useModalStore();

  const {
    step,
    reason,
    setReason,
    validationState,
    handleClose,
    handleContinueToCancellation,
    handleBackToContact,
    handleCancel,
    canSubmit,
    isSubmitting,
    isError,
  } = useCancelSubscription(closeModal);

  const isOpen = currentModal === "cancel_subscription";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        step === "contact"
          ? t("subscription.cancel_modal_title")
          : t("subscription.cancel_reason_title")
      }
      icon={AlertTriangle}
      maxWidth="max-w-2xl"
    >
      {step === "contact" ? (
        <ContactStep onContinue={handleContinueToCancellation} />
      ) : (
        <ReasonStep
          reason={reason}
          onReasonChange={setReason}
          validationState={validationState}
          subscriptionEndDate={cancelSubscriptionProps?.subscriptionEndDate}
          onBack={handleBackToContact}
          onSubmit={handleCancel}
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
          isError={isError}
        />
      )}
    </BaseModal>
  );
}

export default CancelSubscriptionModal;
