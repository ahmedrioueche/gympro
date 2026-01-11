import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { parsePhoneNumber } from "../../../../../utils/phone.util";
import {
  useAddStaff,
  useUpdateStaff,
} from "../../../../pages/main/gym/manager/staff/hooks/useStaff";

type StaffRole = "manager" | "staff" | "coach";

interface StaffFormData {
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  role: StaffRole;
}

const initialFormData: StaffFormData = {
  fullName: "",
  email: "",
  countryCode: "+213",
  phoneNumber: "",
  role: "staff",
};

interface UseStaffFormProps {
  gymId: string;
  mode: "add" | "edit";
  initialData?: Partial<StaffFormData> & { membershipId?: string };
  onSuccess?: () => void;
  onClose: () => void;
}

export function useStaffForm({
  gymId,
  mode,
  initialData,
  onSuccess,
  onClose,
}: UseStaffFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<StaffFormData>({
    ...initialFormData,
    ...initialData,
  });
  const [errors, setErrors] = useState<Partial<StaffFormData>>({});

  const addStaffMutation = useAddStaff();
  const updateStaffMutation = useUpdateStaff();

  const isSubmitting =
    addStaffMutation.isPending || updateStaffMutation.isPending;

  const validateForm = (): boolean => {
    const newErrors: Partial<StaffFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("staff.validation.nameRequired");
    }

    if (!formData.email && !formData.phoneNumber) {
      newErrors.email = t("staff.validation.contactRequired");
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("staff.validation.emailInvalid");
    }

    if (!formData.role) {
      newErrors.role = t("staff.validation.roleRequired") as StaffRole;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof StaffFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("staff.validation.checkForm"));
      return;
    }

    // Combine country code and phone number
    const fullPhoneNumber = formData.phoneNumber
      ? parsePhoneNumber(formData.countryCode, formData.phoneNumber)
      : undefined;

    try {
      if (mode === "add") {
        await addStaffMutation.mutateAsync({
          gymId,
          fullName: formData.fullName,
          email: formData.email || undefined,
          phoneNumber: fullPhoneNumber,
          role: formData.role,
        });
      } else if (initialData?.membershipId) {
        await updateStaffMutation.mutateAsync({
          gymId,
          membershipId: initialData.membershipId,
          dto: {
            fullName: formData.fullName,
            email: formData.email || undefined,
            phoneNumber: fullPhoneNumber,
            role: formData.role,
          },
        });
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
