import { settingsApi, type AppLanguage } from "@ahmedrioueche/gympro-client";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../../../store/language";
import { useUserStore } from "../../../../../../store/user";

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

function CustomSelect({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (value: AppLanguage) => void;
  options: LanguageOption[];
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full md:w-48 flex items-center justify-between px-3 py-2 bg-surface border rounded-xl transition-all ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${
          isOpen
            ? "border-primary ring-1 ring-primary/20"
            : "border-border hover:border-text-secondary/50"
        }`}
      >
        <span className="flex items-center gap-2 text-text-primary">
          <span className="text-lg">{selectedOption.flag}</span>
          <span className="text-sm font-medium">{selectedOption.label}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-full md:w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  value === option.value
                    ? "bg-primary/10 text-primary"
                    : "text-text-primary hover:bg-surface-hover"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{option.flag}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
                {value === option.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
            value={i18n.language || "en"}
            onChange={handleLanguageChange}
            options={LANGUAGES}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
