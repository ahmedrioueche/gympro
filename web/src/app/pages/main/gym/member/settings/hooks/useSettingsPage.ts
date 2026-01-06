import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useMyMembershipInGym,
  useUpdateMembershipSettings,
} from "../../../../../../../hooks/queries/useMembership";
import { useGymStore } from "../../../../../../../store/gym";

export type TabType = "general" | "notifications" | "privacy";

export function useSettingsPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const [activeTab, setActiveTab] = useState<TabType>("general");

  const { data: membershipData, isLoading } = useMyMembershipInGym(
    currentGym?._id || ""
  );
  const updateSettingsMutation = useUpdateMembershipSettings();

  // Settings State
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [classReminders, setClassReminders] = useState(true);
  const [subscriptionRenewal, setSubscriptionRenewal] = useState(true);
  const [announcements, setAnnouncements] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [shareProgress, setShareProgress] = useState(true);

  // Load initial settings
  useEffect(() => {
    if (membershipData?.data?.membership?.settings) {
      const settings = membershipData.data.membership.settings;
      if (settings.general?.weightUnit)
        setWeightUnit(settings.general.weightUnit);
      if (settings.notifications) {
        setClassReminders(settings.notifications.classReminders ?? true);
        setSubscriptionRenewal(
          settings.notifications.subscriptionRenewal ?? true
        );
        setAnnouncements(settings.notifications.announcements ?? true);
      }
      if (settings.privacy) {
        setPublicProfile(settings.privacy.publicProfile ?? true);
        setShareProgress(settings.privacy.shareProgressWithCoaches ?? true);
      }
    }
  }, [membershipData]);

  const handleSave = async () => {
    if (!currentGym?._id) return;

    const settings = {
      general: { weightUnit },
      notifications: {
        classReminders,
        subscriptionRenewal,
        announcements,
      },
      privacy: {
        publicProfile,
        shareProgressWithCoaches: shareProgress,
      },
    };

    try {
      await updateSettingsMutation.mutateAsync({
        gymId: currentGym._id,
        settings,
      });
      toast.success(
        t("settings.member.saveSuccess", "Settings updated successfully")
      );
    } catch (error) {
      toast.error(t("settings.member.saveError", "Failed to update settings"));
    }
  };

  return {
    activeTab,
    setActiveTab,
    isLoading,
    isSaving: updateSettingsMutation.isPending,
    handleSave,
    // State
    weightUnit,
    setWeightUnit,
    classReminders,
    setClassReminders,
    subscriptionRenewal,
    setSubscriptionRenewal,
    announcements,
    setAnnouncements,
    publicProfile,
    setPublicProfile,
    shareProgress,
    setShareProgress,
    currentGym,
  };
}
