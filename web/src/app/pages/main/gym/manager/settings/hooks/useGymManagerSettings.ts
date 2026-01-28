import type { Currency, WeeklyTimeRange } from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useUpdateGym,
  useUpdateGymSettings,
} from "../../../../../../../hooks/queries/useGyms";
import { useGymStore } from "../../../../../../../store/gym";

export type TabType =
  | "general"
  | "notifications"
  | "services"
  | "rules"
  | "location";

export function useGymManagerSettings() {
  const { t } = useTranslation();
  const { currentGym, setGym } = useGymStore();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const updateSettings = useUpdateGymSettings();
  const updateGym = useUpdateGym();

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
  const [rules, setRules] = useState<string[]>([]);

  // Location State (gym-level fields, not settings)
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  // Load initial settings from current gym
  useEffect(() => {
    if (currentGym) {
      // Load location fields
      setAddress(currentGym.address || "");
      setCity(currentGym.city || "");
      setState(currentGym.state || "");
      setCountry(currentGym.country || "");
      setPhone(currentGym.phone || "");
      setEmail(currentGym.email || "");
      setWebsite(currentGym.website || "");

      // Load settings
      if (currentGym.settings) {
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
        if (settings.rules && settings.rules.length > 0) {
          setRules(settings.rules);
        } else {
          setRules([]);
        }
      }
    }
  }, [currentGym]);

  const handleSave = async () => {
    if (!currentGym) return;

    try {
      // Update gym-level fields (location/contact)
      const gymUpdates = {
        address,
        city,
        state,
        country,
        phone,
        email,
        website,
      };

      const gymResult = await updateGym.mutateAsync({
        id: currentGym._id,
        data: gymUpdates,
      });

      // Update settings
      const settingsUpdates = {
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
        rules,
      };

      const settingsResult = await updateSettings.mutateAsync({
        id: currentGym._id,
        data: settingsUpdates,
      });

      // Both APIs return the updated gym - use settingsResult as it's the latest
      // but gymResult already updated location fields in the database
      if (settingsResult.success && settingsResult.data) {
        // Merge the location fields from gymResult into the gym we store
        const updatedGym = {
          ...settingsResult.data,
          address: gymResult?.address ?? address,
          city: gymResult?.city ?? city,
          state: gymResult?.state ?? state,
          country: gymResult?.country ?? country,
          phone: gymResult?.phone ?? phone,
          email: gymResult?.email ?? email,
          website: gymResult?.website ?? website,
        };
        setGym(updatedGym);
        toast.success(
          t("settings.gym.saveSuccess", "Gym settings updated successfully"),
        );
      } else {
        toast.error(
          t("settings.gym.saveError", "Failed to update gym settings"),
        );
      }
    } catch (error) {
      console.error("Failed to save gym settings:", error);
      toast.error(t("settings.gym.saveError", "Failed to update gym settings"));
    }
  };

  const hasSettingsChanges =
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
    defaultCurrency !== (currentGym?.settings?.defaultCurrency || "USD") ||
    JSON.stringify(rules) !== JSON.stringify(currentGym?.settings?.rules || []);

  const hasLocationChanges =
    address !== (currentGym?.address || "") ||
    city !== (currentGym?.city || "") ||
    state !== (currentGym?.state || "") ||
    country !== (currentGym?.country || "") ||
    phone !== (currentGym?.phone || "") ||
    email !== (currentGym?.email || "") ||
    website !== (currentGym?.website || "");

  const hasChanges = hasSettingsChanges || hasLocationChanges;

  return {
    currentGym,
    activeTab,
    setActiveTab,
    isSaving: updateSettings.isPending || updateGym.isPending,
    handleSave,
    hasChanges,
    // Form State - Settings
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
    rules,
    setRules,
    addRule: (rule: string) => {
      if (rule.trim()) {
        setRules((prev) => [...prev, rule.trim()]);
      }
    },
    removeRule: (index: number) => {
      setRules((prev) => prev.filter((_, i) => i !== index));
    },
    // Form State - Location
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
  };
}
