import { Bell, Globe, Palette, Save, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../../../components/PageHeader";
import SettingsContainer from "../../../../components/settings/SettingsContainer";
import GeneralTab from "./components/GeneralTab";
import LocaleTab from "./components/LocaleTab";
import NotificationsTab from "./components/NotificationsTab";
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
    timezone,
    setTimezone,
    region,
    regionName,
    currency,
  } = useManagerSettings();

  const tabs = [
    {
      id: "general" as TabType,
      label: t("settings.tabs.general", "General"),
      icon: Palette,
    },
    {
      id: "notifications" as TabType,
      label: t("settings.tabs.notifications", "Notifications"),
      icon: Bell,
    },
    {
      id: "locale" as TabType,
      label: t("settings.tabs.locale", "Locale"),
      icon: Globe,
    },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <PageHeader
        title={t("settings.pageTitle", "Application Settings")}
        subtitle={t(
          "settings.pageSubtitle",
          "Manage your global preferences, notifications and locale settings.",
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

      <SettingsContainer
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabType)}
        tabs={tabs}
      >
        {activeTab === "general" && (
          <GeneralTab
            viewPreference={viewPreference}
            setViewPreference={setViewPreference}
          />
        )}

        {activeTab === "notifications" && (
          <NotificationsTab
            reminderMinutes={reminderMinutes}
            setReminderMinutes={setReminderMinutes}
          />
        )}

        {activeTab === "locale" && (
          <LocaleTab
            language={language}
            setLanguage={setLanguage}
            timezone={timezone}
            setTimezone={setTimezone}
            region={region}
            regionName={regionName}
            currency={currency}
          />
        )}
      </SettingsContainer>
    </div>
  );
}
