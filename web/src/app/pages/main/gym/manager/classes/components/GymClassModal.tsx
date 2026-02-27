import type { CoachProfile } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import {
  Briefcase,
  Calendar,
  Info,
  Package,
  Plus,
  Save,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { EquipmentSelector } from "../../../../../../../app/components/ui/EquipmentSelector";
import { MinimalCoachCard } from "../../../../../../../app/components/ui/MinimalCoachCard";
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
import { capitalize, cn } from "../../../../../../../utils/helper";

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
    equipment: [] as { itemId: string; quantity: number }[],
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
        equipment: gymClass.equipment || [],
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
        equipment: [],
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
      maxWidth="max-w-3xl"
      primaryButton={{
        label: isEdit ? t("common.save") : t("common.create"),
        type: "submit",
        form: "gym-class-form",
        loading: isCreating || isUpdating,
        icon: isEdit ? Save : Plus,
      }}
    >
      <form id="gym-class-form" onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">
              {t("classes.form.sections.basicInfo", "Basic Information")}
            </h3>
          </div>

          <div className=" border border-white/10 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 backdrop-blur-sm">
            <InputField
              label={t("classes.form.name", "Class Name")}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
        </div>

        {/* Scheduling Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-secondary" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">
              {t("classes.form.sections.scheduling", "Scheduling & Recurrence")}
            </h3>
          </div>

          <div className=" border border-white/10 rounded-2xl p-6 space-y-6 backdrop-blur-sm relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={t("classes.form.date", "Start Date & Time")}
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
                placeholder={t(
                  "classes.form.selectFacility",
                  "Select a facility",
                )}
              />
            </div>

            <div className="pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomSelect
                title={t("classes.form.recurrence.label", "Recurrence Pattern")}
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
                    label: t("classes.form.recurrence.none", "One-time Only"),
                  },
                  {
                    value: "daily",
                    label: t("classes.form.recurrence.daily", "Every Day"),
                  },
                  {
                    value: "weekly",
                    label: t("classes.form.recurrence.weekly", "Every Week"),
                  },
                  {
                    value: "biweekly",
                    label: t(
                      "classes.form.recurrence.biweekly",
                      "Every 2 Weeks",
                    ),
                  },
                  {
                    value: "monthly",
                    label: t("classes.form.recurrence.monthly", "Every Month"),
                  },
                  {
                    value: "custom",
                    label: t("classes.form.recurrence.custom", "Custom Days"),
                  },
                ]}
              />

              {formData.recurrence.type !== "none" && (
                <div className="space-y-3">
                  <InputField
                    label={t(
                      "classes.form.recurrence.endDate",
                      "Stop Recuring At",
                    )}
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
                  <label className="flex items-center gap-3 px-1 cursor-pointer select-none group/check">
                    <div className="relative flex items-center">
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
                        className="peer hidden"
                      />
                      <div className="w-5 h-5 rounded-md border-2 border-white/10 peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-white/40 group-hover/check:text-white/60 transition-colors uppercase tracking-wider">
                      {t(
                        "classes.form.recurrence.noEndDate",
                        "Ongoing (No end date)",
                      )}
                    </span>
                  </label>
                </div>
              )}
            </div>

            {formData.recurrence.type === "custom" && (
              <div className="pt-4 border-t border-white/5 space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">
                  {t("classes.form.recurrence.days", "Select Days of the Week")}
                </label>
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5, 6, 0].map((day) => {
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
                        className={cn(
                          "flex-1 min-w-[60px] h-11 rounded-xl text-xs font-bold transition-all border",
                          isSelected
                            ? "bg-primary text-white border-primary shadow-[0_0_15px_-3px_rgba(var(--primary-rgb),0.4)]"
                            : " text-white/40 border-white/10 hover:border-white/20 hover:text-white/60",
                        )}
                      >
                        {labels[day]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructor Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <User className="w-4 h-4 text-accent" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">
              {t("classes.form.sections.instructor", "Assign Instructor")}
            </h3>
          </div>

          <div className=" border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative z-10">
            {affiliations && affiliations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {affiliations.map((aff) => {
                  const coach = (aff as any).coach as CoachProfile;
                  if (!coach) return null;
                  const isSelected = formData.coachId === aff.coachId;

                  return (
                    <div key={aff._id} className="relative group">
                      <MinimalCoachCard
                        coach={{
                          _id: aff.coachId,
                          fullName: coach.fullName,
                          username: coach.username,
                          profileImageUrl: coach.profileImageUrl,
                        }}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            coachId: isSelected ? "" : aff.coachId,
                          })
                        }
                        className={cn(
                          "transition-all duration-300",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.3)] ring-1 ring-primary/50"
                            : "opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0",
                        )}
                      />
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-20 shadow-lg animate-in zoom-in duration-300">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 rounded-xl  border border-dashed border-white/10">
                <div className="w-12 h-12 rounded-full  flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-sm font-bold text-white/60">
                  {t("classes.noCoaches", "No coaches available")}
                </p>
                <p className="text-xs text-white/30 mt-1 max-w-[240px] mx-auto leading-relaxed">
                  {t(
                    "classes.noCoachesDesc",
                    "Invite coaches to your gym to assign them to classes.",
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Equipment Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">
              {t("classes.form.sections.equipment", "Required Equipment")}
            </h3>
          </div>

          <div className=" border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <EquipmentSelector
              gymId={gymId}
              selectedItems={formData.equipment}
              onChange={(items) =>
                setFormData({ ...formData, equipment: items })
              }
            />
          </div>
        </div>
      </form>
    </BaseModal>
  );
}
