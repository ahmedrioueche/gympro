import { type AppLanguage } from "@ahmedrioueche/gympro-client";
import { Globe, Scale } from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../components/ui/CustomSelect";
import SettingsTab from "./SettingsTab";

interface LanguageOption {
  value: AppLanguage;
  label: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "ar", label: "العربية", flag: "🇩🇿" },
];

interface PreferencesSettingsProps {
  language: AppLanguage;
  onUpdate: (lang: AppLanguage) => void;
  weightUnit: "kg" | "lbs";
  setWeightUnit: (unit: "kg" | "lbs") => void;
  title?: string;
  description?: string;
}

export default function PreferencesSettings({
  language,
  onUpdate,
  weightUnit,
  setWeightUnit,
  title,
  description,
}: PreferencesSettingsProps) {
  const { t } = useTranslation();

  return (
    <SettingsTab
      title={
        title || t("member.settings.preferences.title", "General Preferences")
      }
      description={
        description ||
        t(
          "member.settings.preferences.subtitle",
          "Configure your app experience and units",
        )
      }
      icon={Globe}
    >
      <div className="space-y-8 max-w-2xl">
        {/* Language Selection */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
            {t("extra.settings.language", "Language")}
          </h4>
          <p className="text-sm text-text-secondary mb-4">
            {t(
              "extra.settings.languageDesc",
              "Select your preferred language for the interface",
            )}
          </p>
          <div className="bg-surface-hover/50 border border-border/50 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-white shadow-sm border border-border/50 text-primary">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-text-primary">
                  {t("extra.settings.displayLanguage", "Display Language")}
                </p>
              </div>
            </div>

            <CustomSelect
              selectedOption={language}
              onChange={(val) => onUpdate(val as AppLanguage)}
              options={LANGUAGES}
            />
          </div>
        </div>

        {/* Weight Unit Selection */}
        <div className="pt-8 border-t border-border">
          <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
            {t("extra.settings.weightUnit", "Preferred Weight Unit")}
          </h4>
          <p className="text-sm text-text-secondary mb-4">
            {t(
              "extra.settings.weightUnitDesc",
              "Choose kg or lbs for your weight measurements",
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 p-5 bg-surface-hover/50 rounded-2xl border border-border/50 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-white shadow-sm border border-border/50 text-primary">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {t("extra.settings.measurementUnit", "Measurement Unit")}
                </p>
                <p className="text-xs text-text-secondary">
                  {t(
                    "extra.settings.measurementUnitDesc",
                    "Used for exercises and progress tracking",
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
      </div>
    </SettingsTab>
  );
}
