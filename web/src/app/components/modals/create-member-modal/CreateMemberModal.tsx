import { ArrowLeft, ArrowRight, Check, UserPlus, X } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { useGymSubscriptionOptions } from "../../../../hooks/useGymSubscriptionOptions";
import { useGymStore } from "../../../../store/gym";
import { useModalStore } from "../../../../store/modal";
import { useUserStore } from "../../../../store/user";
import Tip from "../../ui/Tip";
import StepGeneralInfo from "./StepGeneralInfo";
import StepSubscriptionInfo from "./StepSubscriptionInfo";
import { useCreateMemberForm } from "./useCreateMemberForm";

export default function CreateMemberModal() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { user } = useUserStore();
  const { currentModal, closeModal, createMemberProps } = useModalStore();
  const { onSuccess } = createMemberProps || {};

  const {
    step,
    formData,
    errors,
    isSubmitting,
    showSuccess,
    handleNext,
    handleBack,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useCreateMemberForm(
    currentGym?._id,
    user?.profile?.email,
    user?.profile?.phoneNumber,
  );

  const {
    subscriptionTypeOptions,
    durationOptions,
    paymentMethodOptions,
    selectedPlan,
  } = useGymSubscriptionOptions(formData.subscriptionTypeId);

  const isOpen = currentModal === "create_member";

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Auto-select first interval when duration options are available
  useEffect(() => {
    if (durationOptions.length > 0 && !formData.subscriptionDuration) {
      handleInputChange("subscriptionDuration", durationOptions[0].value);
    }
  }, [durationOptions, formData.subscriptionDuration, handleInputChange]);

  useEffect(() => {
    if (showSuccess && isOpen) {
      toast.success(t("createMember.success.title"));
      onSuccess?.();
      closeModal();
    }
  }, [showSuccess, isOpen, onSuccess]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("createMember.title", "Add New Member")}
      icon={UserPlus}
      maxWidth="max-w-4xl"
      primaryButton={{
        label: step === 2 ? t("common.submit") : t("common.next"),
        onClick: step === 2 ? () => handleSubmit() : handleNext,
        loading: isSubmitting,
        icon: step === 2 ? Check : ArrowRight,
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: closeModal,
        icon: X,
      }}
      tertiaryButton={
        step > 1
          ? {
              label: t("common.back"),
              onClick: handleBack,
              variant: "default",
              icon: ArrowLeft,
            }
          : undefined
      }
    >
      <div className="space-y-6">
        <form
          id="create-member-modal-form"
          onSubmit={handleSubmit}
          className="min-h-[400px]"
        >
          {step === 1 && (
            <StepGeneralInfo
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
            />
          )}
          {step === 2 && (
            <StepSubscriptionInfo
              formData={formData}
              handleInputChange={handleInputChange}
              subscriptionOptions={subscriptionTypeOptions}
              durationOptions={durationOptions}
              paymentMethodOptions={paymentMethodOptions}
              selectedPlan={selectedPlan}
              errors={errors}
            />
          )}
        </form>

        <div className="mt-6">
          <Tip
            title={t("createMember.tips.title")}
            description={t("createMember.tips.description")}
          />
        </div>
      </div>
    </BaseModal>
  );
}
