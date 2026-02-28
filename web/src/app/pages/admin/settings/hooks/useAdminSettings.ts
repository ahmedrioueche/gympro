import {
  settingsApi,
  uploadApi,
  type AppLanguage,
  type EditUserDto,
} from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useChangePassword } from "../../../../../hooks/queries/useAuth";
import { useUpdateProfile } from "../../../../../hooks/queries/useUsers";
import { useLanguageStore } from "../../../../../store/language";
import { useUserStore } from "../../../../../store/user";

export type AdminSettingsTabType =
  | "profile"
  | "preferences"
  | "security"
  | "banners";

export function useAdminSettings() {
  const { t } = useTranslation();
  const { user, updateSettings } = useUserStore();
  const { setLanguage: setGlobalLanguage } = useLanguageStore();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [activeTab, setActiveTab] = useState<AdminSettingsTabType>("profile");

  // Profile state
  const [fullName, setFullName] = useState(user?.profile.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(
    user?.profile.phoneNumber || "",
  );
  const [email, setEmail] = useState(user?.profile.email || "");
  const [addEmailMode, setAddEmailMode] = useState(false);
  const [addPhoneMode, setAddPhoneMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Preferences (Language & Weight Unit) state
  const [language, setLanguage] = useState<AppLanguage>(
    user?.appSettings?.locale?.language || "en",
  );
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(
    user?.appSettings?.locale?.weightUnit || "kg",
  );

  // Security (Password) state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Track if there are unsaved changes
  const hasProfileChanges =
    fullName !== (user?.profile.fullName || "") ||
    phoneNumber !== (user?.profile.phoneNumber || "") ||
    email !== (user?.profile.email || "") ||
    addEmailMode ||
    addPhoneMode;

  const hasPreferenceChanges =
    language !== (user?.appSettings?.locale?.language || "en") ||
    weightUnit !== (user?.appSettings?.locale?.weightUnit || "kg");

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
        email: email || undefined,
      };

      await updateProfile.mutateAsync(updates);
      setAddEmailMode(false);
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
      const updates = {
        locale: {
          ...user?.appSettings?.locale,
          language,
          weightUnit,
        },
      };

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
    addEmailMode,
    setAddEmailMode,
    addPhoneMode,
    setAddPhoneMode,
    uploading,
    handleAvatarUpload,
    // Preferences
    language,
    setLanguage,
    weightUnit,
    setWeightUnit,
    // Security
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    // Actions
    handleSave,
    isSaving,
    hasChanges,
  };
}
