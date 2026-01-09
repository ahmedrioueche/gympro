import {
  LANGUAGES,
  SUPPORTED_TIMEZONES,
  type AppLanguage,
  type ViewPreference,
} from "@ahmedrioueche/gympro-client";
import {
  Bell,
  Globe,
  Info,
  LayoutGrid,
  Mail,
  Monitor,
  Palette,
  Save,
  Settings,
  Table,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../components/ui/Button";
import CustomSelect from "../../../../../components/ui/CustomSelect";
import InputField from "../../../../../components/ui/InputField";
import { handleContactSupport } from "../../../../../utils/contact";
import PageHeader from "../../../../components/PageHeader";
import { useManagerSettings, type TabType } from "./hooks/useManagerSettings";

export default function SettingsPage() {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    isSaving,
    handleSave,
    hasChanges,
    viewPreference,
    setViewPreference,
    reminderMinutes,
    setReminderMinutes,
    language,
    setLanguage,
    currency,
    timezone,
    setTimezone,
    region,
    regionName,
  } = useManagerSettings();

  const tabs = [
    {
      id: "general",
      label: t("settings.tabs.general", "General"),
      icon: Palette,
    },
    {
      id: "notifications",
      label: t("settings.tabs.notifications", "Notifications"),
      icon: Bell,
    },
    { id: "locale", label: t("settings.tabs.locale", "Locale"), icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("settings.pageTitle", "Settings")}
        subtitle={t(
          "settings.pageSubtitle",
          "Manage your application preferences"
        )}
        icon={Settings}
        actionButton={{
          label: t("common.saveChanges", "Save Changes"),
          icon: Save,
          onClick: handleSave,
          loading: isSaving,
          disabled: isSaving || !hasChanges,
        }}
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-surface border border-border rounded-2xl p-6 shadow-sm min-h-[400px]">
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {t("settings.general.layout", "Layout Preference")}
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  {t(
                    "settings.general.layoutDesc",
                    "Choose how your data lists are displayed by default"
                  )}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                  {[
                    {
                      id: "table",
                      label: t("settings.theme.table", "Table View"),
                      icon: Table,
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
                        onClick={() =>
                          setViewPreference(mode.id as ViewPreference)
                        }
                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 gap-3 ${
                          isActive
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50 text-text-secondary hover:bg-surface-hover"
                        }`}
                      >
                        <Icon
                          className={`w-8 h-8 ${
                            isActive ? "text-primary" : ""
                          }`}
                        />
                        <span className="font-medium">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {t("settings.general.appearance", "Appearance")}
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  {t(
                    "settings.general.appearanceDesc",
                    "Customize how GymPro looks"
                  )}
                </p>
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 flex items-start gap-3">
                  <Monitor className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-primary">
                      {t("settings.theme.dark", "Always Dark")}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">
                      {t(
                        "settings.general.darkOnlyNote",
                        "GymPro currently defaults to a premium dark aesthetic for the best experience."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {t("settings.notifications.alerts", "Reminder Settings")}
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  {t(
                    "settings.notifications.alertsDesc",
                    "Configure how early you want to be notified of events"
                  )}
                </p>

                <div className="max-w-xs">
                  <InputField
                    type="number"
                    label={t(
                      "settings.notifications.reminderMinutes",
                      "Default Reminder (minutes)"
                    )}
                    value={reminderMinutes}
                    onChange={(e) =>
                      setReminderMinutes(parseInt(e.target.value) || 0)
                    }
                    min={0}
                    max={1440}
                  />
                </div>
              </div>

              <div className="p-4 bg-surface-hover rounded-xl border border-border flex items-start gap-3">
                <Bell className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-text-primary">
                    {t("settings.notifications.note", "Real-time delivery")}
                  </h4>
                  <p className="text-xs text-text-secondary mt-1">
                    {t(
                      "settings.notifications.noteDesc",
                      "Notifications are delivered instantly via WebSockets when you are online."
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "locale" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {t("settings.locale.title", "Regional & Language")}
                </h3>
                <p className="text-sm text-text-secondary mb-6">
                  {t(
                    "settings.locale.desc",
                    "Set your preferred language and timezone"
                  )}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomSelect
                    title={t("settings.locale.language", "Language")}
                    options={Object.entries(LANGUAGES).map(([key, value]) => ({
                      value: key as AppLanguage,
                      label: value.label,
                      flag: value.flag,
                    }))}
                    selectedOption={language}
                    onChange={(val) => setLanguage(val as AppLanguage)}
                  />

                  <CustomSelect
                    title={t("settings.locale.timezone", "Timezone")}
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
                      {t("settings.locale.region", "Region")}
                    </label>
                    <div className="p-3 px-4 rounded-lg border border-border bg-surface-hover/50 text-text-secondary cursor-not-allowed">
                      {regionName || region || "N/A"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-primary">
                      {t("settings.locale.currency", "Business Currency")}
                    </label>
                    <div className="p-3 px-4 rounded-lg border border-border bg-surface-hover/50 text-text-secondary cursor-not-allowed">
                      {currency}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="text-base font-semibold text-text-primary">
                      {t(
                        "settings.locale.contactSupportTitle",
                        "Need a change?"
                      )}
                    </h4>
                  </div>
                  <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                    {t(
                      "settings.locale.contactSupportDesc",
                      "To ensure billing accuracy, business region and currency settings are managed by our support team. We're here to help you scaling your business!"
                    )}
                  </p>
                  <Button
                    variant="outline"
                    color="primary"
                    onClick={() => handleContactSupport(t)}
                    icon={<Mail className="w-4 h-4" />}
                  >
                    {t("common.contactSupport", "Contact Support")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
