import type { EditUserDto } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useUpdateProfile } from "../../../../../../hooks/queries/useUsers";
import { useUserStore } from "../../../../../../store/user";
import { uploadToCloudinary } from "../../../../../../utils/cloudinary";

export type MemberSettingsTabType = "profile" | "preferences" | "security";

export function useMemberSettings() {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const updateProfile = useUpdateProfile();

  const [activeTab, setActiveTab] = useState<MemberSettingsTabType>("profile");

  // Profile state
  const [fullName, setFullName] = useState(user?.profile.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(
    user?.profile.phoneNumber || ""
  );
  const [email, setEmail] = useState(user?.profile.email || "");
  const [addEmailMode, setAddEmailMode] = useState(false);
  const [addPhoneMode, setAddPhoneMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Track if there are unsaved changes
  const hasChanges =
    fullName !== (user?.profile.fullName || "") ||
    phoneNumber !== (user?.profile.phoneNumber || "") ||
    email !== (user?.profile.email || "") ||
    addEmailMode ||
    addPhoneMode;

  const handleAvatarUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        t("settings.profile.fileTooLarge", "Image size must be less than 5MB")
      );
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      await updateProfile.mutateAsync({ profileImageUrl: imageUrl });
      toast.success(
        t("settings.profile.avatarSuccess", "Avatar updated successfully")
      );
    } catch (error: any) {
      console.error("Avatar upload failed:", error);
      toast.error(
        error.message ||
          t("settings.profile.avatarError", "Failed to update avatar")
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (activeTab !== "profile") return;

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
        t("settings.member.success", "Profile updated successfully")
      );
    } catch (error) {
      toast.error(t("settings.member.error", "Failed to update profile"));
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
    // Save
    handleSave,
    isSaving: updateProfile.isPending,
    hasChanges,
  };
}
