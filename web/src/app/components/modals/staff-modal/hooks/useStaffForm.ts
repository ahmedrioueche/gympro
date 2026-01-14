import {
  DEFAULT_ROLE_PERMISSIONS,
  type GymPermission,
} from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { parsePhoneNumber } from "../../../../../utils/phone.util";
import {
  useAddStaff,
  useUpdateStaff,
} from "../../../../pages/main/gym/manager/staff/hooks/useStaff";

type StaffRole =
  | "manager"
  | "receptionist"
  | "coach"
  | "cleaner"
  | "maintenance";

interface StaffFormData {
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  role: StaffRole;
  permissions: GymPermission[];
}

const getDefaultPermissions = (role: StaffRole): GymPermission[] => {
  return [...(DEFAULT_ROLE_PERMISSIONS[role] || [])];
};

const initialFormData: StaffFormData = {
  fullName: "",
  email: "",
  countryCode: "+213",
  phoneNumber: "",
  role: "receptionist",
  permissions: getDefaultPermissions("receptionist"),
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
  const [formData, setFormData] = useState<StaffFormData>(() => {
    const initial = {
      ...initialFormData,
      ...initialData,
    };
    // If no permissions provided outside of edit mode, use role defaults
    if (mode === "add" && !initialData?.permissions) {
      initial.permissions = getDefaultPermissions(initial.role);
    }
    return initial;
  });
  const [errors, setErrors] = useState<Partial<StaffFormData>>({});

  const addStaffMutation = useAddStaff();
  const updateStaffMutation = useUpdateStaff();

  const isSubmitting =
    addStaffMutation.isPending || updateStaffMutation.isPending;

  // Update default permissions when role changes (only in add mode)
  useEffect(() => {
    if (mode === "add") {
      setFormData((prev) => ({
        ...prev,
        permissions: getDefaultPermissions(prev.role),
      }));
    }
  }, [formData.role, mode]);

  const validateForm = (): boolean => {
    const newErrors: Partial<StaffFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("staff.validation.nameRequired");
    }

    const isOfflineRole = ["cleaner", "maintenance"].includes(formData.role);

    if (!isOfflineRole && !formData.email && !formData.phoneNumber) {
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

  const handleChange = (
    field: keyof StaffFormData,
    value: string | GymPermission[]
  ) => {
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
          permissions: formData.permissions,
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
            permissions: formData.permissions,
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
