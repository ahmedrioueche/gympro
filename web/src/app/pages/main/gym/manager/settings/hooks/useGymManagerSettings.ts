import type { Currency, WeeklyTimeRange } from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useUpdateGymSettings } from "../../../../../../../hooks/queries/useGyms";
import { useGymStore } from "../../../../../../../store/gym";

export type TabType = "general" | "notifications" | "services";

export function useGymManagerSettings() {
  const { t } = useTranslation();
  const { currentGym, setGym } = useGymStore();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const updateSettings = useUpdateGymSettings();

  // Settings State - Initialize with proper defaults
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

      if (settings.workingHours?.start) {
        setWorkingHoursStart(settings.workingHours.start);
      }
      if (settings.workingHours?.end) {
        setWorkingHoursEnd(settings.workingHours.end);
      }

      if (settings.isMixed !== undefined) {
        setIsMixed(settings.isMixed);
      }

      if (settings.femaleOnlyHours && settings.femaleOnlyHours.length > 0) {
        setFemaleOnlyHours(settings.femaleOnlyHours);
      } else if (settings.femaleOnlyHours) {
        setFemaleOnlyHours([]);
      }

      if (settings.notificationsEnabled !== undefined) {
        setNotificationsEnabled(settings.notificationsEnabled);
      }
      if (settings.subscriptionRenewalReminderDays !== undefined) {
        setRenewalReminderDays(settings.subscriptionRenewalReminderDays);
      }

      if (settings.paymentMethods && settings.paymentMethods.length > 0) {
        setPaymentMethods(settings.paymentMethods);
      }
      if (settings.servicesOffered && settings.servicesOffered.length > 0) {
        setServicesOffered(settings.servicesOffered);
      }
      if (settings.allowCustomSubscriptions !== undefined) {
        setAllowCustomSubscriptions(settings.allowCustomSubscriptions);
      }
      if (settings.accessControlType !== undefined) {
        setAccessControlType(settings.accessControlType);
      }
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

  const hasChanges =
    workingHoursStart !==
      (currentGym?.settings?.workingHours?.start || "06:00") ||
    workingHoursEnd !== (currentGym?.settings?.workingHours?.end || "22:00") ||
    isMixed !== (currentGym?.settings?.isMixed ?? false) ||
    JSON.stringify(femaleOnlyHours) !==
      JSON.stringify(currentGym?.settings?.femaleOnlyHours || []) ||
    notificationsEnabled !==
      (currentGym?.settings?.notificationsEnabled ?? true) ||
    renewalReminderDays !==
      (currentGym?.settings?.subscriptionRenewalReminderDays ?? 7) ||
    JSON.stringify(paymentMethods) !==
      JSON.stringify(currentGym?.settings?.paymentMethods || ["cash"]) ||
    JSON.stringify(servicesOffered) !==
      JSON.stringify(currentGym?.settings?.servicesOffered || ["gym"]) ||
    allowCustomSubscriptions !==
      (currentGym?.settings?.allowCustomSubscriptions ?? false) ||
    accessControlType !==
      (currentGym?.settings?.accessControlType || "flexible") ||
    defaultCurrency !== (currentGym?.settings?.defaultCurrency || "USD");

  return {
    currentGym,
    activeTab,
    setActiveTab,
    isSaving: updateSettings.isPending,
    handleSave,
    hasChanges,
    // Form State
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
    renewalReminderDays,
    setRenewalReminderDays,
    paymentMethods,
    setPaymentMethods,
    servicesOffered,
    setServicesOffered,
    allowCustomSubscriptions,
    setAllowCustomSubscriptions,
    accessControlType,
    setAccessControlType,
    defaultCurrency,
    setDefaultCurrency,
  };
}
