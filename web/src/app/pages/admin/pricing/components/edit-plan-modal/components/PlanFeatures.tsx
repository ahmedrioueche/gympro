import {
  LANGUAGES,
  resolveLocalizedString,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
  type CreateAppPlanDto,
} from "@ahmedrioueche/gympro-client";
import { Edit, Loader2, Plus, Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../../components/ui/InputField";
import { useLanguageStore } from "../../../../../../../store/language";

interface PlanFeaturesProps {
  formData: CreateAppPlanDto;
  newFeature: Record<AppLanguage, string>;
  setNewFeature: (value: Record<AppLanguage, string>) => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
  startEditFeature: (index: number) => void;
  cancelEdit: () => void;
  editingIndex: number | null;
  handleAutoTranslate: () => void;
  isTranslating: boolean;
}

export function PlanFeatures({
  formData,
  newFeature,
  setNewFeature,
  addFeature,
  removeFeature,
  startEditFeature,
  cancelEdit,
  editingIndex,
  handleAutoTranslate,
  isTranslating,
}: PlanFeaturesProps) {
  const { t } = useTranslation();
  const { language: currentLang } = useLanguageStore();

  const handleInputChange = (lng: AppLanguage, value: string) => {
    setNewFeature({ ...newFeature, [lng]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
        {t("admin.pricing.features")}
      </h3>

      <div className="bg-surface-hover p-4 rounded-xl border border-border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUPPORTED_LANGUAGES.map((lng) => (
            <div key={lng} className="space-y-1">
              <label className="text-xs font-medium text-text-secondary flex items-center gap-2">
                <span>{LANGUAGES[lng].flag}</span>
                {LANGUAGES[lng].label}
                {lng === currentLang && (
                  <span className="text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded uppercase">
                    {t("common.base")}
                  </span>
                )}
              </label>
              <div className="relative">
                <InputField
                  value={newFeature[lng]}
                  onChange={(e) => handleInputChange(lng, e.target.value)}
                  placeholder={t(
                    "admin.pricing.featurePlaceholder",
                    "Enter feature...",
                  )}
                  className="w-full"
                  onKeyDown={(e) => e.key === "Enter" && addFeature()}
                />
                {lng === currentLang && (
                  <button
                    onClick={handleAutoTranslate}
                    disabled={isTranslating || !newFeature[currentLang].trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-secondary hover:bg-secondary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={t("common.autoTranslate", "Auto-translate")}
                  >
                    {isTranslating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {editingIndex !== null && (
            <button
              onClick={cancelEdit}
              className="px-4 py-2.5 bg-surface text-text-secondary border border-border rounded-xl hover:bg-surface-hover transition-all font-medium"
            >
              {t("common.cancel")}
            </button>
          )}
          <button
            onClick={addFeature}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all shadow-lg font-medium ${
              editingIndex !== null
                ? "bg-primary text-white shadow-primary/20 hover:opacity-90"
                : "bg-secondary text-white shadow-secondary/20 hover:opacity-90"
            }`}
          >
            {editingIndex !== null ? (
              <Edit className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            {editingIndex !== null ? t("common.update") : t("common.add")}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {formData.features.map((feature, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 bg-surface hover:bg-surface-hover rounded-xl border border-border group transition-all"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-primary">
                {resolveLocalizedString(feature as any, currentLang, t)}
              </span>
              {typeof feature === "object" && (
                <span className="text-[10px] text-text-secondary">
                  {SUPPORTED_LANGUAGES.filter((l) => (feature as any)[l])
                    .map((l) => LANGUAGES[l].label)
                    .join(", ")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button
                onClick={() => startEditFeature(idx)}
                className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                title={t("common.edit")}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeFeature(idx)}
                className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                title={t("common.delete")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {formData.features.length === 0 && (
          <div className="text-center py-6 text-text-secondary text-sm italic border-2 border-dashed border-border rounded-xl">
            {t("admin.pricing.noFeaturesYet", "No features added yet")}
          </div>
        )}
      </div>
    </div>
  );
}
