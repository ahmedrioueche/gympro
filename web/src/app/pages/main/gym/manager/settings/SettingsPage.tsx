import {
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Clock,
  CreditCard,
  MapPin,
  Save,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../../../../components/PageHeader";
import SettingsContainer from "../../../../../components/settings/SettingsContainer";
import ClosuresTab from "./components/ClosuresTab";
import FacilitiesTab from "./components/FacilitiesTab";
import GeneralTab from "./components/GeneralTab";
import LocationTab from "./components/LocationTab";
import NotificationsTab from "./components/NotificationsTab";
import PaymentsTab from "./components/PaymentsTab";
import RulesTab from "./components/RulesTab";
import {
  useGymManagerSettings,
  type TabType,
} from "./hooks/useGymManagerSettings";

export default function SettingsPage() {
  const { t } = useTranslation();
  const {
    currentGym,
    activeTab,
    setActiveTab,
    isSaving,
    handleSave,
    hasChanges,
    workingHoursStart,
    setWorkingHoursStart,
    workingHoursEnd,
    setWorkingHoursEnd,
    useAdvancedHours,
    setUseAdvancedHours,
    isMixed,
    setIsMixed,
    femaleOnlyHours,
    setFemaleOnlyHours,
    notificationsEnabled,
    setNotificationsEnabled,
    reminderSettings,
    setReminderSettings,
    paymentMethods,
    customWorkingHours,
    setCustomWorkingHours,
    accessControlType,
    setAccessControlType,
    defaultCurrency,
    setDefaultCurrency,
    rules,
    addRule,
    removeRule,
    // Location fields
    address,
    setAddress,
    city,
    setCity,
    state,
    setState,
    country,
    setCountry,
    phone,
    setPhone,
    email,
    setEmail,
    website,
    setWebsite,
    temporaryClosures,
    setTemporaryClosures,
    handleUpdateClosures,
    workingDays,
    setWorkingDays,
    notifyScheduleChanges,
    setNotifyScheduleChanges,
    addPaymentMethod,
    removePaymentMethod,
    togglePaymentMethod,
    // Facilities
    facilities,
    handleAddFacility,
    handleUpdateFacility,
    handleRemoveFacility,
    isFacilityLoading,
  } = useGymManagerSettings();

  const tabs = [
    {
      id: "general",
      label: t("settings.gym.tabs.general", "General"),
      icon: Clock,
    },
    {
      id: "location",
      label: t("settings.gym.tabs.location", "Location"),
      icon: MapPin,
    },
    {
      id: "facilities",
      label: t("settings.gym.tabs.facilities", "Facilities"),
      icon: Building2,
    },
    {
      id: "payments",
      label: t("settings.gym.tabs.payments", "Payments"),
      icon: CreditCard,
    },

    {
      id: "rules",
      label: t("settings.gym.tabs.rules", "Rules"),
      icon: BookOpen,
    },
    {
      id: "closures",
      label: t("settings.gym.tabs.closures", "Closures"),
      icon: CalendarDays,
    },
    {
      id: "notifications",
      label: t("settings.gym.tabs.notifications", "Notifications"),
      icon: Bell,
    },
  ];

  if (!currentGym) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("settings.gym.pageTitle", "Gym Settings")}
        subtitle={t(
          "settings.gym.pageSubtitle",
          "Configure your gym-specific preferences and policies",
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
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabType)}
      >
        {activeTab === "general" && (
          <GeneralTab
            workingHoursStart={workingHoursStart}
            setWorkingHoursStart={setWorkingHoursStart}
            workingHoursEnd={workingHoursEnd}
            setWorkingHoursEnd={setWorkingHoursEnd}
            useAdvancedHours={useAdvancedHours}
            setUseAdvancedHours={setUseAdvancedHours}
            customWorkingHours={customWorkingHours}
            setCustomWorkingHours={setCustomWorkingHours}
            isMixed={isMixed}
            setIsMixed={setIsMixed}
            femaleOnlyHours={femaleOnlyHours}
            setFemaleOnlyHours={setFemaleOnlyHours}
            accessControlType={accessControlType}
            setAccessControlType={setAccessControlType}
            defaultCurrency={defaultCurrency}
            setDefaultCurrency={setDefaultCurrency}
            workingDays={workingDays}
            setWorkingDays={setWorkingDays}
          />
        )}

        {activeTab === "location" && (
          <LocationTab
            address={address}
            setAddress={setAddress}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            country={country}
            setCountry={setCountry}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            website={website}
            setWebsite={setWebsite}
          />
        )}

        {activeTab === "notifications" && (
          <NotificationsTab
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
            reminderSettings={reminderSettings}
            setReminderSettings={setReminderSettings}
            notifyScheduleChanges={notifyScheduleChanges}
            setNotifyScheduleChanges={setNotifyScheduleChanges}
          />
        )}

        {activeTab === "rules" && (
          <RulesTab rules={rules} addRule={addRule} removeRule={removeRule} />
        )}
        {activeTab === "closures" && (
          <ClosuresTab
            closures={temporaryClosures}
            setClosures={setTemporaryClosures}
            onSave={handleUpdateClosures}
            workingHoursStart={workingHoursStart}
            isSaving={isSaving}
          />
        )}

        {activeTab === "payments" && (
          <PaymentsTab
            paymentMethods={paymentMethods}
            togglePaymentMethod={togglePaymentMethod}
            addPaymentMethod={addPaymentMethod}
            removePaymentMethod={removePaymentMethod}
          />
        )}

        {activeTab === "facilities" && (
          <FacilitiesTab
            facilities={facilities}
            onAdd={handleAddFacility}
            onUpdate={handleUpdateFacility}
            onRemove={handleRemoveFacility}
            isLoading={isFacilityLoading}
          />
        )}
      </SettingsContainer>
    </div>
  );
}
