import { WEEK_DAYS, type WeeklyTimeRange } from "@ahmedrioueche/gympro-client";
import {
  Check,
  Edit2,
  Plus,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/ui/Button";
import InputField from "../../../../../../../components/ui/InputField";

interface GeneralTabProps {
  workingHoursStart: string;
  setWorkingHoursStart: (value: string) => void;
  workingHoursEnd: string;
  setWorkingHoursEnd: (value: string) => void;
  isMixed: boolean;
  setIsMixed: (value: boolean) => void;
  femaleOnlyHours: WeeklyTimeRange[];
  setFemaleOnlyHours: (value: WeeklyTimeRange[]) => void;
  accessControlType: string;
  setAccessControlType: (value: string) => void;
}

export default function GeneralTab({
  workingHoursStart,
  setWorkingHoursStart,
  workingHoursEnd,
  setWorkingHoursEnd,
  isMixed,
  setIsMixed,
  femaleOnlyHours,
  setFemaleOnlyHours,
  accessControlType,
  setAccessControlType,
}: GeneralTabProps) {
  const { t } = useTranslation();
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newSlot, setNewSlot] = useState<WeeklyTimeRange>({
    days: ["Monday"],
    range: { start: "09:00", end: "12:00" },
  });

  const startAddingSlot = () => {
    setNewSlot({
      days: ["Monday"],
      range: { start: "09:00", end: "12:00" },
    });
    setIsAddingSlot(true);
  };

  const cancelAddingSlot = () => {
    setIsAddingSlot(false);
  };

  const confirmAddSlot = () => {
    if (newSlot.days.length === 0) {
      return; // Validation: at least one day must be selected
    }
    setFemaleOnlyHours([...femaleOnlyHours, newSlot]);
    setIsAddingSlot(false);
  };

  const startEditingSlot = (index: number) => {
    setNewSlot({ ...femaleOnlyHours[index] });
    setEditingIndex(index);
  };

  const cancelEditingSlot = () => {
    setEditingIndex(null);
  };

  const confirmEditSlot = () => {
    if (editingIndex === null) return;
    if (newSlot.days.length === 0) {
      return; // Validation: at least one day must be selected
    }
    const updated = [...femaleOnlyHours];
    updated[editingIndex] = newSlot;
    setFemaleOnlyHours(updated);
    setEditingIndex(null);
  };

  const removeSlot = (index: number) => {
    setFemaleOnlyHours(femaleOnlyHours.filter((_, i) => i !== index));
  };

  const toggleDay = (day: (typeof WEEK_DAYS)[number]) => {
    const isSelected = newSlot.days.includes(day);
    setNewSlot({
      ...newSlot,
      days: isSelected
        ? newSlot.days.filter((d) => d !== day)
        : [...newSlot.days, day],
    });
  };

  const updateTime = (field: "start" | "end", value: string) => {
    setNewSlot({
      ...newSlot,
      range: { ...newSlot.range, [field]: value },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {t("settings.gym.general.workingHours", "Working Hours")}
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.gym.general.workingHoursDesc",
            "Set your gym's operating hours"
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
          <InputField
            type="time"
            label={t("settings.gym.general.startTime", "Opening Time")}
            value={workingHoursStart}
            onChange={(e) => setWorkingHoursStart(e.target.value)}
          />
          <InputField
            type="time"
            label={t("settings.gym.general.endTime", "Closing Time")}
            value={workingHoursEnd}
            onChange={(e) => setWorkingHoursEnd(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {t("settings.gym.general.genderPolicy", "Gender Policy")}
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.gym.general.genderPolicyDesc",
            "Configure mixed or gender-specific training sessions"
          )}
        </p>

        <div className="flex items-center gap-3 p-4 bg-surface-hover rounded-xl border border-border">
          <input
            type="checkbox"
            id="isMixed"
            checked={isMixed}
            onChange={(e) => setIsMixed(e.target.checked)}
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
          />
          <div className="flex-1">
            <label
              htmlFor="isMixed"
              className="text-sm font-medium text-text-primary cursor-pointer"
            >
              {t("settings.gym.general.isMixed", "Mixed Training")}
            </label>
            <p className="text-xs text-text-secondary mt-0.5">
              {t(
                "settings.gym.general.isMixedDesc",
                "Allow males and females to train together"
              )}
            </p>
          </div>
          <Users className="w-5 h-5 text-primary" />
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-text-primary mb-3">
            {t(
              "settings.gym.general.accessControlTitle",
              "Access Control Mode"
            )}
          </h4>
          <div className="grid text-primary grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setAccessControlType("flexible")}
              className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all ${
                accessControlType === "flexible"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-surface-hover hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold">
                  {t("settings.gym.general.accessFlexible", "Flexible")}
                </span>
                <ShieldOff
                  className={`w-5 h-5 ${
                    accessControlType === "flexible"
                      ? "text-primary"
                      : "text-text-tertiary"
                  }`}
                />
              </div>
              <p className="text-xs text-text-secondary text-left">
                {t(
                  "settings.gym.general.accessFlexibleDesc",
                  "Members are allowed in even if expired, but both they and the manager receive a warning."
                )}
              </p>
            </button>

            <button
              onClick={() => setAccessControlType("strict")}
              className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all ${
                accessControlType === "strict"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-surface-hover hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold">
                  {t("settings.gym.general.accessStrict", "Strict")}
                </span>
                <ShieldCheck
                  className={`w-5 h-5 ${
                    accessControlType === "strict"
                      ? "text-primary"
                      : "text-text-tertiary"
                  }`}
                />
              </div>
              <p className="text-xs text-text-secondary text-left">
                {t(
                  "settings.gym.general.accessStrictDesc",
                  "Expired subscriptions strictly block entry. Physical access hardware will deny passage."
                )}
              </p>
            </button>
          </div>
        </div>

        {/* Female-Only Hours - Only show when not mixed */}
        {!isMixed && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-text-primary">
                  {t(
                    "settings.gym.general.femaleOnlyHours",
                    "Female-Only Hours"
                  )}
                </h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  {t(
                    "settings.gym.general.femaleOnlyHoursDesc",
                    "Specify time ranges reserved for female members"
                  )}
                </p>
              </div>
              {!isAddingSlot && editingIndex === null && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startAddingSlot}
                  icon={<Plus className="w-4 h-4" />}
                >
                  {t("settings.gym.general.addTimeSlot", "Add Slot")}
                </Button>
              )}
            </div>

            {/* Display existing slots */}
            {femaleOnlyHours.length > 0 && (
              <div className="space-y-3">
                {femaleOnlyHours.map((slot, index) => (
                  <div
                    key={index}
                    className="p-4 bg-surface-hover rounded-xl border border-border"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-primary">
                            {t("settings.gym.general.slot", "Slot")} {index + 1}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {slot.range.start} - {slot.range.end}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {slot.days.map((day) => (
                            <span
                              key={day}
                              className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary border border-primary/20"
                            >
                              {t(
                                `settings.gym.general.days.${day.toLowerCase()}`,
                                day.slice(0, 3)
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditingSlot(index)}
                          className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          disabled={isAddingSlot || editingIndex !== null}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeSlot(index)}
                          className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          disabled={isAddingSlot || editingIndex !== null}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add/Edit Form */}
            {(isAddingSlot || editingIndex !== null) && (
              <div className="p-4 bg-surface rounded-xl border-2 border-primary/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-semibold text-text-primary">
                    {editingIndex !== null
                      ? `${t("settings.gym.general.editSlot", "Edit Slot")} ${
                          editingIndex + 1
                        }`
                      : t("settings.gym.general.newTimeSlot", "New Time Slot")}
                  </h5>
                </div>

                {/* Days Selection */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2">
                    {t("settings.gym.general.day", "Days")} *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {WEEK_DAYS.map((day) => {
                      const isSelected = newSlot.days.includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-text-secondary hover:border-primary/50"
                          }`}
                        >
                          {t(
                            `settings.gym.general.days.${day.toLowerCase()}`,
                            day.slice(0, 3)
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {newSlot.days.length === 0 && (
                    <p className="text-xs text-danger mt-1">
                      {t(
                        "settings.gym.general.selectAtLeastOneDay",
                        "Please select at least one day"
                      )}
                    </p>
                  )}
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    type="time"
                    label={t("settings.gym.general.startTime", "Start Time")}
                    value={newSlot.range.start}
                    onChange={(e) => updateTime("start", e.target.value)}
                  />
                  <InputField
                    type="time"
                    label={t("settings.gym.general.endTime", "End Time")}
                    value={newSlot.range.end}
                    onChange={(e) => updateTime("end", e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={
                      editingIndex !== null ? confirmEditSlot : confirmAddSlot
                    }
                    icon={<Check className="w-4 h-4" />}
                    disabled={newSlot.days.length === 0}
                  >
                    {editingIndex !== null
                      ? t("settings.gym.general.saveChanges", "Save Changes")
                      : t("settings.gym.general.confirm", "Confirm")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={
                      editingIndex !== null
                        ? cancelEditingSlot
                        : cancelAddingSlot
                    }
                    icon={<X className="w-4 h-4" />}
                  >
                    {t("settings.gym.general.cancel", "Cancel")}
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {femaleOnlyHours.length === 0 && !isAddingSlot && (
              <div className="p-4 bg-surface-hover rounded-xl border border-border text-center">
                <p className="text-sm text-text-secondary">
                  {t(
                    "settings.gym.general.noFemaleHours",
                    "No female-only hours configured"
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
