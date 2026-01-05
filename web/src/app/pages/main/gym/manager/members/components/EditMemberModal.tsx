import { membersApi } from "@ahmedrioueche/gympro-client";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import { useGymStore } from "../../../../../../../store/gym";
import type { MemberDisplay } from "./types";

interface EditMemberModalProps {
  member: MemberDisplay;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface EditFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  age: string;
  subscriptionTypeId: string;
}

interface FormErrors {
  [key: string]: string;
}

export function EditMemberModal({
  member,
  isOpen,
  onClose,
  onSave,
}: EditMemberModalProps) {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<EditFormData>({
    fullName: member.name || "",
    email: member.email || "",
    phoneNumber: member.phone || "",
    gender: "",
    age: "",
    subscriptionTypeId: member.subscriptionType || "",
  });

  if (!isOpen) return null;

  const genderOptions = [
    { value: "", label: t("createMember.form.gender.placeholder") },
    { value: "male", label: t("createMember.form.gender.male") },
    { value: "female", label: t("createMember.form.gender.female") },
  ];

  const subscriptionOptions = [
    { value: "", label: t("createMember.form.subscription.placeholder") },
    { value: "regular", label: t("createMember.form.subscription.regular") },
    { value: "coached", label: t("createMember.form.subscription.coached") },
    { value: "yoga", label: t("createMember.form.subscription.yoga") },
    { value: "crossfit", label: t("createMember.form.subscription.crossfit") },
  ];

  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("createMember.validation.nameRequired");
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = t("createMember.validation.emailInvalid");
    }

    if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = t("createMember.validation.phoneInvalid");
    }

    if (
      formData.age &&
      (isNaN(Number(formData.age)) || Number(formData.age) < 1)
    ) {
      newErrors.age = t("createMember.validation.ageInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !currentGym?._id) return;

    setIsSaving(true);
    try {
      // Find the membership ID for this member from the original member data
      // This requires the membershipId from the member object
      const membershipId = (member as any).membershipId;

      if (!membershipId) {
        throw new Error(
          t("members.edit.errors.membershipNotFound", "Membership ID not found")
        );
      }

      await membersApi.updateMember(currentGym._id, membershipId, {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        age: formData.age,
        subscriptionTypeId: formData.subscriptionTypeId,
      });

      toast.success(t("members.edit.success", "Member updated successfully"));
      onClose();
      onSave();
    } catch (error: any) {
      toast.error(
        error?.message || t("members.edit.error", "Failed to update member")
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
          <h2 className="text-xl font-bold text-text-primary">
            {t("members.edit.title", "Edit Member")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[50vh]">
          {/* Full Name */}
          <InputField
            type="text"
            label={t("createMember.form.fullName.label")}
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder={t("createMember.form.fullName.placeholder")}
            error={errors.fullName}
            required
          />

          {/* Email */}
          <InputField
            type="email"
            label={t("createMember.form.email.label")}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder={t("createMember.form.email.placeholder")}
            error={errors.email}
          />

          {/* Phone */}
          <InputField
            type="tel"
            label={t("createMember.form.phone.label")}
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            placeholder={t("createMember.form.phone.placeholder")}
            error={errors.phoneNumber}
          />

          {/* Gender and Age Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CustomSelect
              title={t("createMember.form.gender.label")}
              options={genderOptions}
              selectedOption={formData.gender}
              onChange={(value) => handleInputChange("gender", value)}
            />

            <InputField
              type="number"
              label={t("createMember.form.age.label")}
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              placeholder={t("createMember.form.age.placeholder")}
              min="1"
              max="150"
              error={errors.age}
            />
          </div>

          {/* Subscription Type */}
          <CustomSelect
            title={t("createMember.form.subscription.label")}
            options={subscriptionOptions}
            selectedOption={formData.subscriptionTypeId}
            onChange={(value) => handleInputChange("subscriptionTypeId", value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-surface border border-border text-text-primary font-medium rounded-xl hover:bg-surface-hover transition-colors"
          >
            {t("actions.cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? t("actions.saving") : t("actions.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
