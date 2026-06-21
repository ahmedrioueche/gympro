import { usersApi, type EditUserDto } from "@ahmedrioueche/gympro-client";
import { Edit2, Mail, MapPin, Phone, Save, User, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import CustomSelect from "../../../components/ui/CustomSelect";
import InputField from "../../../components/ui/InputField";
import { useModalStore } from "../../../store/modal";
import { useModalLayer } from "../../../hooks/useModalLayer";
import { useUserStore } from "../../../store/user";
import { getMessage, showStatusToast } from "../../../utils/statusMessage";
import { usePhoneFeatures } from "../../../hooks/usePhoneFeatures";

function EditUserProfileModal() {
  const { t } = useTranslation();
  const { isPhoneEnabled } = usePhoneFeatures();
  const { closeModal } = useModalStore();
  const { isOpen, zIndex } = useModalLayer("edit_user_profile");
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

  // Verification State
  const [verificationState, setVerificationState] = useState<{
    type: "email" | "phone" | null;
    step: "idle" | "requesting" | "pending" | "verifying";
    code: string;
    targetValue: string;
  }>({
    type: null,
    step: "idle",
    code: "",
    targetValue: "",
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestVerification = async (type: "email" | "phone") => {
    const value = type === "email" ? formData.email : formData.phoneNumber;
    if (!value) {
      toast.error(
        t("profile.error.empty_contact", "Please enter a value first"),
      );
      return;
    }

    setVerificationState((prev) => ({ ...prev, type, step: "requesting" }));
    try {
      const response =
        type === "email"
          ? await usersApi.requestEmailAddition(value)
          : await usersApi.requestPhoneAddition(value);

      if (response.success) {
        toast.custom((t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {type === "email"
                      ? "Email verification sent"
                      : "SMS verification sent"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {type === "email"
                      ? `We've sent a code to ${value} via Resend.`
                      : `We've sent a code via Twilio to your phone.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ));
        setVerificationState((prev) => ({
          ...prev,
          step: "pending",
          targetValue: value,
        }));
      }
    } catch (error) {
      console.error(`Failed to request ${type} verification:`, error);
      showStatusToast(getMessage(error, t), toast);
      setVerificationState((prev) => ({ ...prev, step: "idle" }));
    }
  };

  const handleConfirmVerification = async () => {
    const { type, code, targetValue } = verificationState;
    if (!type || !code) return;

    setVerificationState((prev) => ({ ...prev, step: "verifying" }));
    try {
      const response =
        type === "email"
          ? await usersApi.verifyEmailAddition(targetValue, code)
          : await usersApi.verifyPhoneAddition(targetValue, code);

      if (response.success && response.data) {
        toast.success(
          t("profile.success.contact_verified", "Verified successfully!"),
        );
        updateProfile(response.data.profile); // Update global user store
        setVerificationState({
          type: null,
          step: "idle",
          code: "",
          targetValue: "",
        });
        // We stay in edit mode but the field will now be disabled because user.profile.email is set
      }
    } catch (error) {
      console.error(`Failed to verify ${type}:`, error);
      showStatusToast(getMessage(error, t), toast);
      setVerificationState((prev) => ({ ...prev, step: "pending" }));
    }
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

      updateProfile(response.data.profile);

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
    setVerificationState({
      type: null,
      step: "idle",
      code: "",
      targetValue: "",
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
      isOpen={isOpen} zIndex={zIndex}
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
              icon: X,
            }
          : {
              label: t("common.close", "Close"),
              onClick: closeModal,
              icon: X,
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
                "Enter your full name",
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
                "Enter your username",
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
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            {t("profile.edit.contact_info", "Contact Information")}
          </h3>

          <div className="grid grid-cols-1 gap-6">
            {/* Email Field */}
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <InputField
                    label={t("profile.edit.email", "Email")}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={
                      !!(
                        user.profile.email && user.profile.email.includes("@")
                      ) || !isEditMode
                    }
                    placeholder={t(
                      "profile.edit.email_placeholder",
                      "Enter your email",
                    )}
                    leftIcon={<Mail className="w-5 h-5" />}
                  />
                </div>
                {isEditMode &&
                  !user.profile.email &&
                  formData.email &&
                  verificationState.step === "idle" && (
                    <button
                      type="button"
                      onClick={() => handleRequestVerification("email")}
                      className="h-[44px] px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                      {t("profile.edit.get_code", "Get Code")}
                    </button>
                  )}
              </div>

              {verificationState.type === "email" &&
                (verificationState.step === "pending" ||
                  verificationState.step === "verifying") && (
                  <div className="flex items-end gap-2 bg-primary/5 p-4 rounded-xl border border-primary/10 animate-fade-in">
                    <div className="flex-1">
                      <InputField
                        label={t("profile.edit.enter_otp", "Verification Code")}
                        value={verificationState.code}
                        onChange={(e) =>
                          setVerificationState((prev) => ({
                            ...prev,
                            code: e.target.value.replace(/\D/g, "").slice(0, 6),
                          }))
                        }
                        placeholder="123456"
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmVerification}
                      disabled={
                        verificationState.code.length < 6 ||
                        verificationState.step === "verifying"
                      }
                      className="h-[44px] px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-all"
                    >
                      {verificationState.step === "verifying"
                        ? t("common.verifying", "Verifying...")
                        : t("common.confirm", "Confirm")}
                    </button>
                  </div>
                )}
            </div>

            {/* Phone Number Field */}
            {isPhoneEnabled && (
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <InputField
                    label={t("profile.edit.phone", "Phone Number")}
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={
                      !!(
                        user.profile.phoneNumber &&
                        user.profile.phoneNumber.length > 5
                      ) || !isEditMode
                    }
                    placeholder={t(
                      "profile.edit.phone_placeholder",
                      "Enter your phone number",
                    )}
                    leftIcon={<Phone className="w-5 h-5" />}
                  />
                </div>
                {isEditMode &&
                  !user.profile.phoneNumber &&
                  formData.phoneNumber &&
                  verificationState.step === "idle" && (
                    <button
                      type="button"
                      onClick={() => handleRequestVerification("phone")}
                      className="h-[44px] px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                      {t("profile.edit.get_code", "Get Code")}
                    </button>
                  )}
              </div>

              {/* Phone OTP Flow */}
              {verificationState.type === "phone" &&
                (verificationState.step === "pending" ||
                  verificationState.step === "verifying") && (
                  <div className="flex items-end gap-2 bg-primary/5 p-4 rounded-xl border border-primary/10 animate-fade-in">
                    <div className="flex-1">
                      <InputField
                        label={t("profile.edit.enter_otp", "Verification Code")}
                        value={verificationState.code}
                        onChange={(e) =>
                          setVerificationState((prev) => ({
                            ...prev,
                            code: e.target.value.replace(/\D/g, "").slice(0, 6),
                          }))
                        }
                        placeholder="123456"
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmVerification}
                      disabled={
                        verificationState.code.length < 6 ||
                        verificationState.step === "verifying"
                      }
                      className="h-[44px] px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-all"
                    >
                      {verificationState.step === "verifying"
                        ? t("common.verifying", "Verifying...")
                        : t("common.confirm", "Confirm")}
                    </button>
                  </div>
                )}
            </div>
            )}
          </div>
        </div>

        {/* Address Information Section */}
        <div className="space-y-4 pt-2">
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
                "Enter your address",
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
                  "Enter country",
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
