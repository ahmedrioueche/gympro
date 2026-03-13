import { membersApi, membershipApi } from "@ahmedrioueche/gympro-client";
import {
  CreditCard,
  Edit2,
  Hash,
  RefreshCcw,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
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

  // Start in view mode if there's already data
  const hasExistingData = !!(
    accessManagementProps?.initialAccessData?.rfidId ||
    accessManagementProps?.initialAccessData?.pinCode
  );
  const [isEditing, setIsEditing] = useState(!hasExistingData);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  // Sync state if membershipId changes (e.g. when opening for a different member)
  useEffect(() => {
    if (accessManagementProps?.initialAccessData) {
      const initialRfid = accessManagementProps.initialAccessData.rfidId || "";
      const initialPin = accessManagementProps.initialAccessData.pinCode || "";
      setRfidId(initialRfid);
      setPinCode(initialPin);

      // Only reset editing mode if it's a different membership or first load
      const hasData = !!(initialRfid || initialPin);
      setIsEditing(!hasData);
    }
  }, [accessManagementProps?.membershipId]);

  if (currentModal !== "access_management" || !accessManagementProps)
    return null;

  const { gymId, membershipId, memberName, onSuccess } = accessManagementProps;

  const handleGeneratePin = async () => {
    if (!gymId) return;
    setIsGenerating(true);
    try {
      const response = await membersApi.getRandomPin(gymId);
      if (response.success && response.data) {
        setPinCode(response.data.pin);
        toast.success(
          t("access.management.pin_generated", "PIN generated successfully"),
        );
      } else {
        toast.error(
          t("access.management.pin_gen_failed", "Failed to generate PIN"),
        );
      }
    } catch (error) {
      toast.error(
        t("access.management.pin_gen_failed", "Failed to generate PIN"),
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await membershipApi.updateAccessData(gymId, membershipId, {
        rfidId,
        pinCode,
      });
      toast.success(t("access.management.update_success"));
      setIsEditing(false);
      onSuccess?.();
      // We don't close immediately to let them see the updated view mode
    } catch (error: any) {
      toast.error(error.message || t("access.management.update_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setRfidId(accessManagementProps?.initialAccessData?.rfidId || "");
    setPinCode(accessManagementProps?.initialAccessData?.pinCode || "");
    setIsEditing(false);
  };

  return (
    <BaseModal
      isOpen={true}
      onClose={closeModal}
      title={t("access.management.title")}
      subtitle={memberName}
      icon={ShieldCheck}
      primaryButton={
        isEditing
          ? {
              label: t("common.save"),
              onClick: () => {
                handleSave();
              },
              loading: isLoading,
              icon: Save,
            }
          : null
      }
      secondaryButton={
        isEditing && hasExistingData
          ? {
              label: t("common.cancel"),
              onClick: handleCancelEdit,
              icon: X,
              variant: "ghost",
            }
          : undefined
      }
      maxWidth="max-w-md"
    >
      <div className="space-y-6 py-2">
        {!isEditing ? (
          <div className="space-y-4 animate-in fade-in duration-500">
            {/* View Mode */}
            <div className="flex items-center justify-between p-4 bg-surface-secondary/50 rounded-2xl border border-border/50 group hover:border-primary/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary font-medium mb-0.5 uppercase tracking-wider">
                    {t("access.management.rfid_label")}
                  </p>
                  <p className="text-base font-bold text-text-primary font-mono">
                    {rfidId || t("common.unassigned", "Unassigned")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-secondary/50 rounded-2xl border border-border/50 group hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                  <Hash className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary font-medium mb-0.5 uppercase tracking-wider">
                    {t("access.management.pin_label")}
                  </p>
                  <p className="text-lg font-black text-text-primary tracking-[0.2em] font-mono">
                    {pinCode || "••••••"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-text-secondary hover:text-primary text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                {t("common.edit", "Edit Access Data")}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            {/* Edit Mode */}
            <div className="space-y-2">
              <InputField
                label={t("access.management.rfid_label")}
                leftIcon={<CreditCard className="w-5 h-5" />}
                value={rfidId}
                onChange={(e) => setRfidId(e.target.value)}
                placeholder={t("access.management.rfid_placeholder")}
                className="font-medium bg-background/50"
                autoFocus
              />
              <p className="text-[10px] text-text-secondary px-1 italic">
                {t("access.management.rfid_hint")}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary mb-1 pl-1">
                {t("access.management.pin_label")}
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <InputField
                    leftIcon={<Hash className="w-5 h-5" />}
                    type="text"
                    maxLength={8}
                    value={pinCode}
                    onChange={(e) =>
                      setPinCode(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="••••••"
                    className="tracking-[0.3em] font-mono font-black text-xl bg-background/50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGeneratePin}
                  disabled={isGenerating}
                  className="h-[52px] px-4 rounded-xl border border-border bg-surface hover:bg-secondary text-text-primary transition-all flex items-center justify-center gap-2 group shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={t("common.generate", "Generate")}
                >
                  <RefreshCcw
                    className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-500 ${isGenerating ? "animate-spin" : ""}`}
                  />
                  <span className="hidden sm:inline text-sm font-bold uppercase tracking-tighter">
                    {t("common.generate", "Generate")}
                  </span>
                </button>
              </div>
              <p className="text-[10px] text-text-secondary px-1 italic">
                {t("access.management.pin_hint")}
              </p>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default AccessManagementModal;
