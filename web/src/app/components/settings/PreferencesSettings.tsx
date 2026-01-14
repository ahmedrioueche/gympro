import { settingsApi, type AppLanguage } from "@ahmedrioueche/gympro-client";
import { Globe } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../components/ui/CustomSelect";
import { useLanguageStore } from "../../../store/language";
import { useUserStore } from "../../../store/user";

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

export default function PreferencesSettings() {
  const { t, i18n } = useTranslation();
  const { user, updateSettings } = useUserStore();
  const { setLanguage: setGlobalLanguage } = useLanguageStore();
  const [isSaving, setIsSaving] = useState(false);

  // TODO: Use theme store when available
  const isDark = false;

  const handleLanguageChange = async (lang: AppLanguage) => {
    setIsSaving(true);
    try {
      const updates = {
        locale: {
          ...user?.appSettings?.locale,
          language: lang,
        },
      };

      const res = await settingsApi.updateSettings(updates);
      if (res.success) {
        updateSettings(updates as any);
        setGlobalLanguage(lang);
        toast.success(
          t("settings.saveSuccess", "Language updated successfully")
        );
      } else {
        toast.error(
          res.message || t("settings.saveError", "Failed to update language")
        );
      }
    } catch (error) {
      console.error("Failed to save language setting:", error);
      toast.error(t("settings.saveError", "Failed to update language"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          {t("member.settings.preferences.title")}
        </h3>
        <p className="text-sm text-text-secondary">
          {t("member.settings.preferences.subtitle")}
        </p>
      </div>

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
            selectedOption={i18n.language || "en"}
            onChange={handleLanguageChange}
            options={LANGUAGES}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
