import { AlertTriangle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import { useModalStore } from "../../../../../../../store/modal";
import { handleContactSupport } from "../../../../../../../utils/contact";
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

  const primaryButton =
    step === "contact"
      ? {
          label: t("subscription.contact_support"),
          onClick: () =>
            handleContactSupport(
              t,
              t("subscription.cancel_support_subject"),
              t("subscription.cancel_support_body"),
            ),
          icon: Mail,
          variant: "primary" as const,
        }
      : {
          label: isSubmitting
            ? t("common.processing")
            : t("subscription.cancel_subscription"),
          onClick: handleCancel,
          disabled: !canSubmit || isSubmitting,
          loading: isSubmitting,
          variant: "danger" as const,
        };

  const secondaryButton =
    step === "contact"
      ? {
          label: t("subscription.continue_cancellation"),
          onClick: handleContinueToCancellation,
          variant: "ghost" as const,
        }
      : {
          label: t("common.back"),
          onClick: handleBackToContact,
          variant: "default" as const,
        };

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
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
    >
      {step === "contact" ? (
        <ContactStep />
      ) : (
        <ReasonStep
          reason={reason}
          onReasonChange={setReason}
          validationState={validationState}
          subscriptionEndDate={cancelSubscriptionProps?.subscriptionEndDate}
          isError={isError}
        />
      )}
    </BaseModal>
  );
}

export default CancelSubscriptionModal;
