import { DollarSign, Plus, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { CoachPricingForm } from "./CoachPricingForm";
import { useCoachPricingModal } from "./useCoachPricingModal";

export default function CoachPricingModal() {
  const { t } = useTranslation();
  const {
    isOpen,
    isEditMode,
    formData,
    setFormData,
    handleSubmit,
    closeModal,
    isLoading,
    options,
  } = useCoachPricingModal();

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={
        isEditMode
          ? t("coachPricing.editPricing")
          : t("coachPricing.addPricing")
      }
      subtitle={t("coachPricing.subtitle")}
      icon={DollarSign}
      maxWidth="max-w-lg"
      primaryButton={{
        label: isEditMode ? t("common.save") : t("common.create"),
        onClick: handleSubmit,
        loading: isLoading,
        icon: isEditMode ? Save : Plus,
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: closeModal,
        icon: X,
      }}
    >
      <CoachPricingForm
        formData={formData}
        setFormData={setFormData}
        options={options}
      />
    </BaseModal>
  );
}
