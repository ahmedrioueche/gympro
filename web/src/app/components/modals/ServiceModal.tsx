import { Dumbbell, Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import InputField from "../../../components/ui/InputField";
import TextArea from "../../../components/ui/TextArea";
import { useModalStore } from "../../../store/modal";
import { useModalLayer } from "../../../hooks/useModalLayer";
import { useGymServices } from "../../pages/main/gym/manager/pricing/hooks/useGymServices";

export default function ServiceModal() {
  const { t } = useTranslation();
  const { closeModal, serviceProps } = useModalStore();
  const { mode, service: editingService } = serviceProps || {};
  const { saveService, isUpdating } = useGymServices();

  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");

  const { isOpen, zIndex, closeModal: closeLayerModal } = useModalLayer("service");
  const isEdit = mode === "edit";

  useEffect(() => {
    if (isOpen && isEdit && editingService) {
      setServiceName(editingService.name);
      setDescription(editingService.description || "");
    } else {
      setServiceName("");
      setDescription("");
    }
  }, [isOpen, isEdit, editingService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    const success = await saveService(
      { name: serviceName, description },
      isEdit ? editingService : undefined,
    );
    if (success) {
      closeModal();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen} zIndex={zIndex}
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
        icon: isEdit ? Save : Plus,
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: closeModal,
        icon: X,
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
        <TextArea
          label={t("services.form.description", "Description")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t(
            "services.form.descriptionPlaceholder",
            "Describe what this service covers...",
          )}
          className="min-h-[100px] resize-none text-sm"
        />
      </form>
    </BaseModal>
  );
}
