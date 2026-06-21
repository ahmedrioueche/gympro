import {
  settingsApi,
  uploadApi,
  usersApi,
  type AppLanguage,
  type EditUserDto,
  type TimerSettings,
} from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useChangePassword } from "../../../../../../hooks/queries/useAuth";
import { useUpdateProfile } from "../../../../../../hooks/queries/useUsers";
import { useLanguageStore } from "../../../../../../store/language";
import { useUserStore } from "../../../../../../store/user";
import {
  getMessage,
  showStatusToast,
} from "../../../../../../utils/statusMessage";
import {
  getShowActocoreWidget,
  withActocoreWidgetSetting,
} from "../../../../../../utils/actocoreSettings";

export type MemberSettingsTabType =
  | "profile"
  | "preferences"
  | "security"
  | "training";

export function useMemberSettings() {
  const { t } = useTranslation();
  const { user, updateSettings } = useUserStore();
  const { setLanguage: setGlobalLanguage } = useLanguageStore();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [activeTab, setActiveTab] = useState<MemberSettingsTabType>("profile");

  // Profile state
  const [fullName, setFullName] = useState(user?.profile.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(
    user?.profile.phoneNumber || "",
  );
  const [email, setEmail] = useState(user?.profile.email || "");
  const [city, setCity] = useState(user?.profile.city || "");
  const [state, setState] = useState(user?.profile.state || "");
  const [country, setCountry] = useState(user?.profile.country || "");
  const [addPhoneMode, setAddPhoneMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Preferences (Language & Weight Unit) state
  const [language, setLanguage] = useState<AppLanguage>(
    user?.appSettings?.locale?.language || "en",
  );
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(
    user?.appSettings?.locale?.weightUnit || "kg",
  );
  const [showActocoreWidget, setShowActocoreWidget] = useState(
    getShowActocoreWidget(user?.appSettings),
  );

  // Training (Timer) state
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(
    user?.appSettings?.timer || {
      defaultRestTime: 90,
      sound: "beep",
      alarmDuration: 3,
    },
  );

  // Security (Password) state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Verification State
  const [verificationState, setVerificationState] = useState<{
    type: "email" | "phone" | null;
    step: "idle" | "requesting" | "pending" | "verifying";
    code: string;
    targetValue: string;
  }>({
    type: null,
    step: "idle",
    code: "",
    targetValue: "",
  });

  const handleRequestVerification = async (type: "email" | "phone") => {
    const value = type === "email" ? email : phoneNumber;
    if (!value) {
      toast.error(
        t("profile.error.empty_contact", "Please enter a value first"),
      );
      return;
    }

    setVerificationState((prev) => ({ ...prev, type, step: "requesting" }));
    try {
      const response =
        type === "email"
          ? await usersApi.requestEmailAddition(value)
          : await usersApi.requestPhoneAddition(value);

      if (response.success) {
        toast.success(
          type === "email"
            ? t(
                "profile.success.email_sent",
                "Verification email sent via Resend",
              )
            : t("profile.success.sms_sent", "Verification SMS sent via Twilio"),
        );
        setVerificationState((prev) => ({
          ...prev,
          step: "pending",
          targetValue: value,
        }));
      }
    } catch (error) {
      console.error(`Failed to request ${type} verification:`, error);
      showStatusToast(getMessage(error, t), toast);
      setVerificationState((prev) => ({ ...prev, step: "idle" }));
    }
  };

  const handleConfirmVerification = async () => {
    const { type, code, targetValue } = verificationState;
    if (!type || !code) return;

    setVerificationState((prev) => ({ ...prev, step: "verifying" }));
    try {
      const response =
        type === "email"
          ? await usersApi.verifyEmailAddition(targetValue, code)
          : await usersApi.verifyPhoneAddition(targetValue, code);

      if (response.success && response.data) {
        toast.success(
          t("profile.success.contact_verified", "Verified successfully!"),
        );
        // Store is updated automatically by query invalidation or manual update if we return profile
        // Actually updateProfile in useUserStore updates the local state
        // and useUpdateProfile (react-query) invalidates.
        // Let's manually sync if needed, but usersApi.verifyEmailAddition returns the full User object.
        // We can't call useUserStore's updateProfile directly easily if we don't return it?
        // Wait, useMemberSettings has updateProfile from useUpdateProfile (which is a mutation).
        // I'll use the userStore's updateProfile to update the store immediately.
        const store = useUserStore.getState();
        store.updateProfile(response.data.profile);

        setVerificationState({
          type: null,
          step: "idle",
          code: "",
          targetValue: "",
        });
      }
    } catch (error) {
      console.error(`Failed to verify ${type}:`, error);
      showStatusToast(getMessage(error, t), toast);
      setVerificationState((prev) => ({ ...prev, step: "pending" }));
    }
  };

  // Track if there are unsaved changes
  const hasProfileChanges =
    fullName !== (user?.profile.fullName || "") ||
    phoneNumber !== (user?.profile.phoneNumber || "") ||
    city !== (user?.profile.city || "") ||
    state !== (user?.profile.state || "") ||
    country !== (user?.profile.country || "") ||
    addPhoneMode;

  const hasPreferenceChanges =
    language !== (user?.appSettings?.locale?.language || "en") ||
    weightUnit !== (user?.appSettings?.locale?.weightUnit || "kg") ||
    showActocoreWidget !== getShowActocoreWidget(user?.appSettings);

  const hasTrainingChanges =
    JSON.stringify(timerSettings) !==
    JSON.stringify(
      user?.appSettings?.timer || {
        defaultRestTime: 90,
        sound: "beep",
        alarmDuration: 3,
      },
    );

  const hasSecurityChanges =
    currentPassword.length > 0 ||
    newPassword.length > 0 ||
    confirmPassword.length > 0;

  let hasChanges = false;
  switch (activeTab) {
    case "profile":
      hasChanges = hasProfileChanges;
      break;
    case "preferences":
      hasChanges = hasPreferenceChanges;
      break;
    case "training":
      hasChanges = hasTrainingChanges;
      break;
    case "security":
      hasChanges = hasSecurityChanges;
      break;
  }

  const isSaving = updateProfile.isPending || changePassword.isPending;

  const handleAvatarUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        t("settings.profile.fileTooLarge", "Image size must be less than 5MB"),
      );
      return;
    }

    try {
      setUploading(true);
      const response = await uploadApi.uploadFile(file, "image");

      if (!response.success || !response.data) {
        throw new Error(response.message || "Upload failed");
      }

      const imageUrl = response.data.url;
      await updateProfile.mutateAsync({ profileImageUrl: imageUrl });
      toast.success(
        t("settings.profile.avatarSuccess", "Avatar updated successfully"),
      );
    } catch (error: any) {
      console.error("Avatar upload failed:", error);
      toast.error(
        error.message ||
          t("settings.profile.avatarError", "Failed to update avatar"),
      );
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const updates: EditUserDto = {
        fullName,
        phoneNumber: phoneNumber || undefined,
        city: city || undefined,
        state: state || undefined,
        country: country || undefined,
      };

      await updateProfile.mutateAsync(updates);
      setAddPhoneMode(false);
      toast.success(
        t("settings.member.success", "Profile updated successfully"),
      );
    } catch (error) {
      toast.error(t("settings.member.error", "Failed to update profile"));
    }
  };

  const savePreferences = async () => {
    try {
      const updates = withActocoreWidgetSetting(
        {
          ...user?.appSettings,
          locale: {
            ...user?.appSettings?.locale,
            language,
            weightUnit,
          },
        },
        showActocoreWidget,
      );

      const res = await settingsApi.updateSettings(updates);
      if (res.success) {
        updateSettings(updates as any);
        setGlobalLanguage(language);
        toast.success(
          t("settings.saveSuccess", "Settings updated successfully"),
        );
      } else {
        toast.error(
          res.message || t("settings.saveError", "Failed to update settings"),
        );
      }
    } catch (error) {
      console.error("Failed to save language setting:", error);
      toast.error(t("settings.saveError", "Failed to update settings"));
    }
  };

  const saveTraining = async () => {
    try {
      const updates = {
        timer: timerSettings,
      };

      const res = await settingsApi.updateSettings(updates);
      if (res.success) {
        updateSettings(updates as any);
        toast.success(
          t("settings.saveSuccess", "Settings updated successfully"),
        );
      } else {
        toast.error(t("settings.saveError", "Failed to update settings"));
      }
    } catch (e) {
      console.error(e);
      toast.error(t("settings.saveError", "Failed to update settings"));
    }
  };

  const saveSecurity = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(
        t("settings.security.passwordMismatch", "Passwords do not match"),
      );
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword,
      });
      toast.success(
        t("settings.security.success", "Password updated successfully"),
      );
      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(
        error.message ||
          t("settings.security.error", "Failed to update password"),
      );
    }
  };

  const handleSave = async () => {
    switch (activeTab) {
      case "profile":
        await saveProfile();
        break;
      case "preferences":
        await savePreferences();
        break;
      case "training":
        await saveTraining();
        break;
      case "security":
        await saveSecurity();
        break;
    }
  };

  return {
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
    addPhoneMode,
    setAddPhoneMode,
    uploading,
    handleAvatarUpload,
    // Preferences
    language,
    setLanguage,
    weightUnit,
    setWeightUnit,
    showActocoreWidget,
    setShowActocoreWidget,
    // Training
    timerSettings,
    setTimerSettings,
    // Security
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    // Verification
    verificationState,
    handleRequestVerification,
    handleConfirmVerification,
    setVerificationState,
    // Actions
    handleSave,
    isSaving,
    hasChanges,
  };
}
