import { type TemporaryClosure } from "@ahmedrioueche/gympro-client";
import { Calendar, Check, Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/ui/Button";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import { useModalStore } from "../../../../../../../store/modal";
import SettingsTab from "../../../../../../components/settings/SettingsTab";

interface ClosuresTabProps {
  closures: TemporaryClosure[];
  setClosures: (value: TemporaryClosure[]) => void;
  onSave: (newClosures: TemporaryClosure[]) => Promise<boolean>;
  workingHoursStart: string;
  isSaving?: boolean;
}

type DurationUnit = "hours" | "days" | "restOfDay";

export default function ClosuresTab({
  closures,
  setClosures,
  onSave,
  workingHoursStart,
  isSaving,
}: ClosuresTabProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const [isAddingPlanned, setIsAddingPlanned] = useState(false);

  // Close Now State
  const [nowDuration, setNowDuration] = useState(1);
  const [nowUnit, setNowUnit] = useState<DurationUnit>("hours");
  const [nowReason, setNowReason] = useState("");

  // Planned Closure State
  const [plannedClosure, setPlannedClosure] = useState({
    start: new Date().toISOString().slice(0, 16), // datetime-local format
    duration: 1,
    unit: "hours" as DurationUnit,
    reason: "",
  });

  const checkOverlap = (start: Date, end: Date) => {
    return closures.some((closure) => {
      const eStart = new Date(closure.start);
      const eEnd = new Date(closure.end);
      return start < eEnd && end > eStart;
    });
  };

  const handleCloseNow = () => {
    openModal("confirm", {
      title: t("extra.gymSettings.closures.closeNowConfirmTitle"),
      text: t("extra.gymSettings.closures.closeNowConfirmText"),
      confirmVariant: "danger",
      onConfirm: () => {
        const start = new Date();
        const end = new Date(start);
        if (nowUnit === "hours") {
          end.setHours(end.getHours() + nowDuration);
        } else if (nowUnit === "days") {
          end.setDate(end.getDate() + nowDuration);
        } else if (nowUnit === "restOfDay") {
          const [hours, minutes] = workingHoursStart.split(":").map(Number);
          end.setDate(end.getDate() + 1);
          end.setHours(hours || 0, minutes || 0, 0, 0);
        }

        const newClosure = {
          start: start.toISOString(),
          end: end.toISOString(),
          reason: nowReason || t("extra.gymSettings.closures.genericReason"),
        };

        if (checkOverlap(start, end)) {
          toast.error(
            t(
              "extra.gymSettings.closures.overlapError",
              "Closures cannot overlap",
            ),
          );
          return;
        }

        const newClosures = [...closures, newClosure];
        onSave(newClosures);

        setNowReason("");
        setNowDuration(1);
      },
    });
  };

  const handleAddPlanned = () => {
    openModal("confirm", {
      title: t("extra.gymSettings.closures.confirmAddTitle"),
      text: t("extra.gymSettings.closures.confirmAddText"),
      confirmVariant: "primary",
      onConfirm: () => {
        const start = new Date(plannedClosure.start);
        const end = new Date(start);
        if (plannedClosure.unit === "hours") {
          end.setHours(end.getHours() + plannedClosure.duration);
        } else if (plannedClosure.unit === "days") {
          end.setDate(end.getDate() + plannedClosure.duration);
        } else if (plannedClosure.unit === "restOfDay") {
          const [hours, minutes] = workingHoursStart.split(":").map(Number);
          end.setDate(end.getDate() + 1);
          end.setHours(hours || 0, minutes || 0, 0, 0);
        }

        const newClosure = {
          start: start.toISOString(),
          end: end.toISOString(),
          reason:
            plannedClosure.reason ||
            t("extra.gymSettings.closures.genericReason"),
        };

        if (checkOverlap(start, end)) {
          toast.error(
            t(
              "extra.gymSettings.closures.overlapError",
              "Closures cannot overlap",
            ),
          );
          return;
        }

        const newClosures = [...closures, newClosure];
        onSave(newClosures);

        setIsAddingPlanned(false);
        setPlannedClosure({
          start: new Date().toISOString().slice(0, 16),
          duration: 1,
          unit: "hours",
          reason: "",
        });
      },
    });
  };

  const handleRemove = (index: number) => {
    openModal("confirm", {
      title: t("extra.gymSettings.closures.confirmDeleteTitle"),
      text: t("extra.gymSettings.closures.confirmDeleteText"),
      confirmVariant: "danger",
      onConfirm: async () => {
        const newClosures = closures.filter((_, i) => i !== index);
        onSave(newClosures);
      },
    });
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const isCurrent = (closure: TemporaryClosure) => {
    const now = new Date();
    return now >= new Date(closure.start) && now <= new Date(closure.end);
  };

  const unitOptions = [
    { label: t("extra.gymSettings.closures.hours"), value: "hours" as const },
    { label: t("extra.gymSettings.closures.days"), value: "days" as const },
    {
      label: t("extra.gymSettings.closures.restOfDay"),
      value: "restOfDay" as const,
    },
  ];

  return (
    <SettingsTab
      title={t("extra.gymSettings.tabs.closures", "Closures Settings")}
      description={t(
        "extra.gymSettings.closures.description",
        "Manage scheduled closures or shut down the gym immediately.",
      )}
      icon={Calendar}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION: Close Now */}
        <div className="bg-surface-hover rounded-2xl border border-border p-5 flex flex-col h-full transform transition-transform hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-danger/10 text-danger rounded-xl">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-[0.7rem] font-bold text-text-primary uppercase tracking-widest opacity-60">
                {t("extra.gymSettings.closures.closeNow")}
              </h4>
              <p className="text-xs text-text-secondary font-medium">
                {t("extra.gymSettings.closures.closeNowDesc")}
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-auto">
            <div className="grid grid-cols-2 gap-3">
              {nowUnit !== "restOfDay" && (
                <InputField
                  label={t("extra.gymSettings.closures.duration")}
                  type="number"
                  min={1}
                  value={nowDuration.toString()}
                  onChange={(e) =>
                    setNowDuration(parseInt(e.target.value) || 1)
                  }
                />
              )}
              <div className={nowUnit === "restOfDay" ? "col-span-2" : ""}>
                <CustomSelect
                  title={t("extra.gymSettings.closures.unit")}
                  options={unitOptions}
                  selectedOption={nowUnit}
                  onChange={(val) => setNowUnit(val as DurationUnit)}
                />
              </div>
            </div>
            <InputField
              label={t("extra.gymSettings.closures.reason")}
              placeholder={t("extra.gymSettings.closures.reasonPlaceholder")}
              value={nowReason}
              onChange={(e) => setNowReason(e.target.value)}
            />
            <Button
              className="w-full justify-center mt-2 group shadow-lg shadow-danger/20"
              color="danger"
              onClick={handleCloseNow}
              loading={isSaving}
              icon={
                <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              }
            >
              {t("extra.gymSettings.closures.closeNowAction")}
            </Button>
          </div>
        </div>

        {/* SECTION: Planned Closures */}
        <div className="bg-surface-hover rounded-2xl border border-border p-5 flex flex-col h-full transform transition-transform hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[0.7rem] font-bold text-text-primary uppercase tracking-widest opacity-60">
                {t("extra.gymSettings.closures.planned")}
              </h4>
              <p className="text-xs text-text-secondary font-medium">
                {t("extra.gymSettings.closures.plannedDesc")}
              </p>
            </div>
          </div>

          {!isAddingPlanned ? (
            <div className="flex-1 flex items-center justify-center">
              <Button
                variant="outline"
                className="w-full py-8 border-dashed border-2 hover:border-primary hover:bg-primary/5 group"
                onClick={() => setIsAddingPlanned(true)}
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                {t("extra.gymSettings.closures.addAction")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
              <InputField
                label={t("extra.gymSettings.closures.startDate")}
                type="datetime-local"
                value={plannedClosure.start}
                onChange={(e) =>
                  setPlannedClosure({
                    ...plannedClosure,
                    start: e.target.value,
                  })
                }
              />
              <div className="grid grid-cols-2 gap-3">
                {plannedClosure.unit !== "restOfDay" && (
                  <InputField
                    label={t("extra.gymSettings.closures.duration")}
                    type="number"
                    min={1}
                    value={plannedClosure.duration.toString()}
                    onChange={(e) =>
                      setPlannedClosure({
                        ...plannedClosure,
                        duration: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                )}
                <div
                  className={
                    plannedClosure.unit === "restOfDay" ? "col-span-2" : ""
                  }
                >
                  <CustomSelect
                    title={t("marketing.closures.unit")}
                    options={unitOptions}
                    selectedOption={plannedClosure.unit}
                    onChange={(val) =>
                      setPlannedClosure({
                        ...plannedClosure,
                        unit: val as DurationUnit,
                      })
                    }
                  />
                </div>
              </div>
              <InputField
                label={t("extra.gymSettings.closures.reason")}
                placeholder={t("extra.gymSettings.closures.reasonPlaceholder")}
                value={plannedClosure.reason}
                onChange={(e) =>
                  setPlannedClosure({
                    ...plannedClosure,
                    reason: e.target.value,
                  })
                }
              />
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 justify-center"
                  onClick={handleAddPlanned}
                  loading={isSaving}
                  icon={<Check className="w-4 h-4" />}
                >
                  {t("common.confirm")}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 justify-center"
                  onClick={() => setIsAddingPlanned(false)}
                >
                  {t("common.cancel")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LIST: All Closures */}
      <div className="space-y-4 mt-8">
        <h4 className="font-bold text-text-primary flex items-center gap-2">
          {t("extra.gymSettings.closures.planned")}
          <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-text-secondary border border-border">
            {closures.length}
          </span>
        </h4>

        {closures.length === 0 ? (
          <div className="p-12 bg-surface-hover rounded-2xl border border-dashed border-border text-center">
            <Calendar className="w-12 h-12 text-text-secondary/20 mx-auto mb-3" />
            <p className="text-text-secondary font-medium">
              {t("extra.gymSettings.closures.empty")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {closures.map((closure, index) => {
              const active = isCurrent(closure);
              return (
                <div
                  key={index}
                  className={`p-4 rounded-2xl border flex items-start justify-between group transition-all duration-200 hover:shadow-lg ${
                    active
                      ? "bg-danger/5 border-danger/30 shadow-danger/5"
                      : "bg-surface-hover border-border hover:bg-surface"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-bold text-text-primary truncate max-w-[200px]">
                        {closure.reason ||
                          t("extra.gymSettings.closures.genericReason")}
                      </span>
                      {active ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase rounded-lg bg-danger text-white animate-pulse">
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          {t("extra.gymSettings.closures.active")}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-lg bg-surface border border-border text-text-secondary">
                          {t("extra.gymSettings.closures.scheduled")}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-text-secondary flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium text-text-primary">
                          {formatDate(closure.start)}
                        </span>
                      </div>
                      <div className="text-xs text-text-secondary flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-text-secondary" />
                        <span>{formatDate(closure.end)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(index)}
                    className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SettingsTab>
  );
}
