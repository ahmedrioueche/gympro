import { Lock, Save, Settings, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../../../components/PageHeader";
import PreferencesSettings from "./components/PreferencesSettings";
import ProfileSettings from "./components/ProfileSettings";
import SecuritySettings from "./components/SecuritySettings";
import {
  useMemberSettings,
  type MemberSettingsTabType,
} from "./hooks/useMemberSettings";

export default function SettingsPage() {
  const { t } = useTranslation();
  const {
    user,
    activeTab,
    setActiveTab,
    fullName,
    setFullName,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    addEmailMode,
    setAddEmailMode,
    addPhoneMode,
    setAddPhoneMode,
    uploading,
    handleAvatarUpload,
    handleSave,
    isSaving,
    hasChanges,
  } = useMemberSettings();

  const tabs = [
    {
      id: "profile",
      label: t("member.settings.tabs.profile"),
      icon: User,
    },
    {
      id: "preferences",
      label: t("member.settings.tabs.preferences"),
      icon: Settings,
    },
    {
      id: "security",
      label: t("member.settings.tabs.security"),
      icon: Lock,
    },
  ];

  // Only show save button on profile tab
  const showSaveButton = activeTab === "profile";

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("member.settings.pageTitle")}
        subtitle={t("member.settings.pageSubtitle")}
        icon={Settings}
        actionButton={
          showSaveButton
            ? {
                label: t("common.saveChanges", "Save Changes"),
                icon: Save,
                onClick: handleSave,
                loading: isSaving,
                disabled: isSaving || !hasChanges,
              }
            : undefined
        }
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as MemberSettingsTabType)}
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
          {activeTab === "profile" && user && (
            <ProfileSettings
              user={user}
              fullName={fullName}
              setFullName={setFullName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              email={email}
              setEmail={setEmail}
              addEmailMode={addEmailMode}
              setAddEmailMode={setAddEmailMode}
              addPhoneMode={addPhoneMode}
              setAddPhoneMode={setAddPhoneMode}
              uploading={uploading}
              handleAvatarUpload={handleAvatarUpload}
            />
          )}
          {activeTab === "preferences" && <PreferencesSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}
