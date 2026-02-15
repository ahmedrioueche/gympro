import { type ViewPreference } from "@ahmedrioueche/gympro-client";
import { LayoutGrid, Monitor, Table as TableIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import SettingsTab from "../../../../../components/settings/SettingsTab";

interface GeneralTabProps {
  viewPreference: ViewPreference;
  setViewPreference: (mode: ViewPreference) => void;
}

export default function GeneralTab({
  viewPreference,
  setViewPreference,
}: GeneralTabProps) {
  const { t } = useTranslation();

  return (
    <SettingsTab
      title={t("settings.tabs.general", "General Settings")}
      description={t(
        "settings.general.description",
        "Choose how your data lists are displayed by default",
      )}
      icon={LayoutGrid}
    >
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("settings.general.layout", "Layout Preference")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "settings.general.layoutDesc",
            "Choose how your data lists are displayed by default",
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
          {[
            {
              id: "table",
              label: t("settings.theme.table", "Table View"),
              icon: TableIcon,
            },
            {
              id: "cards",
              label: t("settings.theme.cards", "Cards View"),
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

      <div className="pt-8 border-t border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("settings.general.appearance", "Appearance")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t("settings.general.appearanceDesc", "Customize how GymPro looks")}
        </p>
        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 flex items-start gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Monitor className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-primary">
              {t("settings.theme.dark", "Always Dark")}
            </h4>
            <p className="text-sm text-text-secondary mt-1 max-w-md">
              {t(
                "settings.general.darkOnlyNote",
                "GymPro currently defaults to a premium dark aesthetic for the best experience.",
              )}
            </p>
          </div>
        </div>
      </div>
    </SettingsTab>
  );
}
