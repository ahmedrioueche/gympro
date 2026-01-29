import { authApi, type EditUserDto } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useUpdateProfile } from "../../../../../../hooks/queries/useUsers";
import { useLanguageStore } from "../../../../../../store/language";
import { useUserStore } from "../../../../../../store/user";
import { uploadToCloudinary } from "../../../../../../utils/cloudinary";

export type CoachSettingsTabType =
  | "profile"
  | "coaching"
  | "preferences"
  | "security";

export function useCoachSettings() {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const updateProfile = useUpdateProfile();
  const { language, setLanguage } = useLanguageStore();

  const [activeTab, setActiveTab] = useState<CoachSettingsTabType>("profile");

  // Profile state
  const [fullName, setFullName] = useState(user?.profile.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(
    user?.profile.phoneNumber || "",
  );
  const [email, setEmail] = useState(user?.profile.email || "");
  const [city, setCity] = useState(user?.profile.city || "");
  const [state, setState] = useState(user?.profile.state || "");
  const [country, setCountry] = useState(user?.profile.country || "");
  const [addEmailMode, setAddEmailMode] = useState(false);
  const [addPhoneMode, setAddPhoneMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Coaching info state
  const coachingInfo =
    user?.role === "coach" ? (user as any).coachingInfo : null;
  const [bio, setBio] = useState(coachingInfo?.bio || "");
  const [specializations, setSpecializations] = useState<string[]>(
    coachingInfo?.specializations || [],
  );
  const [yearsOfExperience, setYearsOfExperience] = useState(
    coachingInfo?.yearsOfExperience?.toString() || "",
  );

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Track if there are unsaved changes
  const hasProfileChanges =
    fullName !== (user?.profile.fullName || "") ||
    phoneNumber !== (user?.profile.phoneNumber || "") ||
    email !== (user?.profile.email || "") ||
    city !== (user?.profile.city || "") ||
    state !== (user?.profile.state || "") ||
    country !== (user?.profile.country || "") ||
    addEmailMode ||
    addPhoneMode;

  const hasCoachingChanges =
    bio !== (coachingInfo?.bio || "") ||
    JSON.stringify(specializations) !==
      JSON.stringify(coachingInfo?.specializations || []) ||
    yearsOfExperience !== (coachingInfo?.yearsOfExperience?.toString() || "");

  const hasSecurityChanges =
    currentPassword.length > 0 ||
    newPassword.length > 0 ||
    confirmPassword.length > 0;

  const hasChanges =
    activeTab === "profile"
      ? hasProfileChanges
      : activeTab === "coaching"
        ? hasCoachingChanges
        : activeTab === "security"
          ? hasSecurityChanges
          : false;

  const handleAvatarUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        t("settings.profile.fileTooLarge", "Image size must be less than 5MB"),
      );
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file);
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

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      toast.error(
        t(
          "settings.coach.location.notSupported",
          "Geolocation is not supported",
        ),
      );
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding API (example with OpenStreetMap Nominatim)
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();

          if (data.address) {
            setCity(
              data.address.city ||
                data.address.town ||
                data.address.village ||
                "",
            );
            setState(data.address.state || "");
            setCountry(data.address.country || "");
            toast.success(
              t(
                "settings.coach.location.success",
                "Location detected successfully",
              ),
            );
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          toast.error(
            t("settings.coach.location.error", "Failed to detect location"),
          );
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error(
          t("settings.coach.location.denied", "Location access denied"),
        );
        setGettingLocation(false);
      },
    );
  };

  const handleSaveProfile = async () => {
    try {
      const updates: EditUserDto = {
        fullName,
        phoneNumber: phoneNumber || undefined,
        email: email || undefined,
        city: city || undefined,
        state: state || undefined,
        country: country || undefined,
      };

      await updateProfile.mutateAsync(updates);
      setAddEmailMode(false);
      setAddPhoneMode(false);
      toast.success(
        t("settings.coach.profile.success", "Profile updated successfully"),
      );
    } catch (error) {
      toast.error(
        t("settings.coach.profile.error", "Failed to update profile"),
      );
    }
  };

  const handleSaveCoaching = async () => {
    try {
      const updates: any = {
        coachingInfo: {
          bio,
          specializations,
          yearsOfExperience: yearsOfExperience
            ? parseInt(yearsOfExperience)
            : undefined,
        },
      };

      await updateProfile.mutateAsync(updates);
      toast.success(
        t(
          "settings.coach.coaching.success",
          "Coaching settings updated successfully",
        ),
      );
    } catch (error) {
      toast.error(
        t(
          "settings.coach.coaching.error",
          "Failed to update coaching settings",
        ),
      );
    }
  };

  const handleSaveSecurity = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(
        t("settings.security.passwordMismatch", "Passwords do not match"),
      );
      return;
    }

    try {
      const res = await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      if (res.success) {
        toast.success(
          t("settings.security.success", "Password updated successfully"),
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(
          res.message ||
            t("settings.security.error", "Failed to update password"),
        );
      }
    } catch (error: any) {
      toast.error(
        error.message ||
          t("settings.security.error", "Failed to update password"),
      );
    }
  };

  const handleSavePreferences = async () => {
    // Language is usually saved instantly via useLanguageStore.
    // If we need to persist it to user profile settings?
    // It's already done in App.tsx via useEffect? Or we should call updateProfile?
    // Let's assume setLanguage updates the store, and we might want to sync:
    /*
    await updateProfile.mutateAsync({
      appSettings: { ...user?.appSettings, locale: { language } }
    });
    */
    // For now, no-op or explicit sync:
    toast.success(t("settings.preferences.success", "Preferences saved"));
  };

  const handleSave = async () => {
    if (activeTab === "profile") {
      await handleSaveProfile();
    } else if (activeTab === "coaching") {
      await handleSaveCoaching();
    } else if (activeTab === "security") {
      await handleSaveSecurity();
    } else if (activeTab === "preferences") {
      await handleSavePreferences();
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
    addEmailMode,
    setAddEmailMode,
    addPhoneMode,
    setAddPhoneMode,
    uploading,
    handleAvatarUpload,
    gettingLocation,
    handleGetLocation,
    // Coaching
    bio,
    setBio,
    specializations,
    setSpecializations,
    yearsOfExperience,
    setYearsOfExperience,
    // Save
    handleSave,
    isSaving: updateProfile.isPending,
    hasChanges,
    // Security
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    // Preferences
    language,
    setLanguage,
  };
}
