import { type AppLanguage } from "@ahmedrioueche/gympro-client";
import { Globe } from "lucide-react";
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
}

export default function PreferencesSettings({
  language,
  onUpdate,
}: PreferencesSettingsProps) {
  const { t } = useTranslation();

  return (
    <SettingsTab
      title={t("member.settings.preferences.title")}
      description={t("member.settings.preferences.subtitle")}
      icon={Globe}
    >
      <div className="space-y-6 max-w-2xl">
        {/* Language Selection */}
        <div className="bg-background border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-surface border border-border text-text-secondary">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-text-primary">
                {t("member.settings.preferences.language")}
              </p>
              <p className="text-sm text-text-secondary">
                {t("member.settings.preferences.languageDesc")}
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
    </SettingsTab>
  );
}
