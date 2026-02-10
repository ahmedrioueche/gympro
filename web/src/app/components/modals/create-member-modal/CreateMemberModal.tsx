import { UserPlus } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { useSubscriptionOptions } from "../../../../hooks/useSubscriptionOptions";
import { useGymStore } from "../../../../store/gym";
import { useModalStore } from "../../../../store/modal";
import { useUserStore } from "../../../../store/user";
import Tip from "../../ui/Tip";
import StepContactPreferences from "./StepContactPreferences";
import StepGeneralInfo from "./StepGeneralInfo";
import StepSubscriptionInfo from "./StepSubscriptionInfo";
import { useCreateMemberForm } from "./useCreateMemberForm";

export default function CreateMemberModal() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { user } = useUserStore();
  const { currentModal, closeModal, createMemberProps } = useModalStore();
  const { onSuccess } = createMemberProps || {};

  const { subscriptionTypeOptions, durationOptions, paymentMethodOptions } =
    useSubscriptionOptions();

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
  } = useCreateMemberForm(
    currentGym?._id,
    user?.profile?.email,
    user?.profile?.phoneNumber,
  );

  useEffect(() => {
    if (showSuccess) {
      toast.success(t("createMember.success.title"));
      onSuccess?.();
      closeModal();
    }
  }, [showSuccess, onSuccess, closeModal, t]);

  const isOpen = currentModal === "create_member";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("createMember.title", "Add New Member")}
      icon={UserPlus}
      maxWidth="max-w-4xl"
      primaryButton={{
        label: step === 3 ? t("common.submit") : t("common.next"),
        onClick: step === 3 ? () => handleSubmit() : handleNext,
        loading: isSubmitting,
      }}
      tertiaryButton={
        step > 1
          ? {
              label: t("common.back"),
              onClick: handleBack,
              variant: "default",
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
              errors={errors}
            />
          )}
          {step === 3 && (
            <StepContactPreferences
              formData={formData}
              handleInputChange={handleInputChange}
              subscriptionOptions={subscriptionTypeOptions}
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
