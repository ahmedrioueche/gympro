import {
  settingsApi,
  type AppLanguage,
  type ViewPreference,
} from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../../../store/language";
import { useUserStore } from "../../../../../../store/user";

export type TabType = "general" | "notifications" | "locale";

export function useManagerSettings() {
  const { t } = useTranslation();
  const { user, updateSettings } = useUserStore();
  const { setLanguage: setGlobalLanguage } = useLanguageStore();

  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [viewPreference, setViewPreference] = useState<ViewPreference>("table");
  const [reminderMinutes, setReminderMinutes] = useState<number>(30);
  const [language, setLanguage] = useState<AppLanguage>("en");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("UTC");
  const [region, setRegion] = useState("");
  const [regionName, setRegionName] = useState("");

  // Load initial settings
  useEffect(() => {
    if (user?.appSettings) {
      setViewPreference(user.appSettings.viewPreference || "table");
      setReminderMinutes(
        user.appSettings.notifications?.defaultReminderMinutes ?? 30
      );
      setLanguage(user.appSettings.locale?.language || "en");
      setCurrency(user.appSettings.locale?.currency || "USD");
      setTimezone(user.appSettings.locale?.timezone || "UTC");
      setRegion(user.appSettings.locale?.region || "");
      setRegionName(user.appSettings.locale?.regionName || "");
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = {
        viewPreference,
        notifications: {
          defaultReminderMinutes: reminderMinutes,
        },
        locale: {
          language,
          currency,
          timezone,
          region,
          regionName,
        },
      };

      const res = await settingsApi.updateSettings(updates);
      if (res.success) {
        updateSettings(updates as any);
        toast.success(
          t("settings.saveSuccess", "Settings updated successfully")
        );

        // Apply language change immediately
        setGlobalLanguage(language);
      } else {
        toast.error(
          res.message || t("settings.saveError", "Failed to update settings")
        );
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error(t("settings.saveError", "Failed to update settings"));
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    viewPreference !== (user?.appSettings?.viewPreference || "table") ||
    reminderMinutes !==
      (user?.appSettings?.notifications?.defaultReminderMinutes ?? 30) ||
    language !== (user?.appSettings?.locale?.language || "en") ||
    timezone !== (user?.appSettings?.locale?.timezone || "UTC");

  return {
    user,
    activeTab,
    setActiveTab,
    isSaving,
    handleSave,
    hasChanges,
    // State & Setters
    viewPreference,
    setViewPreference,
    reminderMinutes,
    setReminderMinutes,
    language,
    setLanguage,
    currency,
    timezone,
    setTimezone,
    region,
    regionName,
  };
}
