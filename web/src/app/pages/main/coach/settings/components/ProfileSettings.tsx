import type { User } from "@ahmedrioueche/gympro-client";
import { Mail, Phone, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../components/ui/Button";
import InputField from "../../../../../../components/ui/InputField";
import AvatarUploader from "../../../../../components/AvatarUploader";

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
    <div className="space-y-8">
      {/* Avatar Section */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t("settings.coach.profile.avatar")}
        </h3>
        <AvatarUploader
          currentAvatar={user.profile.profileImageUrl}
          userName={user.profile.fullName || user.profile.username}
          uploading={uploading}
          onUpload={handleAvatarUpload}
        />
      </div>

      {/* Basic Info */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t("settings.coach.profile.basicInfo")}
        </h3>
        <div className="space-y-4">
          <InputField
            label={t("settings.coach.profile.fullName")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<UserIcon className="w-5 h-5" />}
            placeholder={t("settings.coach.profile.fullNamePlaceholder")}
          />

          {/* Email */}
          <div>
            {user.profile.email && !addEmailMode ? (
              <div className="flex items-center justify-between p-4 bg-surface-hover rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-text-secondary" />
                  <div>
                    <p className="text-sm text-text-secondary">
                      {t("settings.coach.profile.email")}
                    </p>
                    <p className="font-medium text-text-primary">
                      {user.profile.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddEmailMode(true)}
                >
                  {t("common.change")}
                </Button>
              </div>
            ) : (
              <InputField
                label={t("settings.coach.profile.email")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-5 h-5" />}
                placeholder={t("settings.coach.profile.emailPlaceholder")}
              />
            )}
          </div>

          {/* Phone */}
          <div>
            {user.profile.phoneNumber && !addPhoneMode ? (
              <div className="flex items-center justify-between p-4 bg-surface-hover rounded-xl">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-text-secondary" />
                  <div>
                    <p className="text-sm text-text-secondary">
                      {t("settings.coach.profile.phone")}
                    </p>
                    <p className="font-medium text-text-primary">
                      {user.profile.phoneNumber}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddPhoneMode(true)}
                >
                  {t("common.change")}
                </Button>
              </div>
            ) : (
              <InputField
                label={t("settings.coach.profile.phone")}
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                leftIcon={<Phone className="w-5 h-5" />}
                placeholder={t("settings.coach.profile.phonePlaceholder")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            {t("settings.coach.location.title")}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGetLocation}
            loading={gettingLocation}
          >
            {t("settings.coach.location.detect")}
          </Button>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          {t("settings.coach.location.description")}
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
    </div>
  );
}
