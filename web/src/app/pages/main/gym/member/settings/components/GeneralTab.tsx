import { Scale } from "lucide-react";
import { useTranslation } from "react-i18next";
import SettingsTab from "../../../../../../components/settings/SettingsTab";

interface GeneralTabProps {
  weightUnit: "kg" | "lbs";
  setWeightUnit: (value: "kg" | "lbs") => void;
}

export default function GeneralTab({
  weightUnit,
  setWeightUnit,
}: GeneralTabProps) {
  const { t } = useTranslation();

  return (
    <SettingsTab
      title={t("settings.member.general.title", "General Settings")}
      description={t(
        "settings.member.general.description",
        "Configure your basic gym preferences",
      )}
      icon={Scale}
    >
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("settings.member.general.weightUnit", "Preferred Weight Unit")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "settings.member.general.weightUnitDesc",
            "Choose kg or lbs for your weight measurements",
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 p-5 bg-surface-hover/50 rounded-2xl border border-border/50 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white shadow-sm border border-border/50">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {t(
                  "settings.member.general.weightUnitLabel",
                  "Measurement Unit",
                )}
              </p>
              <p className="text-xs text-text-secondary">
                {t(
                  "settings.member.general.weightUnitTypeDesc",
                  "Applied to exercises and tracking",
                )}
              </p>
            </div>
          </div>
          <div className="flex bg-surface border border-border/50 rounded-xl p-1.5 w-full sm:w-auto">
            <button
              onClick={() => setWeightUnit("kg")}
              className={`flex-1 sm:flex-none px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
                weightUnit === "kg"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              kg
            </button>
            <button
              onClick={() => setWeightUnit("lbs")}
              className={`flex-1 sm:flex-none px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
                weightUnit === "lbs"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              lbs
            </button>
          </div>
        </div>
      </div>
    </SettingsTab>
  );
}
