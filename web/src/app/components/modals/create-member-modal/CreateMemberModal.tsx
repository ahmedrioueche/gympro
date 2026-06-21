import { ArrowLeft, ArrowRight, Check, UserPlus, X } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { useGymSubscriptionOptions } from "../../../../hooks/useGymSubscriptionOptions";
import { useGymStore } from "../../../../store/gym";
import { useLanguageStore } from "../../../../store/language";
import { useModalStore } from "../../../../store/modal";
import { useModalLayer } from "../../../../hooks/useModalLayer";
import { useUserStore } from "../../../../store/user";
import StepAccessInfo from "./StepAccessInfo";
import StepContactPreferences from "./StepContactPreferences";
import StepGeneralInfo from "./StepGeneralInfo";
import StepSubscriptionInfo from "./StepSubscriptionInfo";
import { useCreateMemberForm } from "./useCreateMemberForm";

export default function CreateMemberModal() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { user } = useUserStore();
  const { closeModal, createMemberProps } = useModalStore();
  const { onSuccess } = createMemberProps || {};
  const { isRtl } = useLanguageStore();

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
    fetchRandomPin,
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

  const { isOpen, zIndex, closeModal: closeLayerModal } = useModalLayer("create_member");

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

  const getStepSubtitle = () => {
    const totalSteps = 4;
    let stepTitle = "";
    switch (step) {
      case 1:
        stepTitle = t("createMember.steps.general.title");
        break;
      case 2:
        stepTitle = t("createMember.steps.subscription.title");
        break;
      case 3:
        stepTitle = t("createMember.steps.access.title");
        break;
      case 4:
        stepTitle = t("createMember.steps.contact.title");
        break;
    }
    return `${t("createMember.steps.step")} ${step}/${totalSteps}: ${stepTitle}`;
  };

  return (
    <BaseModal
      isOpen={isOpen} zIndex={zIndex}
      onClose={closeModal}
      title={t("createMember.title", "Add New Member")}
      subtitle={getStepSubtitle()}
      icon={UserPlus}
      maxWidth="max-w-4xl"
      primaryButton={{
        label: step === 4 ? t("common.submit") : t("common.next"),
        onClick: step === 4 ? () => handleSubmit() : handleNext,
        loading: isSubmitting,
        icon: step === 4 ? Check : isRtl ? ArrowLeft : ArrowRight,
        iconPosition: step === 4 ? "left" : "right",
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
              icon: isRtl ? ArrowRight : ArrowLeft,
            }
          : undefined
      }
    >
      <div className="space-y-6">
        {/* Step Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s ? "w-8 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>

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
          {step === 3 && (
            <StepAccessInfo
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              onGeneratePin={fetchRandomPin}
            />
          )}
          {step === 4 && (
            <StepContactPreferences
              formData={formData}
              handleInputChange={handleInputChange}
              subscriptionOptions={subscriptionTypeOptions}
            />
          )}
        </form>
      </div>
    </BaseModal>
  );
}
