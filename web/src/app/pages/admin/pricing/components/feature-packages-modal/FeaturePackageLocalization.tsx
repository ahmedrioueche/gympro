import {
  SUPPORTED_LANGUAGES,
  type AppLanguage,
} from "@ahmedrioueche/gympro-client";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";

interface Props {
  localizedName: Record<AppLanguage, string>;
  isTranslating: boolean;
  onTranslate: () => void;
  onChange: (lang: AppLanguage, value: string) => void;
  disabledTranslate: boolean;
}

export default function FeaturePackageLocalization({
  localizedName,
  isTranslating,
  onTranslate,
  onChange,
  disabledTranslate,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="p-4 rounded-2xl bg-primary/5 border-2 border-primary/10 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {t("admin.pricing.localizedNames", "Localized Names")}
        </h3>
        <button
          onClick={onTranslate}
          disabled={isTranslating || disabledTranslate}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all disabled:opacity-50"
        >
          <Sparkles className="w-3 h-3" />
          {isTranslating
            ? t("common.translating")
            : t("admin.pricing.aiTranslate", "AI Translate")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <InputField
            key={lang}
            label={lang.toUpperCase()}
            dir={lang === "ar" ? "rtl" : "ltr"}
            placeholder={t(
              `admin.pricing.placeholders.name_${lang}`,
              `Name in ${lang.toUpperCase()}`,
            )}
            value={localizedName[lang] || ""}
            className="text-sm"
            onChange={(e) => onChange(lang, e.target.value)}
          />
        ))}
      </div>
    </div>
  );
}
