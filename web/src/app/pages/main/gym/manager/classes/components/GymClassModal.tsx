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
import { capitalize } from "../../../../../../../utils/helper";
import CoachCard from "../../../../../../components/cards/CoachCard";

export default function GymClassModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, openModal, gymClassProps } =
    useModalStore();
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
    facilityId: "",
    recurrence: {
      type: "none" as
        | "none"
        | "daily"
        | "weekly"
        | "biweekly"
        | "monthly"
        | "custom",
      endDate: "",
      noEndDate: false,
      days: [] as number[],
    },
  });

  const isOpen = currentModal === "gym_class";
  const isEdit = !!gymClass;

  useEffect(() => {
    if (gymClass) {
      const coachId =
        typeof gymClass.coachId === "object"
          ? (gymClass.coachId as any)?._id
          : gymClass.coachId || "";

      setFormData({
        name: gymClass.name,
        service: gymClass.service || "",
        coachId,
        maxCapacity: gymClass.maxCapacity,
        duration: gymClass.duration || 60,
        scheduledAt: format(
          new Date(gymClass.scheduledAt),
          "yyyy-MM-dd'T'HH:mm",
        ),
        facilityId: gymClass.facilityId || "",
        recurrence: {
          type: gymClass.recurrence?.type || "none",
          endDate: gymClass.recurrence?.endDate
            ? format(new Date(gymClass.recurrence.endDate), "yyyy-MM-dd")
            : "",
          noEndDate:
            !gymClass.recurrence?.endDate &&
            gymClass.recurrence?.type !== "none",
          days: gymClass.recurrence?.days || [],
        },
      });
    } else {
      setFormData({
        name: "",
        service: "",
        coachId: "",
        maxCapacity: 10,
        duration: 60,
        scheduledAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        facilityId: "",
        recurrence: {
          type: "none",
          endDate: "",
          noEndDate: false,
          days: [],
        },
      });
    }
  }, [gymClass]);

  const handleFacilityChange = (facilityId: string) => {
    const gym = useGymStore.getState().currentGym;
    const facility = gym?.facilities?.find((f) => f._id === facilityId);

    setFormData((prev) => ({
      ...prev,
      facilityId,
      maxCapacity: facility?.capacity || prev.maxCapacity,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymId) return;

    if (!formData.service) {
      toast.error(t("classes.form.serviceRequired", "Service is required"));
      return;
    }

    const performUpdate = async (updateSeries = false) => {
      if (!gymClass) return;
      await updateClass({
        id: gymClass._id,
        data: {
          ...formData,
          facilityId: formData.facilityId || undefined,
        },
        updateSeries,
      });
      onSuccess?.();
      closeModal();
    };

    try {
      if (isEdit && gymClass) {
        if (gymClass.seriesId) {
          openModal("confirm", {
            title: t("classes.update.title", "Update Class"),
            text: t(
              "classes.update.message",
              "This is a recurring class. Do you want to apply changes to only this session or the entire upcoming series?",
            ),
            onConfirm: () => performUpdate(false),
            confirmText: t(
              "classes.update.confirmOne",
              "Update this session only",
            ),
            secondaryAction: {
              label: t("classes.update.confirmSeries", "Update entire series"),
              onClick: () => performUpdate(true),
            },
          });
        } else {
          await performUpdate(false);
        }
      } else {
        const submissionData: any = { ...formData };
        if (!formData.facilityId) delete submissionData.facilityId;
        if (formData.recurrence.type === "none") {
          delete submissionData.recurrence;
        } else if (formData.recurrence.noEndDate) {
          submissionData.recurrence = {
            ...formData.recurrence,
            endDate: undefined,
          };
          delete submissionData.recurrence.noEndDate;
        } else {
          const recurrence = { ...formData.recurrence };
          delete (recurrence as any).noEndDate;
          submissionData.recurrence = recurrence;
        }

        await createClass(submissionData);
        onSuccess?.();
        closeModal();
      }
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
            selectedOption={capitalize(formData.service)}
            onChange={(val) => setFormData({ ...formData, service: val })}
            options={
              useGymStore
                .getState()
                .currentGym?.settings?.servicesOffered?.map((s) => ({
                  value: s.name,
                  label: s.name,
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

          <CustomSelect
            title={t("classes.form.facility", "Facility")}
            selectedOption={
              useGymStore
                .getState()
                .currentGym?.facilities?.find(
                  (f) => f._id === formData.facilityId,
                )?.name || ""
            }
            onChange={handleFacilityChange}
            options={
              useGymStore.getState().currentGym?.facilities?.map((f) => ({
                value: f._id,
                label: f.name,
              })) || []
            }
            placeholder={t("classes.form.selectFacility", "Select a facility")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomSelect
            title={t("classes.form.recurrence.label", "Recurrence")}
            selectedOption={t(
              `classes.form.recurrence.${formData.recurrence.type}`,
              formData.recurrence.type,
            )}
            onChange={(val) =>
              setFormData({
                ...formData,
                recurrence: {
                  ...formData.recurrence,
                  type: val as any,
                },
              })
            }
            options={[
              {
                value: "none",
                label: t("classes.form.recurrence.none", "One-time"),
              },
              {
                value: "daily",
                label: t("classes.form.recurrence.daily", "Daily"),
              },
              {
                value: "weekly",
                label: t("classes.form.recurrence.weekly", "Weekly"),
              },
              {
                value: "biweekly",
                label: t("classes.form.recurrence.biweekly", "Bi-weekly"),
              },
              {
                value: "monthly",
                label: t("classes.form.recurrence.monthly", "Monthly"),
              },
              {
                value: "custom",
                label: t("classes.form.recurrence.custom", "Custom Days"),
              },
            ]}
          />

          {formData.recurrence.type !== "none" && (
            <div className="flex flex-col gap-2">
              <InputField
                label={t("classes.form.recurrence.endDate", "End Date")}
                type="date"
                value={formData.recurrence.endDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recurrence: {
                      ...formData.recurrence,
                      endDate: e.target.value,
                    },
                  })
                }
                required={!formData.recurrence.noEndDate}
                disabled={formData.recurrence.noEndDate}
              />
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.recurrence.noEndDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurrence: {
                        ...formData.recurrence,
                        noEndDate: e.target.checked,
                        endDate: e.target.checked
                          ? ""
                          : formData.recurrence.endDate,
                      },
                    })
                  }
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-xs font-medium text-text-secondary">
                  {t(
                    "classes.form.recurrence.noEndDate",
                    "Ongoing (No end date)",
                  )}
                </span>
              </label>
            </div>
          )}

          {formData.recurrence.type === "custom" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary">
                {t("classes.form.recurrence.days", "Select Days")}
              </label>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                  const isSelected = formData.recurrence.days.includes(day);
                  const labels = [
                    t("common.weekDays.sunday", "Sun"),
                    t("common.weekDays.monday", "Mon"),
                    t("common.weekDays.tuesday", "Tue"),
                    t("common.weekDays.wednesday", "Wed"),
                    t("common.weekDays.thursday", "Thu"),
                    t("common.weekDays.friday", "Fri"),
                    t("common.weekDays.saturday", "Sat"),
                  ];
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const newDays = isSelected
                          ? formData.recurrence.days.filter((d) => d !== day)
                          : [...formData.recurrence.days, day];
                        setFormData({
                          ...formData,
                          recurrence: {
                            ...formData.recurrence,
                            days: newDays,
                          },
                        });
                      }}
                      className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-surface-secondary text-text-secondary hover:bg-surface-hover"
                      }`}
                    >
                      {labels[day][0]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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
