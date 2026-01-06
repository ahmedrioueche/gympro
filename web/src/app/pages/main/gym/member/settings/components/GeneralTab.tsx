import { Scale } from "lucide-react";
import { useTranslation } from "react-i18next";

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {t("settings.member.general.title", "General Settings")}
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.member.general.description",
            "Configure your basic gym preferences"
          )}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t("settings.member.general.weightUnit", "Preferred Weight Unit")}
            </label>
            <div className="flex gap-4 p-4 bg-surface-hover rounded-xl border border-border">
              <div className="flex items-center gap-4 flex-1">
                <Scale className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {t(
                      "settings.member.general.weightUnitLabel",
                      "Measurement Unit"
                    )}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {t(
                      "settings.member.general.weightUnitDesc",
                      "Choose kg or lbs for your workouts"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex bg-surface border border-border rounded-lg p-1">
                <button
                  onClick={() => setWeightUnit("kg")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    weightUnit === "kg"
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  kg
                </button>
                <button
                  onClick={() => setWeightUnit("lbs")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    weightUnit === "lbs"
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  lbs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
