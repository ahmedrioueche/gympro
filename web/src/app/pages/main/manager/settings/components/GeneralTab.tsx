import {
  LANGUAGES,
  SUPPORTED_TIMEZONES,
  type AppLanguage,
  type ViewPreference,
} from "@ahmedrioueche/gympro-client";
import {
  Globe,
  Info,
  LayoutGrid,
  Mail,
  Table as TableIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../components/ui/Button";
import CustomSelect from "../../../../../../components/ui/CustomSelect";
import { handleContactSupport } from "../../../../../../utils/contact";
import SettingsTab from "../../../../../components/settings/SettingsTab";

interface GeneralTabProps {
  viewPreference: ViewPreference;
  setViewPreference: (mode: ViewPreference) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  timezone: string;
  setTimezone: (tz: string) => void;
  region: string | null;
  regionName: string | null;
  currency: string;
}

export default function GeneralTab({
  viewPreference,
  setViewPreference,
  language,
  setLanguage,
  timezone,
  setTimezone,
  region,
  regionName,
  currency,
}: GeneralTabProps) {
  const { t } = useTranslation();

  return (
    <SettingsTab
      title={t("extra.settings.tabs.general", "General")}
      description={t(
        "extra.settings.pageSubtitle",
        "Manage your global preferences, notifications and locale settings.",
      )}
      icon={Globe}
    >
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("extra.settings.locale.title", "Regional & Language")}
        </h4>
        <p className="text-sm text-text-secondary mb-8">
          {t(
            "extra.settings.locale.desc",
            "Set your preferred language and timezone",
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CustomSelect
            title={t("extra.settings.locale.language", "Language")}
            options={Object.entries(LANGUAGES).map(([key, value]) => ({
              value: key as AppLanguage,
              label: value.label,
              flag: value.flag,
            }))}
            selectedOption={language}
            onChange={(val) => setLanguage(val as AppLanguage)}
          />

          <CustomSelect
            title={t("extra.settings.locale.timezone", "Timezone")}
            options={SUPPORTED_TIMEZONES.map((tz) => ({
              value: tz,
              label: tz,
            }))}
            selectedOption={timezone}
            onChange={(val) => setTimezone(val)}
            className="max-h-48"
          />

          {/* Read-only sections */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              {t("extra.settings.locale.region", "Region")}
            </label>
            <div className="p-3.5 px-5 rounded-xl border border-border bg-surface-hover/50 text-text-secondary cursor-not-allowed font-medium">
              {regionName || region || "N/A"}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              {t("extra.settings.locale.currency", "Business Currency")}
            </label>
            <div className="p-3.5 px-5 rounded-xl border border-border bg-surface-hover/50 text-text-secondary cursor-not-allowed font-medium">
              {currency}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10 mb-10">
        <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-bold text-text-primary">
                {t(
                  "extra.settings.locale.contactSupportTitle",
                  "Need a change?",
                )}
              </h4>
            </div>
            <p className="text-sm text-text-secondary mb-8 leading-relaxed max-w-2xl">
              {t(
                "extra.settings.locale.contactSupportDesc",
                "To ensure billing accuracy, business region and currency settings are managed by our support team. We're here to help you scaling your business!",
              )}
            </p>
            <Button
              variant="outline"
              onClick={() => handleContactSupport(t)}
              icon={<Mail className="w-4 h-4" />}
              size="lg"
            >
              {t("common.contactSupport", "Contact Support")}
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("extra.settings.general.layout", "Layout Preference")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "extra.settings.general.layoutDesc",
            "Choose how your data lists are displayed by default",
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
          {[
            {
              id: "table",
              label: t("extra.settings.theme.table", "Table View"),
              icon: TableIcon,
            },
            {
              id: "cards",
              label: t("extra.settings.theme.cards", "Cards View"),
              icon: LayoutGrid,
            },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = viewPreference === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setViewPreference(mode.id as ViewPreference)}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 gap-3 ${
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50 text-text-secondary hover:bg-surface-hover"
                }`}
              >
                <Icon className={`w-8 h-8 ${isActive ? "text-primary" : ""}`} />
                <span className="font-medium">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </SettingsTab>
  );
}
