import type { EditUserDto } from "@ahmedrioueche/gympro-client";
import { Camera, Loader2, Mail, Phone, Save, User } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useUpdateProfile } from "../../../../../../hooks/queries/useUsers";
import { useUserStore } from "../../../../../../store/user";
import { uploadToCloudinary } from "../../../../../../utils/cloudinary";

export default function ProfileSettings() {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState(user?.profile.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(
    user?.profile.phoneNumber || ""
  );
  const [email, setEmail] = useState(user?.profile.email || "");
  // Local state to handle toggling inputs for missing fields
  const [addEmailMode, setAddEmailMode] = useState(false);
  const [addPhoneMode, setAddPhoneMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updates: EditUserDto = {
        fullName,
        phoneNumber: phoneNumber || undefined,
        email: email || undefined,
      };

      await updateProfile.mutateAsync(updates);
      toast.success(
        t("settings.member.success", "Profile updated successfully")
      );
    } catch (error) {
      toast.error(t("settings.member.error", "Failed to update profile"));
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          {t("member.settings.profile.title")}
        </h3>
        <p className="text-sm text-text-secondary">
          {t("member.settings.profile.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                <div className="w-full h-full rounded-full bg-surface border-2 border-surface overflow-hidden flex items-center justify-center relative">
                  {user.profile.profileImageUrl ? (
                    <img
                      src={user.profile.profileImageUrl}
                      alt={user.profile.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {(user.profile.fullName || user.profile.username || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                {uploading ? "Uploading..." : "Change Avatar"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                {t("member.settings.profile.fullName")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-text-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Email Section */}
            {(user.profile.email || addEmailMode) && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  {t("member.settings.profile.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!!user.profile.email} // Disable if it exists (assuming email change requires different flow)
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-text-primary focus:ring-1 focus:ring-primary focus:outline-none ${
                      user.profile.email
                        ? "bg-background/50 cursor-not-allowed text-text-secondary"
                        : ""
                    }`}
                  />
                </div>
              </div>
            )}

            {!user.profile.email && !addEmailMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  {t("member.settings.profile.email")}
                </label>
                <button
                  type="button"
                  onClick={() => setAddEmailMode(true)}
                  className="w-full pl-4 pr-4 py-2 text-left bg-surface border border-dashed border-border rounded-xl text-text-secondary hover:text-primary hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>
                    + {t("member.settings.profile.addEmail", "Add Email")}
                  </span>
                </button>
              </div>
            )}

            {/* Phone Section */}
            {(user.profile.phoneNumber || addPhoneMode) && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  {t("member.settings.profile.phone")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={!!user.profile.phoneNumber}
                    placeholder="Enter phone number"
                    className={`w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-text-primary focus:ring-1 focus:ring-primary focus:outline-none ${
                      user.profile.phoneNumber
                        ? "bg-background/50 cursor-not-allowed text-text-secondary"
                        : ""
                    }`}
                  />
                </div>
              </div>
            )}

            {!user.profile.phoneNumber && !addPhoneMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  {t("member.settings.profile.phone")}
                </label>
                <button
                  type="button"
                  onClick={() => setAddPhoneMode(true)}
                  className="w-full pl-4 pr-4 py-2 text-left bg-surface border border-dashed border-border rounded-xl text-text-secondary hover:text-primary hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>
                    +{" "}
                    {t("member.settings.profile.addPhone", "Add Phone Number")}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {updateProfile.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {updateProfile.isPending
              ? "Saving..."
              : t("member.settings.profile.save")}
          </button>
        </div>
      </form>
    </div>
  );
}
