import type { User } from "@ahmedrioueche/gympro-client";
import { Mail, Phone, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import AvatarUploader from "../../../../../components/AvatarUploader";

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
          <AvatarUploader
            currentAvatar={user.profile.profileImageUrl}
            userName={user.profile.fullName || user.profile.username}
            uploading={uploading}
            onUpload={handleAvatarUpload}
          />
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
