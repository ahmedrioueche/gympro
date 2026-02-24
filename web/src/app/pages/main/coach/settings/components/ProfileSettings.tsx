import type { User } from "@ahmedrioueche/gympro-client";
import { Mail, Phone, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../components/ui/Button";
import InputField from "../../../../../../components/ui/InputField";
import AvatarUploader from "../../../../../components/AvatarUploader";
import SettingsTab from "../../../../../components/settings/SettingsTab";

interface ProfileSettingsProps {
  user: User;
  fullName: string;
  setFullName: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  addEmailMode: boolean;
  setAddEmailMode: (value: boolean) => void;
  addPhoneMode: boolean;
  setAddPhoneMode: (value: boolean) => void;
  uploading: boolean;
  handleAvatarUpload: (file: File) => Promise<void>;
  gettingLocation: boolean;
  handleGetLocation: () => void;
}

export default function ProfileSettings({
  user,
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
}: ProfileSettingsProps) {
  const { t } = useTranslation();

  return (
    <SettingsTab
      title={t("coach.settings.tabs.profile")}
      description={t("coach.settings.pageSubtitle")}
      icon={UserIcon}
    >
      {/* Avatar Section */}
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("settings.coach.profile.avatar", "Profile Picture")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "settings.coach.profile.avatarDesc",
            "This will be displayed on your public coach profile",
          )}
        </p>
        <AvatarUploader
          currentAvatar={user.profile.profileImageUrl}
          userName={user.profile.fullName || user.profile.username}
          uploading={uploading}
          onUpload={handleAvatarUpload}
        />
      </div>

      {/* Basic Info */}
      <div className="pt-10 border-t border-border mt-10">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("settings.coach.profile.basicInfo", "Personal Information")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "settings.coach.profile.basicInfoDesc",
            "Update your contact details and full name",
          )}
        </p>

        <div className="space-y-4">
          <InputField
            label={t("settings.coach.profile.fullName")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<UserIcon className="w-5 h-5" />}
            placeholder={t("settings.coach.profile.fullNamePlaceholder")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <InputField
              label={t("settings.coach.profile.email")}
              type="email"
              value={addEmailMode ? email : user.profile.email || email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              placeholder={t("settings.coach.profile.emailPlaceholder")}
              disabled={!!user.profile.email && !addEmailMode}
            />

            {/* Phone */}
            <InputField
              label={t("settings.coach.profile.phone")}
              type="tel"
              value={
                addPhoneMode
                  ? phoneNumber
                  : user.profile.phoneNumber || phoneNumber
              }
              onChange={(e) => setPhoneNumber(e.target.value)}
              leftIcon={<Phone className="w-5 h-5" />}
              placeholder={t("settings.coach.profile.phonePlaceholder")}
              disabled={!!user.profile.phoneNumber && !addPhoneMode}
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="pt-10 border-t border-border mt-10">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider opacity-70">
            {t("settings.coach.location.title", "Local Information")}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/5 text-primary font-bold"
            onClick={handleGetLocation}
            loading={gettingLocation}
          >
            {t("settings.coach.location.detect")}
          </Button>
        </div>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "settings.coach.location.description",
            "This helps clients find you in their area",
          )}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label={t("settings.coach.location.city")}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t("settings.coach.location.cityPlaceholder")}
          />
          <InputField
            label={t("settings.coach.location.state")}
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder={t("settings.coach.location.statePlaceholder")}
          />
          <InputField
            label={t("settings.coach.location.country")}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder={t("settings.coach.location.countryPlaceholder")}
          />
        </div>
      </div>
    </SettingsTab>
  );
}
