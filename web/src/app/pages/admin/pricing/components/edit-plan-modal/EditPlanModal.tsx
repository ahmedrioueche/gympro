import { Edit } from "lucide-react";
import BaseModal from "../../../../../../components/ui/BaseModal";
import { PlanBasicInfo } from "./components/PlanBasicInfo";
import { PlanFeatures } from "./components/PlanFeatures";
import { PlanLimits } from "./components/PlanLimits";
import { PlanPricing } from "./components/PlanPricing";
import { useEditPlanForm } from "./hooks/useEditPlanForm";

export default function EditPlanModal() {
  const {
    isOpen,
    isEdit,
    closeModal,
    formData,
    setFormData,
    newFeature,
    setNewFeature,
    savePlan,
    isPending,
    isDeleting,
    handleDelete,
    handlePricingChange,
    handleLimitChange,
    addFeature,
    removeFeature,
    startEditFeature,
    cancelEdit,
    editingIndex,
    handleAutoTranslate,
    isTranslating,
    t,
  } = useEditPlanForm();

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      icon={Edit}
      title={
        isEdit
          ? t("admin.pricing.editPlan", "Edit Plan")
          : t("admin.pricing.createPlan", "Create New Plan")
      }
      primaryButton={{
        label: isPending ? t("common.saving") : t("common.save"),
        onClick: () => savePlan(formData),
        loading: isPending,
        disabled: isPending,
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: closeModal,
      }}
      tertiaryButton={
        isEdit
          ? {
              label: isDeleting ? t("common.deleting") : t("common.delete"),
              onClick: handleDelete,
              loading: isDeleting,
              disabled: isDeleting || isPending,
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
        <PlanPricing
          formData={formData}
          handlePricingChange={handlePricingChange}
        />
        <PlanLimits formData={formData} handleLimitChange={handleLimitChange} />
        <PlanFeatures
          formData={formData}
          newFeature={newFeature}
          setNewFeature={setNewFeature}
          addFeature={addFeature}
          removeFeature={removeFeature}
          startEditFeature={startEditFeature}
          cancelEdit={cancelEdit}
          editingIndex={editingIndex}
          handleAutoTranslate={handleAutoTranslate}
          isTranslating={isTranslating}
        />
      </div>
    </BaseModal>
  );
}
