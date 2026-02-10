import { Dumbbell } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import InputField from "../../../../../../../components/ui/InputField";
import { useModalStore } from "../../../../../../../store/modal";
import { useGymServices } from "../hooks/useGymServices";

export default function ServiceModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, serviceProps } = useModalStore();
  const { mode, service: editingService } = serviceProps || {};
  const { saveService, isUpdating } = useGymServices();

  const [serviceName, setServiceName] = useState("");

  const isOpen = currentModal === "service";
  const isEdit = mode === "edit";

  useEffect(() => {
    if (isOpen && isEdit && editingService) {
      setServiceName(editingService);
    } else {
      setServiceName("");
    }
  }, [isOpen, isEdit, editingService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    const success = await saveService(
      serviceName,
      isEdit ? editingService : undefined,
    );
    if (success) {
      closeModal();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={
        isEdit
          ? t("services.editTitle", "Edit Service")
          : t("services.createTitle", "Add Service")
      }
      subtitle={t("services.modalDesc", "Define a service offered at your gym")}
      icon={Dumbbell}
      primaryButton={{
        label: isEdit ? t("common.save") : t("common.add"),
        type: "submit",
        form: "service-form",
        loading: isUpdating,
        disabled: !serviceName.trim(),
      }}
    >
      <form id="service-form" onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label={t("services.form.name", "Service Name")}
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder={t(
            "services.form.placeholder",
            "e.g., Yoga, HIIT, Sauna",
          )}
          required
          autoFocus
        />
      </form>
    </BaseModal>
  );
}
