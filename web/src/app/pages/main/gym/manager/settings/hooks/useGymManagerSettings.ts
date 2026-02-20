import type {
  Currency,
  GymService,
  GymSettings,
  TemporaryClosure,
  WeeklyTimeRange,
} from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useAddFacility,
  useRemoveFacility,
  useUpdateFacility,
  useUpdateGym,
  useUpdateGymSettings,
} from "../../../../../../../hooks/queries/useGyms";
import { useGymStore } from "../../../../../../../store/gym";

export type TabType =
  | "general"
  | "notifications"
  | "services"
  | "rules"
  | "location"
  | "closures"
  | "facilities"
  | "payments";

export function useGymManagerSettings() {
  const { t } = useTranslation();
  const { currentGym, setGym } = useGymStore();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const updateSettings = useUpdateGymSettings();
  const updateGym = useUpdateGym();
  const addFacility = useAddFacility();
  const updateFacility = useUpdateFacility();
  const removeFacility = useRemoveFacility();

  // Settings State - Initialize with proper defaults
  const [workingHoursStart, setWorkingHoursStart] = useState("06:00");
  const [workingHoursEnd, setWorkingHoursEnd] = useState("22:00");
  const [customWorkingHours, setCustomWorkingHours] = useState<
    WeeklyTimeRange[]
  >([]);
  const [useAdvancedHours, setUseAdvancedHours] = useState(false);
  const [isMixed, setIsMixed] = useState(false);
  const [femaleOnlyHours, setFemaleOnlyHours] = useState<WeeklyTimeRange[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(["cash"]);
  const [servicesOffered, setServicesOffered] = useState<GymService[]>([]);
  const [allowCustomSubscriptions, setAllowCustomSubscriptions] =
    useState(false);
  const [accessControlType, setAccessControlType] =
    useState<string>("flexible");
  const [defaultCurrency, setDefaultCurrency] = useState<Currency>("USD");
  const [rules, setRules] = useState<string[]>([]);
  const [temporaryClosures, setTemporaryClosures] = useState<
    TemporaryClosure[]
  >([]);
  const [workingDays, setWorkingDays] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6,
  ]);
  const [reminderSettings, setReminderSettings] = useState<
    GymSettings["reminderSettings"]
  >({
    preExpiry: { day3: true, day1: true, today: true },
    postExpiry: {
      day3: true,
      day7: true,
      day30: true,
      day60: true,
      day90: true,
    },
  });
  const [notifyScheduleChanges, setNotifyScheduleChanges] = useState(true);

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
        if (settings.customWorkingHours) {
          setCustomWorkingHours(settings.customWorkingHours);
        } else {
          setCustomWorkingHours([]);
        }

        if (settings.useAdvancedHours !== undefined) {
          setUseAdvancedHours(settings.useAdvancedHours);
        } else {
          setUseAdvancedHours(
            settings.customWorkingHours &&
              settings.customWorkingHours.length > 0,
          );
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

        if (settings.paymentMethods && settings.paymentMethods.length > 0) {
          setPaymentMethods(settings.paymentMethods);
        }
        if (settings.servicesOffered && settings.servicesOffered.length > 0) {
          setServicesOffered(settings.servicesOffered as GymService[]);
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
        if (settings.temporaryClosures) {
          setTemporaryClosures(settings.temporaryClosures);
        } else {
          setTemporaryClosures([]);
        }
        if (settings.workingDays && settings.workingDays.length > 0) {
          setWorkingDays(settings.workingDays);
        } else {
          setWorkingDays([0, 1, 2, 3, 4, 5, 6]);
        }
        if (settings.reminderSettings) {
          setReminderSettings(settings.reminderSettings);
        }
        if (settings.notifyScheduleChanges !== undefined) {
          setNotifyScheduleChanges(settings.notifyScheduleChanges);
        }
      }
    }
  }, [currentGym]);

  const validateSchedule = () => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // 1. Working Days Check
    if (workingDays.length === 0) {
      toast.error(
        t(
          "settings.gym.general.errors.noWorkingDays",
          "Please select at least one working day.",
        ),
      );
      return false;
    }

    if (useAdvancedHours) {
      // Check for custom slots on non-working days
      for (const slot of customWorkingHours) {
        for (const day of slot.days) {
          const dayIdx = dayNames.indexOf(day);
          if (!workingDays.includes(dayIdx)) {
            toast.error(
              t(
                "settings.gym.general.errors.slotOnNonWorkingDay",
                `Conflict: Slot detected for {{day}}, which is not marked as a working day.`,
                { day },
              ),
            );
            return false;
          }
        }
      }

      // Check for working days without slots
      for (const dayIdx of workingDays) {
        const dayName = dayNames[dayIdx];
        const hasSlot = customWorkingHours.some((slot) =>
          slot.days.includes(dayName as any),
        );
        if (!hasSlot) {
          toast.error(
            t(
              "settings.gym.general.errors.missingSlot",
              `Conflict: {{day}} is a working day but has no time slots configured.`,
              { day: dayName },
            ),
          );
          return false;
        }
      }
    }

    // 2. Female-Only Hours Check
    if (!isMixed && femaleOnlyHours.length > 0) {
      for (const fSlot of femaleOnlyHours) {
        for (const day of fSlot.days) {
          const dayIdx = dayNames.indexOf(day);

          // Must be a working day
          if (!workingDays.includes(dayIdx)) {
            toast.error(
              t(
                "settings.gym.general.errors.femaleSlotOnNonWorkingDay",
                `Conflict: Female-only slot for {{day}} is on a non-working day.`,
                { day },
              ),
            );
            return false;
          }

          if (useAdvancedHours) {
            // Must be within a custom slot for that day
            const daySlots = customWorkingHours.filter((s) =>
              s.days.includes(day),
            );
            const isContained = daySlots.some(
              (s) =>
                fSlot.range.start >= s.range.start &&
                fSlot.range.end <= s.range.end,
            );
            if (!isContained) {
              toast.error(
                t(
                  "settings.gym.general.errors.femaleSlotOutsideRange",
                  `Conflict: Female-only hours for {{day}} must be within the regular opening hours for that day.`,
                  { day },
                ),
              );
              return false;
            }
          } else {
            // Must be within standard hours
            if (
              fSlot.range.start < workingHoursStart ||
              fSlot.range.end > workingHoursEnd
            ) {
              toast.error(
                t(
                  "settings.gym.general.errors.femaleSlotOutsideStandardRange",
                  `Conflict: Female-only hours for {{day}} must be within {{start}} — {{end}}.`,
                  { day, start: workingHoursStart, end: workingHoursEnd },
                ),
              );
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!currentGym) return;
    if (!validateSchedule()) return;

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
        useAdvancedHours,
        customWorkingHours,
        isMixed,
        femaleOnlyHours: !isMixed ? femaleOnlyHours : [],
        notificationsEnabled,
        paymentMethods,
        servicesOffered,
        allowCustomSubscriptions,
        accessControlType,
        defaultCurrency,
        rules,
        temporaryClosures,
        workingDays,
        reminderSettings,
        notifyScheduleChanges,
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

  const handleUpdateClosures = async (newClosures: TemporaryClosure[]) => {
    if (!currentGym) return;
    try {
      const settingsUpdates = {
        temporaryClosures: newClosures,
      };
      const result = await updateSettings.mutateAsync({
        id: currentGym._id,
        data: settingsUpdates,
      });

      if (result.success && result.data) {
        setGym(result.data);
        setTemporaryClosures(newClosures);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update closures:", error);
      toast.error(t("common.error", "An error occurred"));
      return false;
    }
  };

  const hasSettingsChanges =
    workingHoursStart !==
      (currentGym?.settings?.workingHours?.start || "06:00") ||
    workingHoursEnd !== (currentGym?.settings?.workingHours?.end || "22:00") ||
    useAdvancedHours !== (currentGym?.settings?.useAdvancedHours ?? false) ||
    JSON.stringify(customWorkingHours) !==
      JSON.stringify(currentGym?.settings?.customWorkingHours || []) ||
    isMixed !== (currentGym?.settings?.isMixed ?? false) ||
    JSON.stringify(femaleOnlyHours) !==
      JSON.stringify(currentGym?.settings?.femaleOnlyHours || []) ||
    notificationsEnabled !==
      (currentGym?.settings?.notificationsEnabled ?? true) ||
    JSON.stringify(reminderSettings) !==
      JSON.stringify(currentGym?.settings?.reminderSettings) ||
    notifyScheduleChanges !==
      (currentGym?.settings?.notifyScheduleChanges ?? true) ||
    JSON.stringify(paymentMethods) !==
      JSON.stringify(currentGym?.settings?.paymentMethods || ["cash"]) ||
    JSON.stringify(servicesOffered) !==
      JSON.stringify(currentGym?.settings?.servicesOffered || ["gym"]) ||
    allowCustomSubscriptions !==
      (currentGym?.settings?.allowCustomSubscriptions ?? false) ||
    accessControlType !==
      (currentGym?.settings?.accessControlType || "flexible") ||
    defaultCurrency !== (currentGym?.settings?.defaultCurrency || "USD") ||
    JSON.stringify(rules) !==
      JSON.stringify(currentGym?.settings?.rules || []) ||
    JSON.stringify(temporaryClosures) !==
      JSON.stringify(currentGym?.settings?.temporaryClosures || []) ||
    JSON.stringify(workingDays) !==
      JSON.stringify(
        currentGym?.settings?.workingDays || [0, 1, 2, 3, 4, 5, 6],
      );

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
    useAdvancedHours,
    setUseAdvancedHours,
    customWorkingHours,
    setCustomWorkingHours,
    isMixed,
    setIsMixed,
    femaleOnlyHours,
    setFemaleOnlyHours,
    notificationsEnabled,
    setNotificationsEnabled,
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
    temporaryClosures,
    setTemporaryClosures,
    handleUpdateClosures,
    workingDays,
    setWorkingDays,
    reminderSettings,
    setReminderSettings,
    notifyScheduleChanges,
    setNotifyScheduleChanges,
    addRule: (rule: string) => {
      if (rule.trim()) {
        setRules((prev) => [...prev, rule.trim()]);
      }
    },
    removeRule: (index: number) => {
      setRules((prev) => prev.filter((_, i) => i !== index));
    },
    addService: (serviceName: string) => {
      const trimmed = serviceName.trim();
      if (trimmed && !servicesOffered.some((s) => s.name === trimmed)) {
        const newService: GymService = {
          _id: Math.random().toString(36).substr(2, 9),
          name: trimmed,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setServicesOffered((prev) => [...prev, newService]);
      }
    },
    removeService: (index: number) => {
      setServicesOffered((prev) => prev.filter((_, i) => i !== index));
    },
    toggleService: (serviceName: string) => {
      setServicesOffered((prev) => {
        const exists = prev.find(
          (s) => s.name === serviceName || s._id === serviceName,
        );
        if (exists) {
          return prev.filter(
            (s) => s.name !== serviceName && s._id !== serviceName,
          );
        } else {
          const newService: GymService = {
            _id: Math.random().toString(36).substr(2, 9),
            name: serviceName,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return [...prev, newService];
        }
      });
    },
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
    addPaymentMethod: (method: string) => {
      if (method.trim() && !paymentMethods.includes(method.trim())) {
        setPaymentMethods((prev) => [...prev, method.trim()]);
      }
    },
    removePaymentMethod: (index: number) => {
      setPaymentMethods((prev) => prev.filter((_, i) => i !== index));
    },
    togglePaymentMethod: (method: string) => {
      setPaymentMethods((prev) =>
        prev.includes(method)
          ? prev.filter((m) => m !== method)
          : [...prev, method],
      );
    },
    // Facility management
    facilities: currentGym?.facilities || [],
    handleAddFacility: async (data: any) => {
      if (!currentGym) return;
      const result = await addFacility.mutateAsync({
        gymId: currentGym._id,
        data,
      });
      if (result) {
        setGym(result);
        toast.success(
          t("settings.gym.facilities.addSuccess", "Facility added"),
        );
      }
      return result;
    },
    handleUpdateFacility: async (facilityId: string, data: any) => {
      if (!currentGym) return;
      const result = await updateFacility.mutateAsync({
        gymId: currentGym._id,
        facilityId,
        data,
      });
      if (result) {
        setGym(result);
        toast.success(
          t("settings.gym.facilities.updateSuccess", "Facility updated"),
        );
      }
      return result;
    },
    handleRemoveFacility: async (facilityId: string) => {
      if (!currentGym) return;
      const result = await removeFacility.mutateAsync({
        gymId: currentGym._id,
        facilityId,
      });
      if (result) {
        setGym(result);
        toast.success(
          t("settings.gym.facilities.removeSuccess", "Facility removed"),
        );
      }
      return result;
    },
    isFacilityLoading:
      addFacility.isPending ||
      updateFacility.isPending ||
      removeFacility.isPending,
  };
}
