import { Bell, Save, Settings, Shield, Sliders } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import PageHeader from "../../../../../components/PageHeader";
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
      id: "general",
      label: t("settings.member.tabs.general", "General"),
      icon: Sliders,
    },
    {
      id: "notifications",
      label: t("settings.member.tabs.notifications", "Notifications"),
      icon: Bell,
    },
    {
      id: "privacy",
      label: t("settings.member.tabs.privacy", "Privacy"),
      icon: Shield,
    },
  ];

  if (!currentGym) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("settings.member.pageTitle", "Gym Settings")}
        subtitle={t(
          "settings.member.pageSubtitle",
          "Manage your preferences for this gym"
        )}
        icon={Settings}
        actionButton={{
          label: t("common.saveChanges", "Save Changes"),
          icon: Save,
          onClick: handleSave,
          loading: isSaving,
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
        </div>
      </div>
    </div>
  );
}
