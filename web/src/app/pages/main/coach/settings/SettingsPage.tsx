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
  } = useCoachSettings();

  const tabs = [
    {
      id: "profile",
      label: t("coach.settings.tabs.profile"),
      icon: User,
    },
    {
      id: "coaching",
      label: t("coach.settings.tabs.coaching"),
      icon: Award,
    },
    {
      id: "preferences",
      label: t("coach.settings.tabs.preferences"),
      icon: SettingsIcon,
    },
    {
      id: "security",
      label: t("coach.settings.tabs.security"),
      icon: Lock,
    },
  ];

  // Show save button on profile and coaching tabs
  const showSaveButton = activeTab === "profile" || activeTab === "coaching";

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("coach.settings.pageTitle")}
        subtitle={t("coach.settings.pageSubtitle")}
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

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CoachSettingsTabType)}
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
          {activeTab === "preferences" && <PreferencesSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}
