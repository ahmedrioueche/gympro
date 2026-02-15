import { Bell, Save, Scale, Settings, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import PageHeader from "../../../../../components/PageHeader";
import SettingsContainer from "../../../../../components/settings/SettingsContainer";
import GeneralTab from "./components/GeneralTab";
import NotificationsTab from "./components/NotificationsTab";
import PrivacyTab from "./components/PrivacyTab";
import { useSettingsPage, type TabType } from "./hooks/useSettingsPage";

export default function SettingsPage() {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    isLoading,
    isSaving,
    handleSave,
    hasChanges,
    weightUnit,
    setWeightUnit,
    classReminders,
    setClassReminders,
    subscriptionRenewal,
    setSubscriptionRenewal,
    announcements,
    setAnnouncements,
    publicProfile,
    setPublicProfile,
    shareProgress,
    setShareProgress,
    currentGym,
  } = useSettingsPage();

  const tabs = [
    {
      id: "general" as TabType,
      label: t("settings.member.tabs.general", "General"),
      icon: Scale,
    },
    {
      id: "notifications" as TabType,
      label: t("settings.member.tabs.notifications", "Notifications"),
      icon: Bell,
    },
    {
      id: "privacy" as TabType,
      label: t("settings.member.tabs.privacy", "Privacy"),
      icon: Shield,
    },
  ];

  if (!currentGym) return null;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <PageHeader
        title={t("settings.member.pageTitle", "Gym Settings")}
        subtitle={t(
          "settings.member.pageSubtitle",
          "Manage your preferences for this gym",
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
        {isLoading ? (
          <div className="h-full flex items-center justify-center py-20">
            <Loading />
          </div>
        ) : (
          <>
            {activeTab === "general" && (
              <GeneralTab
                weightUnit={weightUnit}
                setWeightUnit={setWeightUnit}
              />
            )}

            {activeTab === "notifications" && (
              <NotificationsTab
                classReminders={classReminders}
                setClassReminders={setClassReminders}
                subscriptionRenewal={subscriptionRenewal}
                setSubscriptionRenewal={setSubscriptionRenewal}
                announcements={announcements}
                setAnnouncements={setAnnouncements}
              />
            )}

            {activeTab === "privacy" && (
              <PrivacyTab
                publicProfile={publicProfile}
                setPublicProfile={setPublicProfile}
                shareProgress={shareProgress}
                setShareProgress={setShareProgress}
              />
            )}
          </>
        )}
      </SettingsContainer>
    </div>
  );
}
