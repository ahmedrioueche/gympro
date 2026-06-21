import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import BaseModal from "../../../../../../components/ui/BaseModal";
import { PlanBasicInfo } from "./PlanBasicInfo";
import { PlanFeatures } from "./PlanFeatures";
import { PlanLimits } from "./PlanLimits";
import { PlanPricing } from "./PlanPricing";
import { useEditPlanForm } from "./useEditPlanForm";

export default function EditPlanModal() {
  const {
    
    isOpen,
    isEdit,
    closeModal,
    formData,
    setFormData,
    savePlan,
    isPending,
    isDeleting,
    handleDelete,
    handlePricingChange,
    handleLimitChange,
    togglePackage,
    togglePackageVisibility,
    t,
  
    zIndex,
  } = useEditPlanForm();

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen} zIndex={zIndex}
      onClose={closeModal}
      icon={Edit}
      title={
        isEdit
          ? t("admin.pricing.editPlan", "Edit Plan")
          : t("admin.pricing.createPlan", "Create New Plan")
      }
      subtitle={isEdit ? formData.name : " "}
      primaryButton={{
        label: isPending ? t("common.saving") : t("common.save"),
        onClick: () => savePlan(formData),
        loading: isPending,
        disabled: isPending,
        icon: isEdit ? Save : Plus,
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: closeModal,
        icon: X,
      }}
      tertiaryButton={
        isEdit
          ? {
              label: isDeleting ? t("common.deleting") : t("common.delete"),
              onClick: handleDelete,
              loading: isDeleting,
              disabled: isDeleting || isPending,
              icon: Trash2,
            }
          : undefined
      }
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <PlanBasicInfo
          formData={formData}
          setFormData={setFormData}
          isEdit={isEdit}
        />
        {formData.level !== "free" && (
          <PlanPricing
            formData={formData}
            handlePricingChange={handlePricingChange}
          />
        )}
        <PlanLimits formData={formData} handleLimitChange={handleLimitChange} />
        <PlanFeatures
          formData={formData}
          togglePackage={togglePackage}
          togglePackageVisibility={togglePackageVisibility}
        />
      </div>
    </BaseModal>
  );
}
