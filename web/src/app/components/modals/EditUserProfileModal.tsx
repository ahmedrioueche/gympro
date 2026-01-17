import { usersApi, type EditUserDto } from "@ahmedrioueche/gympro-client";
import { Edit2, Mail, MapPin, Phone, Save, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import CustomSelect from "../../../components/ui/CustomSelect";
import InputField from "../../../components/ui/InputField";
import { useModalStore } from "../../../store/modal";
import { useUserStore } from "../../../store/user";
import { getMessage, showStatusToast } from "../../../utils/statusMessage";

function EditUserProfileModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal } = useModalStore();
  const { user, updateProfile } = useUserStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<EditUserDto>({
    fullName: user?.profile.fullName || "",
    username: user?.profile.username || "",
    email: user?.profile.email || "",
    phoneNumber: user?.profile.phoneNumber || "",
    age: user?.profile.age || "",
    gender: user?.profile.gender || "",
    address: user?.profile.address || "",
    city: user?.profile.city || "",
    state: user?.profile.state || "",
    country: user?.profile.country || "",
  });

  const [isLoading, setIsLoading] = useState(false);

  if (currentModal !== "edit_user_profile") return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await usersApi.editUser(user._id, formData);
      const msg = getMessage(response, t);
      showStatusToast(msg, toast);

      updateProfile(formData);

      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      const msg = getMessage(error, t);
      showStatusToast(msg, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      fullName: user?.profile.fullName || "",
      username: user?.profile.username || "",
      email: user?.profile.email || "",
      phoneNumber: user?.profile.phoneNumber || "",
      age: user?.profile.age || "",
      gender: user?.profile.gender || "",
      address: user?.profile.address || "",
      city: user?.profile.city || "",
      state: user?.profile.state || "",
      country: user?.profile.country || "",
    });
    setIsEditMode(false);
  };

  const genderOptions = [
    { value: "", label: t("profile.edit.select_gender", "Select gender") },
    { value: "male", label: t("profile.edit.male", "Male") },
    { value: "female", label: t("profile.edit.female", "Female") },
    { value: "other", label: t("profile.edit.other", "Other") },
  ];

  return (
    <BaseModal
      isOpen={currentModal === "edit_user_profile"}
      onClose={closeModal}
      isEditMode={isEditMode}
      title={
        isEditMode
          ? t("profile.edit.title", "Edit Profile")
          : t("profile.view.title", "View Profile")
      }
      subtitle={
        isEditMode
          ? t("profile.edit.subtitle", "Update your personal information")
          : t("profile.view.subtitle", "Your personal information")
      }
      icon={User}
      primaryButton={
        isEditMode
          ? {
              label: t("profile.edit.save_changes", "Save Changes"),
              type: "submit",
              form: "edit-profile-form",
              loading: isLoading,
              icon: Save,
            }
          : {
              label: t("profile.edit.edit_button", "Edit Profile"),
              onClick: (e) => {
                e?.preventDefault();
                setIsEditMode(true);
              },
              icon: Edit2,
              type: "button",
            }
      }
      secondaryButton={
        isEditMode
          ? {
              label: t("common.cancel", "Cancel"),
              onClick: handleCancel,
            }
          : {
              label: t("common.close", "Close"),
              onClick: closeModal,
            }
      }
    >
      <form
        id="edit-profile-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {t("profile.edit.personal_info", "Personal Information")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <InputField
              label={t("profile.edit.full_name", "Full Name")}
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!isEditMode}
              placeholder={t(
                "profile.edit.full_name_placeholder",
                "Enter your full name"
              )}
            />

            {/* Username */}
            <InputField
              label={t("profile.edit.username", "Username")}
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!isEditMode}
              placeholder={t(
                "profile.edit.username_placeholder",
                "Enter your username"
              )}
            />

            {/* Age */}
            <InputField
              label={t("profile.edit.age", "Age")}
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              disabled={!isEditMode}
              placeholder={t("profile.edit.age_placeholder", "Enter your age")}
            />

            {/* Gender */}
            <CustomSelect
              title={t("profile.edit.gender", "Gender")}
              options={genderOptions}
              selectedOption={formData.gender || ""}
              onChange={handleGenderChange}
              disabled={!isEditMode}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            {t("profile.edit.contact_info", "Contact Information")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email - Always Disabled */}
            <InputField
              label={t("profile.edit.email", "Email")}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={true}
              placeholder={t(
                "profile.edit.email_placeholder",
                "Enter your email"
              )}
              leftIcon={<Mail className="w-5 h-5" />}
            />

            {/* Phone Number - Always Disabled */}
            <InputField
              label={t("profile.edit.phone", "Phone Number")}
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={true}
              placeholder={t(
                "profile.edit.phone_placeholder",
                "Enter your phone number"
              )}
              leftIcon={<Phone className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Address Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {t("profile.edit.address_info", "Address Information")}
          </h3>

          <div className="space-y-4">
            {/* Address */}
            <InputField
              label={t("profile.edit.address", "Address")}
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditMode}
              placeholder={t(
                "profile.edit.address_placeholder",
                "Enter your address"
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City */}
              <InputField
                label={t("profile.edit.city", "City")}
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditMode}
                placeholder={t("profile.edit.city_placeholder", "Enter city")}
              />

              {/* State */}
              <InputField
                label={t("profile.edit.state", "State")}
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                disabled={!isEditMode}
                placeholder={t("profile.edit.state_placeholder", "Enter state")}
              />

              {/* Country */}
              <InputField
                label={t("profile.edit.country", "Country")}
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={!isEditMode}
                placeholder={t(
                  "profile.edit.country_placeholder",
                  "Enter country"
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

export default EditUserProfileModal;
