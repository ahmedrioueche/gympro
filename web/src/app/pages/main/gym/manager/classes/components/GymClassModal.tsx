import type { CoachProfile } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import {
  useCreateClass,
  useUpdateClass,
} from "../../../../../../../hooks/queries/useGymClasses";
import { useGymCoaches } from "../../../../../../../hooks/queries/useGymCoach";
import { useGymStore } from "../../../../../../../store/gym";
import { useModalStore } from "../../../../../../../store/modal";
import CoachCard from "../../../../../../components/cards/CoachCard";

export default function GymClassModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, gymClassProps } = useModalStore();
  const { gymId, gymClass, onSuccess } = gymClassProps || {};

  const { mutateAsync: createClass, isPending: isCreating } =
    useCreateClass(gymId);
  const { mutateAsync: updateClass, isPending: isUpdating } =
    useUpdateClass(gymId);
  const { data: affiliations } = useGymCoaches(gymId);

  const [formData, setFormData] = useState({
    name: "",
    service: "",
    coachId: "",
    maxCapacity: 10,
    duration: 60,
    scheduledAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  const isOpen = currentModal === "gym_class";
  const isEdit = !!gymClass;

  useEffect(() => {
    if (gymClass) {
      setFormData({
        name: gymClass.name,
        service: gymClass.service || "",
        coachId: gymClass.coachId || "",
        maxCapacity: gymClass.maxCapacity,
        duration: gymClass.duration || 60,
        scheduledAt: format(
          new Date(gymClass.scheduledAt),
          "yyyy-MM-dd'T'HH:mm",
        ),
      });
    } else {
      setFormData({
        name: "",
        service: "",
        coachId: "",
        maxCapacity: 10,
        duration: 60,
        scheduledAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      });
    }
  }, [gymClass]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymId) return;

    if (!formData.service) {
      toast.error(t("classes.form.serviceRequired", "Service is required"));
      return;
    }

    try {
      if (isEdit && gymClass) {
        await updateClass({ id: gymClass._id, data: formData });
      } else {
        await createClass(formData);
      }
      onSuccess?.();
      closeModal();
    } catch (error) {
      // Error is handled by query
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={
        isEdit
          ? t("classes.editTitle", "Edit Class")
          : t("classes.createTitle", "Create Class")
      }
      subtitle={t(
        "classes.modalDesc",
        "Set the details for your group workout",
      )}
      icon={Briefcase}
      primaryButton={{
        label: isEdit ? t("common.save") : t("common.create"),
        type: "submit",
        form: "gym-class-form",
        loading: isCreating || isUpdating,
      }}
    >
      <form id="gym-class-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={t("classes.form.name", "Class Name")}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t(
              "classes.form.namePlaceholder",
              "e.g., Morning Yoga, HIIT",
            )}
            required
          />

          <CustomSelect
            title={t("classes.form.service", "Service Type")}
            selectedOption={formData.service}
            onChange={(val) => setFormData({ ...formData, service: val })}
            options={
              useGymStore
                .getState()
                .currentGym?.settings?.servicesOffered?.map((s) => ({
                  value: s,
                  label: s,
                })) || []
            }
            placeholder={t("classes.form.selectService", "Select a service")}
          />

          <InputField
            label={t("classes.form.date", "Scheduled Date & Time")}
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) =>
              setFormData({ ...formData, scheduledAt: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={t("classes.form.capacity", "Max Capacity")}
            type="number"
            value={formData.maxCapacity.toString()}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxCapacity: parseInt(e.target.value),
              })
            }
            min="1"
            required
          />

          <InputField
            label={t("classes.form.duration", "Duration (minutes)")}
            type="number"
            value={formData.duration.toString()}
            onChange={(e) =>
              setFormData({
                ...formData,
                duration: parseInt(e.target.value),
              })
            }
            min="15"
            step="15"
            required
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">
            {t("classes.form.coach", "Select Coach")}
          </label>
          {affiliations && affiliations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {affiliations.map((aff) => {
                const coach = (aff as any).coach as CoachProfile;
                if (!coach) return null;
                const isSelected = formData.coachId === aff.coachId;

                return (
                  <div key={aff._id} className="h-full">
                    <CoachCard
                      coach={coach}
                      selectable
                      isSelected={isSelected}
                      onSelect={() =>
                        setFormData({
                          ...formData,
                          coachId: isSelected ? "" : aff.coachId,
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-surface-secondary/30 rounded-2xl border border-dashed border-border text-text-secondary">
              <p>{t("classes.noCoaches", "No coaches available")}</p>
              <p className="text-xs mt-1 opacity-70">
                {t(
                  "classes.noCoachesDesc",
                  "Invite coaches to your gym to assign them to classes.",
                )}
              </p>
            </div>
          )}
        </div>
      </form>
    </BaseModal>
  );
}
