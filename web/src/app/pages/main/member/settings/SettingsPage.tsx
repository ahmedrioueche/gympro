import { Dumbbell, Lock, Save, Settings, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../../../components/PageHeader";
import PreferencesSettings from "../../../../components/settings/PreferencesSettings";
import SecuritySettings from "../../../../components/settings/SecuritySettings";
import SettingsContainer from "../../../../components/settings/SettingsContainer";
import TrainingSettings from "../../../../components/settings/TrainingSettings";
import ProfileSettings from "./components/ProfileSettings";
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
    city,
    setCity,
    state,
    setState,
    country,
    setCountry,
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
    weightUnit,
    setWeightUnit,
    // Training
    timerSettings,
    setTimerSettings,
    // Security
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    // Verification
    verificationState,
    handleRequestVerification,
    handleConfirmVerification,
    setVerificationState,
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
    {
      id: "training",
      label: t("member.settings.tabs.training", "Training"),
      icon: Dumbbell,
    },
  ];

  // Save button logic: always show, disable if no changes or currently saving
  const isSaveDisabled = isSaving || !hasChanges;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <PageHeader
        title={t("member.settings.pageTitle", "Member Settings")}
        subtitle={t(
          "member.settings.pageSubtitle",
          "Manage your account, preferences and training settings",
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
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as MemberSettingsTabType)}
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
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            country={country}
            setCountry={setCountry}
            addPhoneMode={addPhoneMode}
            setAddPhoneMode={setAddPhoneMode}
            uploading={uploading}
            handleAvatarUpload={handleAvatarUpload}
            verificationState={verificationState}
            handleRequestVerification={handleRequestVerification}
            handleConfirmVerification={handleConfirmVerification}
            setVerificationState={setVerificationState}
          />
        )}
        {activeTab === "preferences" && (
          <PreferencesSettings
            language={language}
            onUpdate={setLanguage}
            weightUnit={weightUnit}
            setWeightUnit={setWeightUnit}
          />
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
        {activeTab === "training" && (
          <TrainingSettings
            timerSettings={timerSettings}
            onUpdate={setTimerSettings}
          />
        )}
      </SettingsContainer>
    </div>
  );
}
