import { Lock, Save, Settings, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../../components/PageHeader";
import PreferencesSettings from "../../../components/settings/PreferencesSettings";
import SecuritySettings from "../../../components/settings/SecuritySettings";
import SettingsContainer from "../../../components/settings/SettingsContainer";
import ProfileSettings from "./components/ProfileSettings";
import {
  useAdminSettings,
  type AdminSettingsTabType,
} from "./hooks/useAdminSettings";

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
    // Preferences
    language,
    setLanguage,
    // Security
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
  } = useAdminSettings();

  const tabs = [
    {
      id: "profile",
      label: t("member.settings.tabs.profile", "Profile"),
      icon: User,
    },
    {
      id: "preferences",
      label: t("member.settings.tabs.preferences", "Preferences"),
      icon: Settings,
    },
    {
      id: "security",
      label: t("member.settings.tabs.security", "Security"),
      icon: Lock,
    },
  ];

  // Save button logic: always show, disable if no changes or currently saving
  const isSaveDisabled = isSaving || !hasChanges;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <PageHeader
        title={t("member.settings.pageTitle", "Admin Settings")}
        subtitle={t(
          "member.settings.pageSubtitle",
          "Manage your personal account and preferences",
        )}
        icon={Settings}
        actionButton={{
          label: t("common.saveChanges", "Save Changes"),
          icon: Save,
          onClick: handleSave,
          loading: isSaving,
          disabled: isSaveDisabled,
        }}
      />

      <SettingsContainer
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as AdminSettingsTabType)}
        tabs={tabs}
      >
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
        {activeTab === "preferences" && (
          <PreferencesSettings language={language} onUpdate={setLanguage} />
        )}
        {activeTab === "security" && (
          <SecuritySettings
            currentPassword={currentPassword}
            onCurrentPasswordChange={setCurrentPassword}
            newPassword={newPassword}
            onNewPasswordChange={setNewPassword}
            confirmPassword={confirmPassword}
            onConfirmPasswordChange={setConfirmPassword}
          />
        )}
      </SettingsContainer>
    </div>
  );
}
