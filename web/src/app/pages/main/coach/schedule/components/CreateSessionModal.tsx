import {
  SessionType,
  type CreateSessionDto,
} from "@ahmedrioueche/gympro-client";
import { Calendar } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../components/ui/BaseModal";
import CustomSelect from "../../../../../../components/ui/CustomSelect";
import { useCoachClients } from "../../../../../../hooks/queries/useCoaches";
import { useCreateSession } from "../../../../../../hooks/queries/useSessions";
import { useModalStore } from "../../../../../../store/modal";
import {
  getMessage,
  showStatusToast,
} from "../../../../../../utils/statusMessage";

export const CreateSessionModal = () => {
  const { t } = useTranslation();
  const { currentModal, createSessionProps, closeModal } = useModalStore();
  const createSession = useCreateSession();
  const { data: clientsData } = useCoachClients();
  const clients = clientsData?.data || [];

  const [formData, setFormData] = useState<CreateSessionDto>({
    memberId: "",
    startTime: "",
    endTime: "",
    type: SessionType.ONE_ON_ONE,
    notes: "",
    location: "",
  });

  const isOpen = currentModal === "create_session";

  const handleClose = () => {
    closeModal();
    setFormData({
      memberId: "",
      startTime: "",
      endTime: "",
      type: SessionType.ONE_ON_ONE,
      notes: "",
      location: "",
    });
  };

  const updateField = <K extends keyof CreateSessionDto>(
    field: K,
    value: CreateSessionDto[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await createSession.mutateAsync(formData);
    const message = getMessage({ success: !!response, data: response }, t);
    showStatusToast(message, toast);

    if (response) {
      createSessionProps?.onSuccess?.();
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("schedule.createSession")}
      subtitle={t("schedule.createSessionSubtitle")}
      icon={Calendar}
      primaryButton={{
        label: t("common.create"),
        onClick: handleSubmit,
        loading: createSession.isPending,
        type: "submit",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Select */}
        <div>
          <CustomSelect
            title={t("schedule.form.client")}
            placeholder={t("schedule.form.selectClient")}
            selectedOption={formData.memberId}
            onChange={(value) => updateField("memberId", value)}
            options={clients.map((client) => ({
              value: client.userId,
              label: client.fullName || client.username || "",
            }))}
            searchable={clients.length > 5 ? true : false}
            marginTop="mt-0"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t("schedule.form.startTime")}
            </label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => updateField("startTime", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t("schedule.form.endTime")}
            </label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => updateField("endTime", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              required
            />
          </div>
        </div>

        {/* Session Type */}
        <div>
          <CustomSelect
            title={t("schedule.form.type")}
            selectedOption={formData.type}
            onChange={(value) => updateField("type", value as SessionType)}
            options={[
              {
                value: SessionType.ONE_ON_ONE,
                label: t("schedule.types.one_on_one"),
              },
              {
                value: SessionType.CONSULTATION,
                label: t("schedule.types.consultation"),
              },
              {
                value: SessionType.CHECK_IN,
                label: t("schedule.types.check_in"),
              },
              {
                value: SessionType.ASSESSMENT,
                label: t("schedule.types.assessment"),
              },
            ]}
            marginTop="mt-0"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t("schedule.form.location")}
          </label>
          <input
            type="text"
            value={formData.location || ""}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder={t("schedule.form.locationPlaceholder")}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t("schedule.form.notes")}
          </label>
          <textarea
            value={formData.notes || ""}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder={t("schedule.form.notesPlaceholder")}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
          />
        </div>
      </form>
    </BaseModal>
  );
};

export default CreateSessionModal;
