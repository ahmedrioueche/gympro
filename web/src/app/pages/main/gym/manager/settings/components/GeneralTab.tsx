import {
  CURRENCIES,
  WEEK_DAYS,
  type Currency,
  type WeeklyTimeRange,
} from "@ahmedrioueche/gympro-client";
import {
  Check,
  Clock,
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
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import SettingsTab from "../../../../../../components/settings/SettingsTab";

interface GeneralTabProps {
  workingHoursStart: string;
  setWorkingHoursStart: (value: string) => void;
  workingHoursEnd: string;
  setWorkingHoursEnd: (value: string) => void;
  useAdvancedHours: boolean;
  setUseAdvancedHours: (value: boolean) => void;
  customWorkingHours: WeeklyTimeRange[];
  setCustomWorkingHours: (value: WeeklyTimeRange[]) => void;
  isMixed: boolean;
  setIsMixed: (value: boolean) => void;
  femaleOnlyHours: WeeklyTimeRange[];
  setFemaleOnlyHours: (value: WeeklyTimeRange[]) => void;
  accessControlType: string;
  setAccessControlType: (value: string) => void;
  defaultCurrency: Currency;
  setDefaultCurrency: (value: Currency) => void;
  workingDays: number[];
  setWorkingDays: (value: number[]) => void;
}

export default function GeneralTab({
  workingHoursStart,
  setWorkingHoursStart,
  workingHoursEnd,
  setWorkingHoursEnd,
  useAdvancedHours,
  setUseAdvancedHours,
  customWorkingHours,
  setCustomWorkingHours,
  isMixed,
  setIsMixed,
  femaleOnlyHours,
  setFemaleOnlyHours,
  accessControlType,
  setAccessControlType,
  defaultCurrency,
  setDefaultCurrency,
  workingDays,
  setWorkingDays,
}: GeneralTabProps) {
  const { t } = useTranslation();
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [isAddingCustomSlot, setIsAddingCustomSlot] = useState(false);
  const [editingCustomIndex, setEditingCustomIndex] = useState<number | null>(
    null,
  );

  const [newSlot, setNewSlot] = useState<WeeklyTimeRange>({
    days: ["Monday"],
    range: { start: "09:00", end: "12:00" },
  });

  const [newCustomSlot, setNewCustomSlot] = useState<WeeklyTimeRange>({
    days: ["Monday"],
    range: { start: "06:00", end: "22:00" },
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

  // Custom Hours specific functions
  const startAddingCustomSlot = () => {
    setNewCustomSlot({
      days: ["Monday"],
      range: { start: "06:00", end: "22:00" },
    });
    setIsAddingCustomSlot(true);
  };

  const cancelAddingCustomSlot = () => setIsAddingCustomSlot(false);

  const confirmAddCustomSlot = () => {
    if (newCustomSlot.days.length === 0) return;
    setCustomWorkingHours([...customWorkingHours, newCustomSlot]);
    setIsAddingCustomSlot(false);
  };

  const startEditingCustomSlot = (index: number) => {
    setNewCustomSlot({ ...customWorkingHours[index] });
    setEditingCustomIndex(index);
  };

  const cancelEditingCustomSlot = () => setEditingCustomIndex(null);

  const confirmEditCustomSlot = () => {
    if (editingCustomIndex === null || newCustomSlot.days.length === 0) return;
    const updated = [...customWorkingHours];
    updated[editingCustomIndex] = newCustomSlot;
    setCustomWorkingHours(updated);
    setEditingCustomIndex(null);
  };

  const removeCustomSlot = (index: number) => {
    setCustomWorkingHours(customWorkingHours.filter((_, i) => i !== index));
  };

  const toggleCustomDay = (day: (typeof WEEK_DAYS)[number]) => {
    const isSelected = newCustomSlot.days.includes(day);
    setNewCustomSlot({
      ...newCustomSlot,
      days: isSelected
        ? newCustomSlot.days.filter((d) => d !== day)
        : [...newCustomSlot.days, day],
    });
  };

  const updateCustomTime = (field: "start" | "end", value: string) => {
    setNewCustomSlot({
      ...newCustomSlot,
      range: { ...newCustomSlot.range, [field]: value },
    });
  };

  return (
    <SettingsTab
      title={t("extra.gymSettings.tabs.general", "General Settings")}
      description={t(
        "extra.gymSettings.general.description",
        "Configure your gym's basic operating rules and preferences.",
      )}
      icon={Clock}
    >
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("extra.gymSettings.general.currency", "Currency")}
        </h4>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "extra.gymSettings.general.currencyDesc",
            "Select the currency for membership pricing display",
          )}
        </p>

        <div className="max-w-xs">
          <CustomSelect
            title=""
            options={CURRENCIES.map((c) => ({ label: c, value: c }))}
            selectedOption={defaultCurrency}
            onChange={(val) => setDefaultCurrency(val as Currency)}
            placeholder={t(
              "extra.gymSettings.general.selectCurrency",
              "Select currency",
            )}
            searchable
          />
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("extra.gymSettings.general.workingDays", "Working Days")}
        </h4>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "extra.gymSettings.general.workingDaysDesc",
            "Select the days your gym is operational",
          )}
        </p>

        <div className="flex flex-wrap gap-2">
          {WEEK_DAYS.map((day, index) => {
            const dayIndex = (index + 1) % 7; // Convert to 0-6 (Sun-Sat) where WEEK_DAYS is Mon-Sun
            const isSelected = workingDays.includes(dayIndex);

            return (
              <button
                key={day}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setWorkingDays(workingDays.filter((d) => d !== dayIndex));
                  } else {
                    setWorkingDays([...workingDays, dayIndex]);
                  }
                }}
                className={`px-4 py-2 rounded-xl border-2 font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                    : "bg-surface-hover border-border text-text-secondary hover:border-primary/30"
                }`}
              >
                {t(`common.weekDays.${day.toLowerCase()}`, day.slice(0, 3))}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
              {t("extra.gymSettings.general.workingHours", "Working Hours")}
            </h4>
            <p className="text-sm text-text-secondary">
              {t(
                "extra.gymSettings.general.workingHoursDesc",
                "Set your gym's operating hours",
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-hover rounded-xl border border-border">
            <input
              type="checkbox"
              id="useAdvancedHours"
              checked={useAdvancedHours}
              onChange={(e) => {
                setUseAdvancedHours(e.target.checked);
              }}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
            />
            <label
              htmlFor="useAdvancedHours"
              className="text-xs font-bold text-text-primary cursor-pointer"
            >
              {t("extra.gymSettings.general.advancedHours", "Advanced Mode")}
            </label>
          </div>
        </div>

        {!useAdvancedHours ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
            <InputField
              type="time"
              label={t("extra.gymSettings.general.startTime", "Opening Time")}
              value={workingHoursStart}
              onChange={(e) => setWorkingHoursStart(e.target.value)}
            />
            <InputField
              type="time"
              label={t("extra.gymSettings.general.endTime", "Closing Time")}
              value={workingHoursEnd}
              onChange={(e) => setWorkingHoursEnd(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">
                {t(
                  "extra.gymSettings.general.advancedHoursNote",
                  "Configure multiple time slots per day.",
                )}
              </span>
              {!isAddingCustomSlot && editingCustomIndex === null && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startAddingCustomSlot}
                  icon={<Plus className="w-4 h-4" />}
                >
                  {t("extra.gymSettings.general.addTimeSlot", "Add Slot")}
                </Button>
              )}
            </div>

            {/* Display existing custom slots */}
            {customWorkingHours.length > 0 && (
              <div className="space-y-3">
                {customWorkingHours.map((slot, index) => (
                  <div
                    key={index}
                    className="p-4 bg-surface-hover rounded-xl border border-border"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-primary">
                            {t("extra.gymSettings.general.slot", "Slot")}{" "}
                            {index + 1}
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
                                `common.weekDays.${day.toLowerCase()}`,
                                day.slice(0, 3),
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditingCustomSlot(index)}
                          className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeCustomSlot(index)}
                          className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add/Edit Custom Form */}
            {(isAddingCustomSlot || editingCustomIndex !== null) && (
              <div className="p-4 bg-surface rounded-xl border-2 border-primary/30 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2">
                    {t("extra.gymSettings.general.day", "Days")} *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {WEEK_DAYS.map((day) => {
                      const isSelected = newCustomSlot.days.includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() => toggleCustomDay(day)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-text-secondary hover:border-primary/50"
                          }`}
                        >
                          {t(
                            `common.weekDays.${day.toLowerCase()}`,
                            day.slice(0, 3),
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    type="time"
                    label={t(
                      "extra.gymSettings.general.startTime",
                      "Start Time",
                    )}
                    value={newCustomSlot.range.start}
                    onChange={(e) => updateCustomTime("start", e.target.value)}
                  />
                  <InputField
                    type="time"
                    label={t("extra.gymSettings.general.endTime", "End Time")}
                    value={newCustomSlot.range.end}
                    onChange={(e) => updateCustomTime("end", e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={
                      editingCustomIndex !== null
                        ? confirmEditCustomSlot
                        : confirmAddCustomSlot
                    }
                    icon={<Check className="w-4 h-4" />}
                    disabled={newCustomSlot.days.length === 0}
                  >
                    {editingCustomIndex !== null
                      ? t("common.save", "Save")
                      : t("common.add", "Add")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={
                      editingCustomIndex !== null
                        ? cancelEditingCustomSlot
                        : cancelAddingCustomSlot
                    }
                    icon={<X className="w-4 h-4" />}
                  >
                    {t("common.cancel", "Cancel")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("extra.gymSettings.general.genderPolicy", "Gender Policy")}
        </h4>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "extra.gymSettings.general.genderPolicyDesc",
            "Configure mixed or gender-specific training sessions",
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
              {t("extra.gymSettings.general.isMixed", "Mixed Training")}
            </label>
            <p className="text-xs text-text-secondary mt-0.5">
              {t(
                "extra.gymSettings.general.isMixedDesc",
                "Allow males and females to train together",
              )}
            </p>
          </div>
          <Users className="w-5 h-5 text-primary" />
        </div>

        {/* Female-Only Hours - Only show when not mixed */}
        {!isMixed && (
          <div className="mt-8 pt-8 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
                  {t(
                    "extra.gymSettings.general.femaleOnlyHours",
                    "Female-Only Hours",
                  )}
                </h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  {t(
                    "extra.gymSettings.general.femaleOnlyHoursDesc",
                    "Specify time ranges reserved for female members",
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
                  {t("extra.gymSettings.general.addTimeSlot", "Add Slot")}
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
                            {t("extra.gymSettings.general.slot", "Slot")}{" "}
                            {index + 1}
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
                                `common.weekDays.${day.toLowerCase()}`,
                                day.slice(0, 3),
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
                      ? `${t("extra.gymSettings.general.editSlot", "Edit Slot")} ${
                          editingIndex + 1
                        }`
                      : t(
                          "extra.gymSettings.general.newTimeSlot",
                          "New Time Slot",
                        )}
                  </h5>
                </div>

                {/* Days Selection */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2">
                    {t("extra.gymSettings.general.day", "Days")} *
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
                            `common.weekDays.${day.toLowerCase()}`,
                            day.slice(0, 3),
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {newSlot.days.length === 0 && (
                    <p className="text-xs text-danger mt-1">
                      {t(
                        "extra.gymSettings.general.selectAtLeastOneDay",
                        "Please select at least one day",
                      )}
                    </p>
                  )}
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    type="time"
                    label={t(
                      "extra.gymSettings.general.startTime",
                      "Start Time",
                    )}
                    value={newSlot.range.start}
                    onChange={(e) => updateTime("start", e.target.value)}
                  />
                  <InputField
                    type="time"
                    label={t("extra.gymSettings.general.endTime", "End Time")}
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
                      ? t(
                          "extra.gymSettings.general.saveChanges",
                          "Save Changes",
                        )
                      : t("extra.gymSettings.general.confirm", "Confirm")}
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
                    {t("extra.gymSettings.general.cancel", "Cancel")}
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {femaleOnlyHours.length === 0 && !isAddingSlot && (
              <div className="p-4 bg-surface-hover rounded-xl border border-border text-center">
                <p className="text-sm text-text-secondary">
                  {t(
                    "extra.gymSettings.general.noFemaleHours",
                    "No female-only hours configured",
                  )}
                </p>
              </div>
            )}
          </div>
        )}
        <div className="mt-8 pt-8 border-t border-border">
          <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
            {t(
              "extra.gymSettings.general.accessControlTitle",
              "Access Control Mode",
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
                  {t("extra.gymSettings.general.accessFlexible", "Flexible")}
                </span>
                <ShieldOff
                  className={`w-5 h-5 ${
                    accessControlType === "flexible"
                      ? "text-primary"
                      : "text-text-secondary"
                  }`}
                />
              </div>
              <p className="text-xs text-text-secondary text-left">
                {t(
                  "extra.gymSettings.general.accessFlexibleDesc",
                  "Members are allowed in even if expired, but both they and the manager receive a warning.",
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
                  {t("extra.gymSettings.general.accessStrict", "Strict")}
                </span>
                <ShieldCheck
                  className={`w-5 h-5 ${
                    accessControlType === "strict"
                      ? "text-primary"
                      : "text-text-secondary"
                  }`}
                />
              </div>
              <p className="text-xs text-text-secondary text-left">
                {t(
                  "extra.gymSettings.general.accessStrictDesc",
                  "Expired subscriptions strictly block entry. Physical access hardware will deny passage.",
                )}
              </p>
            </button>
          </div>
        </div>
      </div>
    </SettingsTab>
  );
}
