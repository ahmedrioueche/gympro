import {
  GYM_MANAGER_FEATURE_METADATA,
  GymManagerFeature,
} from "@ahmedrioueche/gympro-client";
import { AlertCircle, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  selectedFeatures: GymManagerFeature[];
  takenFeaturesMap: Record<string, string>;
  onToggle: (feature: GymManagerFeature) => void;
}

export default function FeaturePackageFeatures({
  selectedFeatures,
  takenFeaturesMap,
  onToggle,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">
          {t("admin.pricing.includedFeatures", "Included Features")}
        </label>
        <span className="text-[10px] text-text-secondary font-medium">
          {selectedFeatures.length} {t("common.selected")}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.values(GymManagerFeature).map((feature) => {
          const packageName = takenFeaturesMap[feature];
          const isTaken = !!packageName;
          const isSelected = selectedFeatures.includes(feature);

          return (
            <button
              key={feature}
              disabled={isTaken && !isSelected}
              onClick={() => onToggle(feature)}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left group relative ${
                isSelected
                  ? "bg-primary/10 border-primary text-primary shadow-sm"
                  : isTaken
                    ? "bg-surface-secondary border-border opacity-50 cursor-not-allowed"
                    : "bg-surface-secondary border-border text-text-secondary hover:border-primary/30"
              }`}
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                  isSelected
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-border group-hover:border-primary/30"
                }`}
              >
                {isSelected && <Plus className="w-4 h-4" />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-text-primary font-semibold">
                  {GYM_MANAGER_FEATURE_METADATA[feature]?.labelKey
                    ? t(GYM_MANAGER_FEATURE_METADATA[feature].labelKey)
                    : feature}
                </span>
                {isTaken && !isSelected && (
                  <span className="text-[9px] font-medium text-danger flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" />
                    {t(
                      "admin.pricing.alreadyAssignedTo",
                      "Used in '{{packageName}}'",
                      { packageName },
                    )}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
