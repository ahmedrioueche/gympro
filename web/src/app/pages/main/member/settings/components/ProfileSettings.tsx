import type { User } from "@ahmedrioueche/gympro-client";
import {
  Globe,
  Mail,
  MapPin,
  Phone,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../components/ui/Button";
import InputField from "../../../../../../components/ui/InputField";
import { useModalStore } from "../../../../../../store/modal";
import AvatarUploader from "../../../../../components/AvatarUploader";
import SettingsTab from "../../../../../components/settings/SettingsTab";

interface ProfileSettingsProps {
  user: User;
  fullName: string;
  setFullName: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  email: string;
  city: string;
  setCity: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
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
}: ProfileSettingsProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  return (
    <SettingsTab
      title={t("member.settings.profile.title", "Profile Settings")}
      description={t(
        "member.settings.profile.subtitle",
        "Manage your personal information and public identity",
      )}
      icon={UserIcon}
    >
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("member.settings.profile.avatar", "Profile Picture")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "member.settings.profile.avatarDesc",
            "This will be visible to your coaches and gym friends",
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
          {t("member.settings.profile.basicInfo", "Account Information")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "member.settings.profile.basicInfoDesc",
            "Keep your contact info up to date",
          )}
        </p>

        <div className="space-y-4">
          <InputField
            label={t("member.settings.profile.fullName")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<UserIcon className="w-5 h-5" />}
            placeholder={t("member.settings.profile.fullNamePlaceholder")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Section */}
            <div>
              <InputField
                label={t("member.settings.profile.email")}
                type="email"
                value={email}
                onChange={() => {}}
                leftIcon={<Mail className="w-5 h-5" />}
                placeholder={t("member.settings.profile.emailPlaceholder")}
                disabled={true}
              />
            </div>

            {/* Phone Section */}
            <div>
              {user.profile.phoneNumber && !addPhoneMode ? (
                <div className="flex items-center justify-between p-4 bg-surface-hover/50 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white shadow-sm rounded-xl border border-border/50">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                        {t("member.settings.profile.phone")}
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
                  label={t("member.settings.profile.phone")}
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  leftIcon={<Phone className="w-5 h-5" />}
                  placeholder={t("member.settings.profile.phonePlaceholder")}
                  disabled={!!user.profile.phoneNumber}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="pt-10 border-t border-border mt-10">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("member.settings.profile.location", "Location")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "member.settings.profile.locationDesc",
            "Your location helps us find nearby coaches and gyms",
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label={t("member.settings.profile.city", "City")}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            leftIcon={<MapPin className="w-5 h-5" />}
            placeholder={t(
              "member.settings.profile.cityPlaceholder",
              "Enter your city",
            )}
          />
          <InputField
            label={t("member.settings.profile.state", "State / Province")}
            value={state}
            onChange={(e) => setState(e.target.value)}
            leftIcon={<Globe className="w-5 h-5" />}
            placeholder={t(
              "member.settings.profile.statePlaceholder",
              "Enter your state",
            )}
          />
          <InputField
            label={t("member.settings.profile.country", "Country")}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            leftIcon={<Globe className="w-5 h-5" />}
            placeholder={t(
              "member.settings.profile.countryPlaceholder",
              "Enter your country",
            )}
          />
        </div>
      </div>

      {!user.dashboardAccess?.includes("coach") &&
        user.coachVerification?.status !== "pending" && (
          <div className="pt-10 border-t border-border mt-10">
            <div className="p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-primary">
                    {t("member.settings.profile.coachAccess", "Coach Access")}
                  </h4>
                  <p className="text-sm text-text-secondary mt-1 max-w-md">
                    {t(
                      "member.settings.profile.coachAccessDesc",
                      "Are you a fitness professional? Request access to the coach dashboard to start managing clients.",
                    )}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => openModal("request_coach_access")}
                className="font-bold px-8 shadow-lg shadow-primary/20"
              >
                {t("member.settings.profile.becomeCoach")}
              </Button>
            </div>
          </div>
        )}
    </SettingsTab>
  );
}
