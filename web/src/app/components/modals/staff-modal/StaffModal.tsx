import { UserCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { useModalStore } from "../../../../store/modal";
import { extractCountryCodeAndNumber } from "../../../../utils/phone.util";
import StaffFormFields from "./StaffFormFields";
import { useStaffForm } from "./useStaffForm";

export default function StaffModal() {
  const { currentModal, staffModalProps, closeModal } = useModalStore();

  const isOpen = currentModal === "staff_modal";

  if (!isOpen || !staffModalProps) return null;

  const { gymId, mode, staff, onSuccess } = staffModalProps;

  return (
    <StaffModalContent
      key={mode + (staff?.membershipId || "")}
      gymId={gymId}
      mode={mode}
      staff={staff}
      onSuccess={onSuccess}
      onClose={closeModal}
    />
  );
}

interface StaffModalContentProps {
  gymId: string;
  mode: "add" | "edit";
  staff?: {
    membershipId: string;
    fullName: string;
    email?: string;
    phoneNumber?: string;
    role: string;
    permissions?: string[];
  };
  onSuccess?: () => void;
  onClose: () => void;
}

function StaffModalContent({
  gymId,
  mode,
  staff,
  onSuccess,
  onClose,
}: StaffModalContentProps) {
  const { t } = useTranslation();

  // Parse phone number into country code and local number for editing
  const parsedPhone = staff?.phoneNumber
    ? extractCountryCodeAndNumber(staff.phoneNumber)
    : null;

  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useStaffForm({
      gymId,
      mode,
      initialData: staff
        ? {
            membershipId: staff.membershipId,
            fullName: staff.fullName,
            email: staff.email || "",
            countryCode: parsedPhone?.countryCode || "+213",
            phoneNumber: parsedPhone?.number || "",
            role: staff.role as any,
            permissions: staff.permissions as any,
          }
        : undefined,
      onSuccess,
      onClose,
    });

  const title = mode === "add" ? t("staff.addTitle") : t("staff.editTitle");

  return (
    <BaseModal
      isOpen
      onClose={onClose}
      icon={UserCircle}
      title={title}
      primaryButton={{
        label: mode === "add" ? t("staff.addButton") : t("staff.saveButton"),
        type: "submit",
        form: "staff-form",
        loading: isSubmitting,
      }}
    >
      <form id="staff-form" onSubmit={handleSubmit}>
        <StaffFormFields
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />
      </form>
    </BaseModal>
  );
}
