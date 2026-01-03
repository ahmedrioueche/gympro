import { Check, ChevronDown, Globe, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface LanguageOption {
  value: string;
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
}: {
  value: string;
  onChange: (value: string) => void;
  options: LanguageOption[];
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
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full md:w-48 flex items-center justify-between px-3 py-2 bg-surface border rounded-xl transition-all ${
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
  // TODO: Use theme store when available
  const isDark = false;

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    // Persist language preference if needed
    localStorage.setItem("i18nextLng", lang);
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
                Choose your preferred language
              </p>
            </div>
          </div>

          <CustomSelect
            value={i18n.language || "en"}
            onChange={handleLanguageChange}
            options={LANGUAGES}
          />
        </div>

        {/* Theme Selection - Placeholder for now */}
        <div className="bg-background border border-border rounded-xl p-4 flex items-center justify-between opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-surface border border-border text-text-secondary">
              {isDark ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="font-medium text-text-primary">
                {t("member.settings.preferences.theme")}
              </p>
              <p className="text-sm text-text-secondary">
                Toggle dark/light mode (Coming soon)
              </p>
            </div>
          </div>
          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-border">
            <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
          </div>
        </div>
      </div>
    </div>
  );
}
