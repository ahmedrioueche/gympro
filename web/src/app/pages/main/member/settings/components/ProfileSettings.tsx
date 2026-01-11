import type { User } from "@ahmedrioueche/gympro-client";
import { Camera, Loader2, Mail, Phone, User as UserIcon } from "lucide-react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface ProfileSettingsProps {
  user: User;
  fullName: string;
  setFullName: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  addEmailMode: boolean;
  setAddEmailMode: (value: boolean) => void;
  addPhoneMode: boolean;
  setAddPhoneMode: (value: boolean) => void;
  uploading: boolean;
  handleAvatarUpload: (file: File) => Promise<void>;
}

export default function ProfileSettings({
  user,
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
}: ProfileSettingsProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        t("settings.profile.fileTooLarge", "Image size must be less than 5MB")
      );
      return;
    }

    await handleAvatarUpload(file);
  };

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

      <div className="space-y-6 max-w-2xl">
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
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
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
                {uploading
                  ? t("common.uploading", "Uploading...")
                  : t("member.settings.profile.changeAvatar", "Change Avatar")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                {t("member.settings.profile.fullName")}
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
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
                    disabled={!!user.profile.email}
                    placeholder={t(
                      "member.settings.profile.emailPlaceholder",
                      "Enter your email"
                    )}
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
                    placeholder={t(
                      "member.settings.profile.phonePlaceholder",
                      "Enter phone number"
                    )}
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
      </div>
    </div>
  );
}
