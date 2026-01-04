import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../store/modal";
import BaseModal from "./ui/BaseModal";
import Button from "./ui/Button";

export default function ConfirmModal() {
  const { t } = useTranslation();
  const { currentModal, confirmModalProps, closeModal } = useModalStore();

  const title = confirmModalProps?.title || t("confirm.default.title");
  const text = confirmModalProps?.text || t("confirm.default.text");

  const confirmVariant = confirmModalProps?.confirmVariant || "primary";

  const handleCancel = () => {
    confirmModalProps?.onCancel?.();
    closeModal();
  };

  const handleConfirm = () => {
    confirmModalProps?.onConfirm?.();
    closeModal();
  };

  if (currentModal !== "confirm") {
    return null;
  }

  const confirmText = confirmModalProps?.confirmText || t("common.confirm");

  const buttons = (
    <>
      <Button variant="ghost" color="secondary" onClick={handleCancel}>
        {t("common.cancel")}
      </Button>
      <Button
        variant="filled"
        color={confirmVariant === "danger" ? "danger" : "primary"}
        onClick={handleConfirm}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <BaseModal
      isOpen={currentModal === "confirm"}
      onClose={closeModal}
      title={title}
      buttons={buttons}
      icon={AlertTriangle}
    >
      <p className="text-text-secondary">{text}</p>
    </BaseModal>
  );
}
