import { DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import { useManageSubscriptionType } from "../../../../../../../hooks/useGymSubscriptionTypes";
import { useModalStore } from "../../../../../../../store/modal";
import { PricingForm } from "./PricingForm";

export const PricingModal = () => {
  const { t } = useTranslation();
  const { currentModal, pricingProps, closeModal } = useModalStore();
  const {
    createSubscriptionType,
    updateSubscriptionType,
    isCreating,
    isUpdating,
  } = useManageSubscriptionType();

  if (currentModal !== "pricing" || !pricingProps) return null;

  const { mode, plan, onSuccess } = pricingProps;
  const isEdit = mode === "edit" && !!plan;
  const isLoading = isEdit ? isUpdating : isCreating;

  const handleSubmit = async (data: any) => {
    try {
      if (isEdit && plan) {
        await updateSubscriptionType({ id: plan._id, dto: data });
      } else {
        await createSubscriptionType(data);
      }
      onSuccess?.();
      closeModal();
    } catch (error) {
      console.error("Failed to submit pricing plan:", error);
    }
  };

  return (
    <BaseModal
      isOpen={currentModal === "pricing"}
      onClose={closeModal}
      title={isEdit ? t("pricing.editPlan") : t("pricing.addPlan")}
      subtitle={
        isEdit && plan
          ? plan.customName ||
            (plan.services && plan.services.length > 0
              ? plan.services
                  .map((s) => t(`settings.gym.services.${s}`, s))
                  .join(", ")
              : t("pricing.form.regularPlan", "Regular Plan"))
          : undefined
      }
      icon={DollarSign}
      maxWidth="max-w-2xl"
      primaryButton={{
        label: isEdit ? t("common.save") : t("common.create"),
        type: "submit",
        form: "pricing-form",
        loading: isLoading,
      }}
    >
      <PricingForm
        formId="pricing-form"
        defaultValues={
          isEdit && plan
            ? {
                customName: plan.customName,
                description: plan.description,
                isAvailable: plan.isAvailable,
                services: plan.services || [],
                allowedDaysPerWeek: plan.allowedDaysPerWeek,
              }
            : undefined
        }
        initialTiers={isEdit && plan ? plan.pricingTiers : undefined}
        onSubmit={handleSubmit}
      />
    </BaseModal>
  );
};

export default PricingModal;
