import {
  Award,
  Lock,
  Save,
  Settings as SettingsIcon,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../../../components/PageHeader";
import PreferencesSettings from "../../../../components/settings/PreferencesSettings";
import SecuritySettings from "../../../../components/settings/SecuritySettings";
import SettingsContainer from "../../../../components/settings/SettingsContainer";
import CoachingSettings from "./components/CoachingSettings";
import ProfileSettings from "./components/ProfileSettings";
import {
  useCoachSettings,
  type CoachSettingsTabType,
} from "./hooks/useCoachSettings";

export default function SettingsPage() {
  const { t } = useTranslation();
  const {
    user,
    activeTab,
    setActiveTab,
    // Profile
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
    addEmailMode,
    setAddEmailMode,
    addPhoneMode,
    setAddPhoneMode,
    uploading,
    handleAvatarUpload,
    gettingLocation,
    handleGetLocation,
    // Coaching
    bio,
    setBio,
    specializations,
    setSpecializations,
    yearsOfExperience,
    setYearsOfExperience,
    // Save
    handleSave,
    isSaving,
    hasChanges,
    // Security
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    // Preferences
    language,
    setLanguage,
    weightUnit,
    setWeightUnit,
  } = useCoachSettings();

  const tabs = [
    {
      id: "profile",
      label: t("extra.coachSettings.tabs.profile", "Profile"),
      icon: User,
    },

    {
      id: "preferences",
      label: t("extra.coachSettings.tabs.preferences", "Preferences"),
      icon: SettingsIcon,
    },
    {
      id: "coaching",
      label: t("extra.coachSettings.tabs.coaching", "Coaching"),
      icon: Award,
    },
    {
      id: "security",
      label: t("extra.coachSettings.tabs.security", "Security"),
      icon: Lock,
    },
  ];

  // Show save button on profile, coaching, and security tabs
  const showSaveButton =
    activeTab === "profile" ||
    activeTab === "coaching" ||
    activeTab === "security" ||
    activeTab === "preferences";

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <PageHeader
        title={t("extra.coachSettings.pageTitle", "Coach Profile")}
        subtitle={t(
          "extra.coachSettings.pageSubtitle",
          "Manage your professional presence and coaching availability",
        )}
        icon={SettingsIcon}
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

      <SettingsContainer
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as CoachSettingsTabType)}
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
            addEmailMode={addEmailMode}
            setAddEmailMode={setAddEmailMode}
            addPhoneMode={addPhoneMode}
            setAddPhoneMode={setAddPhoneMode}
            uploading={uploading}
            handleAvatarUpload={handleAvatarUpload}
            gettingLocation={gettingLocation}
            handleGetLocation={handleGetLocation}
          />
        )}
        {activeTab === "coaching" && (
          <CoachingSettings
            bio={bio}
            setBio={setBio}
            specializations={specializations}
            setSpecializations={setSpecializations}
            yearsOfExperience={yearsOfExperience}
            setYearsOfExperience={setYearsOfExperience}
          />
        )}
        {activeTab === "preferences" && (
          <PreferencesSettings
            language={language}
            onUpdate={setLanguage}
            weightUnit={weightUnit}
            setWeightUnit={setWeightUnit}
            title={t("extra.coachSettings.tabs.preferences", "Preferences")}
            description={t("extra.coachSettings.pageSubtitle")}
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
            title={t("extra.coachSettings.tabs.security", "Security")}
            description={t("extra.coachSettings.pageSubtitle")}
          />
        )}
      </SettingsContainer>
    </div>
  );
}
