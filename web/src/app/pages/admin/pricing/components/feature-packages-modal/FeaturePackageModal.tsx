import type { AppLanguage } from "@ahmedrioueche/gympro-client";
import { Plus, Save, Trash2 } from "lucide-react";
import BaseModal from "../../../../../../components/ui/BaseModal";
import FeaturePackageBasicInfo from "./FeaturePackageBasicInfo";
import FeaturePackageFeatures from "./FeaturePackageFeatures";
import FeaturePackageLocalization from "./FeaturePackageLocalization";
import { useFeaturePackageForm } from "./useFeaturePackageForm";

export default function FeaturePackageModal() {
  const {
    isOpen,
    isEdit,
    pkg,
    formData,
    setFormDataField,
    isTranslating,
    handleTranslate,
    toggleFeature,
    handleSave,
    isPending,
    isDeleting,
    handleDelete,
    takenFeaturesMap,
    closeModal,
    t,
  } = useFeaturePackageForm();

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      icon={Plus}
      title={
        isEdit
          ? t("admin.pricing.editPackage", "Edit Package")
          : t("admin.pricing.createPackage", "Create Package")
      }
      subtitle={isEdit ? pkg?.name : ""}
      primaryButton={{
        label: isPending ? t("common.saving") : t("common.save"),
        onClick: handleSave,
        loading: isPending,
        icon: Save,
      }}
      tertiaryButton={
        isEdit
          ? {
              label: isDeleting ? t("common.deleting") : t("common.delete"),
              variant: "danger",
              onClick: handleDelete,
              loading: isDeleting,
              icon: Trash2,
            }
          : undefined
      }
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto px-2 custom-scrollbar">
        {/* Basic Info */}
        <FeaturePackageBasicInfo
          name={formData.name}
          order={formData.order}
          onChange={setFormDataField}
        />

        {/* Localized Names + AI Translate */}
        <FeaturePackageLocalization
          localizedName={formData.localizedName}
          isTranslating={isTranslating}
          onTranslate={handleTranslate}
          disabledTranslate={!formData.name && !formData.localizedName.en}
          onChange={(lang: AppLanguage, value: string) =>
            setFormDataField("localizedName", {
              ...formData.localizedName,
              [lang]: value,
            })
          }
        />

        {/* Features selection */}
        <FeaturePackageFeatures
          selectedFeatures={formData.features}
          takenFeaturesMap={takenFeaturesMap}
          onToggle={toggleFeature}
        />

        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-surface-secondary border-2 border-border transition-all hover:border-primary/20">
          <div>
            <div className="font-bold text-text-primary">
              {t("common.active", "Active")}
            </div>
            <div className="text-xs text-text-secondary font-medium">
              {t(
                "admin.pricing.packageActiveDesc",
                "Show this package on pricing cards and admin tools",
              )}
            </div>
          </div>
          <button
            onClick={() => setFormDataField("isActive", !formData.isActive)}
            className={`w-12 h-6 rounded-full transition-all relative ${
              formData.isActive
                ? "bg-primary shadow-lg shadow-primary/20"
                : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${
                formData.isActive ? "right-1" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
