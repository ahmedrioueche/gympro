import { membershipApi } from "@ahmedrioueche/gympro-client";
import { CreditCard, Hash, Save, ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import InputField from "../../../../components/ui/InputField";
import { useModalStore } from "../../../../store/modal";

const AccessManagementModal: React.FC = () => {
  const { t } = useTranslation();
  const { currentModal, closeModal, accessManagementProps } = useModalStore();

  const [rfidId, setRfidId] = useState(
    accessManagementProps?.initialAccessData?.rfidId || "",
  );
  const [pinCode, setPinCode] = useState(
    accessManagementProps?.initialAccessData?.pinCode || "",
  );
  const [isLoading, setIsLoading] = useState(false);

  if (currentModal !== "access_management" || !accessManagementProps)
    return null;

  const { gymId, membershipId, memberName, onSuccess } = accessManagementProps;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await membershipApi.updateAccessData(gymId, membershipId, {
        rfidId,
        pinCode,
      });
      toast.success(t("access.management.update_success"));
      onSuccess?.();
      closeModal();
    } catch (error: any) {
      toast.error(error.message || t("access.management.update_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={true}
      onClose={closeModal}
      title={t("access.management.title")}
      subtitle={memberName}
      icon={ShieldCheck}
      primaryButton={{
        label: t("common.save"),
        onClick: handleSave,
        loading: isLoading,
        icon: Save,
      }}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 py-2">
        {/* RFID Section */}
        <InputField
          label={t("access.management.rfid_label")}
          leftIcon={<CreditCard className="w-5 h-5" />}
          value={rfidId}
          onChange={(e) => setRfidId(e.target.value)}
          placeholder={t("access.management.rfid_placeholder")}
          className="font-medium"
        />
        <p className="text-xs text-text-muted -mt-4 px-1">
          {t("access.management.rfid_hint")}
        </p>

        {/* PIN Section */}
        <InputField
          label={t("access.management.pin_label")}
          leftIcon={<Hash className="w-5 h-5" />}
          type="text"
          maxLength={6}
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
          placeholder="••••••"
          className="tracking-[0.5em] text-center font-bold text-lg"
        />
        <p className="text-xs text-text-muted -mt-4 px-1">
          {t("access.management.pin_hint")}
        </p>
      </div>
    </BaseModal>
  );
};

export default AccessManagementModal;
