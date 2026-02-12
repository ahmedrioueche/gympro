import type { Facility } from "@ahmedrioueche/gympro-client";
import { Building2, Check, Edit2, Plus, Trash2, Users, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/ui/Button";
import InputField from "../../../../../../../components/ui/InputField";

interface FacilitiesTabProps {
  facilities: Facility[];
  onAdd: (data: Partial<Facility>) => Promise<any>;
  onUpdate: (id: string, data: Partial<Facility>) => Promise<any>;
  onRemove: (id: string) => Promise<any>;
  isLoading?: boolean;
}

export default function FacilitiesTab({
  facilities,
  onAdd,
  onUpdate,
  onRemove,
  isLoading,
}: FacilitiesTabProps) {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Facility>>({
    name: "",
    capacity: undefined,
    description: "",
  });

  const resetForm = () => {
    setFormData({ name: "", capacity: undefined, description: "" });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleStartEdit = (facility: Facility) => {
    setFormData({
      name: facility.name,
      capacity: facility.capacity,
      description: facility.description,
    });
    setEditingId(facility._id);
    setIsAdding(false);
  };

  const handleSubmit = async () => {
    if (!formData.name) return;

    try {
      if (editingId) {
        await onUpdate(editingId, formData);
      } else {
        await onAdd(formData);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save facility:", error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {t("settings.gym.facilities.title", "Gym Facilities")}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              {t(
                "settings.gym.facilities.description",
                "Add and manage rooms, zones, or specific areas in your gym.",
              )}
            </p>
          </div>
        </div>

        {!isAdding && !editingId && (
          <Button
            onClick={handleStartAdd}
            icon={<Plus className="w-4 h-4" />}
            size="sm"
          >
            {t("settings.gym.facilities.add", "Add Facility")}
          </Button>
        )}
      </div>

      {/* Form Card */}
      {(isAdding || editingId) && (
        <div className="p-6 bg-surface-hover rounded-2xl border-2 border-primary/20 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-text-primary">
              {editingId
                ? t("settings.gym.facilities.edit", "Edit Facility")
                : t("settings.gym.facilities.new", "New Facility")}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label={t("settings.gym.facilities.name", "Facility Name")}
              placeholder={t(
                "settings.gym.facilities.namePlaceholder",
                "e.g. Yoga Studio, Main Floor",
              )}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <InputField
              type="number"
              label={t(
                "settings.gym.facilities.capacity",
                "Max Capacity (Optional)",
              )}
              placeholder="e.g. 20"
              value={formData.capacity?.toString() || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: parseInt(e.target.value) || undefined,
                })
              }
              leftIcon={<Users className="w-4 h-4" />}
            />
          </div>

          <InputField
            label={t(
              "settings.gym.facilities.description",
              "Description (Optional)",
            )}
            placeholder={t(
              "settings.gym.facilities.descriptionPlaceholder",
              "Briefly describe the purpose or equipment.",
            )}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              loading={isLoading}
              disabled={!formData.name}
              icon={<Check className="w-4 h-4" />}
            >
              {editingId
                ? t("common.update", "Update")
                : t("common.add", "Add")}
            </Button>
            <Button
              variant="outline"
              onClick={resetForm}
              icon={<X className="w-4 h-4" />}
            >
              {t("common.cancel", "Cancel")}
            </Button>
          </div>
        </div>
      )}

      {/* Facilities List */}
      <div className="grid grid-cols-1 gap-4">
        {facilities.map((facility) => (
          <div
            key={facility._id}
            className="group p-5 bg-surface rounded-xl border border-border hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="p-2.5 rounded-lg bg-surface-hover border border-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                  <Building2 className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                    {facility.name}
                  </h4>
                  {facility.description && (
                    <p className="text-sm text-text-secondary mt-1">
                      {facility.description}
                    </p>
                  )}
                  {facility.capacity && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-text-secondary">
                      <Users className="w-3.5 h-3.5" />
                      <span>
                        {t(
                          "settings.gym.facilities.capacityLimit",
                          "Up to {{count}} people",
                          { count: facility.capacity },
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleStartEdit(facility)}
                  className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title={t("common.edit", "Edit")}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onRemove(facility._id)}
                  className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  title={t("common.delete", "Delete")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {facilities.length === 0 && !isAdding && (
          <div className="text-center py-12 bg-surface-hover rounded-2xl border-2 border-dashed border-border mt-2">
            <div className="p-3 bg-surface rounded-full w-fit mx-auto mb-4 border border-border">
              <Building2 className="w-6 h-6 text-text-secondary opacity-50" />
            </div>
            <h4 className="text-sm font-medium text-text-primary">
              {t(
                "settings.gym.facilities.noFacilities",
                "No facilities added yet",
              )}
            </h4>
            <p className="text-xs text-text-secondary mt-1 max-w-[250px] mx-auto">
              {t(
                "settings.gym.facilities.noFacilitiesDesc",
                "Add rooms or areas to better manage your class schedules.",
              )}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartAdd}
              className="mt-4"
              icon={<Plus className="w-4 h-4" />}
            >
              {t("settings.gym.facilities.addFirst", "Add your first facility")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
