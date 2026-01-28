import { useState } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";

import { Send } from "lucide-react";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import TextArea from "../../../../../../../components/ui/TextArea";
import { useModalStore } from "../../../../../../../store/modal";
import { useAnnouncements } from "../hooks/useAnnouncements";

export default function CreateAnnouncementModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, createAnnouncementProps } = useModalStore();
  const { createAnnouncement, isCreating } = useAnnouncements();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "normal" as "normal" | "high" | "critical",
    targetAudience: "all" as "all" | "members" | "staff",
    isActive: true,
  });

  const isOpen = currentModal === "create_announcement";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createAnnouncementProps?.gymId) return;

    await createAnnouncement({
      ...formData,
      gymId: createAnnouncementProps.gymId,
    });

    closeModal();
    // Reset form
    setFormData({
      title: "",
      content: "",
      priority: "normal",
      targetAudience: "all",
      isActive: true,
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("announcements.createTitle", "Create Announcement")}
      subtitle={t(
        "announcements.createDesc",
        "Send a message to your gym community",
      )}
      icon={Send}
      primaryButton={{
        label: t("common.create"),
        type: "submit",
        form: "create-announcement-form",
        loading: isCreating,
      }}
    >
      <form
        id="create-announcement-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <InputField
          label={t("announcements.form.title", "Title")}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder={t(
            "announcements.form.titlePlaceholder",
            "e.g., Holiday Hours",
          )}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            title={t("announcements.form.priority", "Priority")}
            selectedOption={formData.priority}
            onChange={(val) =>
              setFormData({ ...formData, priority: val as any })
            }
            options={[
              {
                value: "normal",
                label: t("announcements.priority.normal", "Normal"),
              },
              {
                value: "high",
                label: t("announcements.priority.high", "High"),
              },
              {
                value: "critical",
                label: t("announcements.priority.critical", "Critical"),
              },
            ]}
          />

          <CustomSelect
            title={t("announcements.form.audience", "Audience")}
            selectedOption={formData.targetAudience}
            onChange={(val) =>
              setFormData({ ...formData, targetAudience: val as any })
            }
            options={[
              {
                value: "all",
                label: t("announcements.audience.all", "Everyone"),
              },
              {
                value: "members",
                label: t("announcements.audience.members", "Members Only"),
              },
              {
                value: "staff",
                label: t("announcements.audience.staff", "Staff Only"),
              },
            ]}
          />
        </div>

        <TextArea
          label={t("announcements.form.content", "Content")}
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder={t(
            "announcements.form.contentPlaceholder",
            "Type your announcement here...",
          )}
          rows={5}
          required
        />
      </form>
    </BaseModal>
  );
}
