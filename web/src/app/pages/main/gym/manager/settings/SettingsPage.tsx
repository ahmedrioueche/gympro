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
    isMixed,
    setIsMixed,
    femaleOnlyHours,
    setFemaleOnlyHours,
    notificationsEnabled,
    setNotificationsEnabled,
    reminderSettings,
    setReminderSettings,
    paymentMethods,
    setPaymentMethods,
    allowCustomSubscriptions,
    setAllowCustomSubscriptions,
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
            <GeneralTab
              workingHoursStart={workingHoursStart}
              setWorkingHoursStart={setWorkingHoursStart}
              workingHoursEnd={workingHoursEnd}
              setWorkingHoursEnd={setWorkingHoursEnd}
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
        </div>
      </div>
    </div>
  );
}
