import type { Currency, WeeklyTimeRange } from "@ahmedrioueche/gympro-client";
import { Bell, Clock, Dumbbell, Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useUpdateGymSettings } from "../../../../../../hooks/queries/useGyms";
import { useGymStore } from "../../../../../../store/gym";
import PageHeader from "../../../../../components/PageHeader";
import GeneralTab from "./components/GeneralTab";
import NotificationsTab from "./components/NotificationsTab";
import ServicesTab from "./components/ServicesTab";

type TabType = "general" | "notifications" | "services";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { currentGym, setGym } = useGymStore();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const updateSettings = useUpdateGymSettings();

  // Form State - Initialize with proper defaults
  const [workingHoursStart, setWorkingHoursStart] = useState("06:00");
  const [workingHoursEnd, setWorkingHoursEnd] = useState("22:00");
  const [isMixed, setIsMixed] = useState(false);
  const [femaleOnlyHours, setFemaleOnlyHours] = useState<WeeklyTimeRange[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [renewalReminderDays, setRenewalReminderDays] = useState(7);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(["cash"]);
  const [servicesOffered, setServicesOffered] = useState<string[]>(["gym"]);
  const [allowCustomSubscriptions, setAllowCustomSubscriptions] =
    useState(false);
  const [accessControlType, setAccessControlType] =
    useState<string>("flexible");
  const [defaultCurrency, setDefaultCurrency] = useState<Currency>("USD");

  // Load initial settings from current gym
  useEffect(() => {
    if (currentGym?.settings) {
      const settings = currentGym.settings;

      // Working hours - only update if they exist
      if (settings.workingHours?.start) {
        setWorkingHoursStart(settings.workingHours.start);
      }
      if (settings.workingHours?.end) {
        setWorkingHoursEnd(settings.workingHours.end);
      }

      // Gender policy
      if (settings.isMixed !== undefined) {
        setIsMixed(settings.isMixed);
      }

      // Female-only hours
      if (settings.femaleOnlyHours && settings.femaleOnlyHours.length > 0) {
        setFemaleOnlyHours(settings.femaleOnlyHours);
      }

      // Notifications
      if (settings.notificationsEnabled !== undefined) {
        setNotificationsEnabled(settings.notificationsEnabled);
      }
      if (settings.subscriptionRenewalReminderDays !== undefined) {
        setRenewalReminderDays(settings.subscriptionRenewalReminderDays);
      }

      // Payment methods
      if (settings.paymentMethods && settings.paymentMethods.length > 0) {
        setPaymentMethods(settings.paymentMethods);
      }

      // Services
      if (settings.servicesOffered && settings.servicesOffered.length > 0) {
        setServicesOffered(settings.servicesOffered);
      }
      if (settings.allowCustomSubscriptions !== undefined) {
        setAllowCustomSubscriptions(settings.allowCustomSubscriptions);
      }
      if (settings.accessControlType !== undefined) {
        setAccessControlType(settings.accessControlType);
      }
      // Load currency from settings
      if (settings.defaultCurrency) {
        setDefaultCurrency(settings.defaultCurrency);
      }
    }
  }, [currentGym]);

  const handleSave = async () => {
    if (!currentGym) return;

    try {
      const updates = {
        workingHours: {
          start: workingHoursStart,
          end: workingHoursEnd,
        },
        isMixed,
        femaleOnlyHours: !isMixed ? femaleOnlyHours : [],
        notificationsEnabled,
        subscriptionRenewalReminderDays: renewalReminderDays,
        paymentMethods,
        servicesOffered,
        allowCustomSubscriptions,
        accessControlType,
        defaultCurrency,
      };

      const result = await updateSettings.mutateAsync({
        id: currentGym._id,
        data: updates,
      });

      if (result.success && result.data) {
        setGym(result.data);
        toast.success(
          t("settings.gym.saveSuccess", "Gym settings updated successfully")
        );
      } else {
        toast.error(
          t("settings.gym.saveError", "Failed to update gym settings")
        );
      }
    } catch (error) {
      console.error("Failed to save gym settings:", error);
      toast.error(t("settings.gym.saveError", "Failed to update gym settings"));
    }
  };

  const tabs = [
    {
      id: "general",
      label: t("settings.gym.tabs.general", "General"),
      icon: Clock,
    },
    {
      id: "notifications",
      label: t("settings.gym.tabs.notifications", "Notifications"),
      icon: Bell,
    },
    {
      id: "services",
      label: t("settings.gym.tabs.services", "Services"),
      icon: Dumbbell,
    },
  ];

  if (!currentGym) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("settings.gym.pageTitle", "Gym Settings")}
        subtitle={t(
          "settings.gym.pageSubtitle",
          "Configure your gym-specific preferences and policies"
        )}
        icon={Settings}
        actionButton={{
          label: t("common.saveChanges", "Save Changes"),
          icon: Save,
          onClick: handleSave,
          loading: updateSettings.isPending,
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
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsTab
              notificationsEnabled={notificationsEnabled}
              setNotificationsEnabled={setNotificationsEnabled}
              renewalReminderDays={renewalReminderDays}
              setRenewalReminderDays={setRenewalReminderDays}
            />
          )}

          {activeTab === "services" && (
            <ServicesTab
              paymentMethods={paymentMethods}
              setPaymentMethods={setPaymentMethods}
              servicesOffered={servicesOffered}
              setServicesOffered={setServicesOffered}
              allowCustomSubscriptions={allowCustomSubscriptions}
              setAllowCustomSubscriptions={setAllowCustomSubscriptions}
            />
          )}
        </div>
      </div>
    </div>
  );
}
