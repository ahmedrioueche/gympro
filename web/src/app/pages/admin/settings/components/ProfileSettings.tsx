import type { User } from "@ahmedrioueche/gympro-client";
import { Mail, Phone, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../components/ui/Button";
import InputField from "../../../../../components/ui/InputField";
import { usePhoneFeatures } from "../../../../../hooks/usePhoneFeatures";
import AvatarUploader from "../../../../components/AvatarUploader";
import SettingsTab from "../../../../components/settings/SettingsTab";

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
  const { isPhoneEnabled } = usePhoneFeatures();

  return (
    <SettingsTab
      title={t("extra.adminSettings.tabs.profile", "Profile")}
      description={t("extra.adminSettings.pageSubtitle")}
      icon={UserIcon}
    >
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("extra.adminSettings.profile.avatar", "Profile Picture")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "extra.adminSettings.profile.avatarDesc",
            "This will be displayed across the admin dashboard",
          )}
        </p>
        <AvatarUploader
          currentAvatar={user.profile.profileImageUrl}
          userName={user.profile.fullName || user.profile.username}
          uploading={uploading}
          onUpload={handleAvatarUpload}
        />
      </div>

      <div className="pt-10 border-t border-border mt-10">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("extra.adminSettings.profile.basicInfo", "Account Information")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "extra.adminSettings.profile.basicInfoDesc",
            "Update your contact details and full name",
          )}
        </p>

        <div className="space-y-4">
          <InputField
            label={t("extra.adminSettings.profile.fullName")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<UserIcon className="w-5 h-5" />}
            placeholder={t("extra.adminSettings.profile.fullNamePlaceholder")}
          />

          <div
            className={`grid grid-cols-1 gap-4 ${isPhoneEnabled ? "md:grid-cols-2" : ""}`}
          >
            <InputField
              label={t("extra.adminSettings.profile.email")}
              type="email"
              value={addEmailMode ? email : user.profile.email || email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              placeholder={t("extra.adminSettings.profile.emailPlaceholder")}
              disabled={!!user.profile.email && !addEmailMode}
            />

            {isPhoneEnabled && (
              <div>
                {user.profile.phoneNumber && !addPhoneMode ? (
                  <div className="flex items-center justify-between p-4 bg-surface-hover/50 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white shadow-sm rounded-xl border border-border/50">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                          {t("extra.adminSettings.profile.phone")}
                        </p>
                        <p className="font-semibold text-text-primary">
                          {user.profile.phoneNumber}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/5 text-primary font-bold"
                      onClick={() => setAddPhoneMode(true)}
                    >
                      {t("common.change")}
                    </Button>
                  </div>
                ) : (
                  <InputField
                    label={t("extra.adminSettings.profile.phone")}
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    leftIcon={<Phone className="w-5 h-5" />}
                    placeholder={t(
                      "extra.adminSettings.profile.phonePlaceholder",
                    )}
                    disabled={!!user.profile.phoneNumber}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SettingsTab>
  );
}
