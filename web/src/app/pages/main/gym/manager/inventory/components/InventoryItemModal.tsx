import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_CONDITIONS,
  uploadApi,
  type CreateEquipmentDto,
  type UpdateEquipmentDto,
} from "@ahmedrioueche/gympro-client";
import { Camera, Loader2, Plus, Save, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import TextArea from "../../../../../../../components/ui/TextArea";
import {
  useCreateInventoryItem,
  useUpdateInventoryItem,
} from "../../../../../../../hooks/queries/useInventory";
import { useModalStore } from "../../../../../../../store/modal";

export default function InventoryItemModal() {
  const { t } = useTranslation();
  const { currentModal, inventoryItemProps, closeModal } = useModalStore();
  const isOpen = currentModal === "inventory_item";
  const { gymId, item, onSuccess } = inventoryItemProps || {};
  const isEdit = !!item;

  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(item?.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateEquipmentDto>({
    defaultValues: {
      name: item?.name || "",
      category: item?.category || "other",
      quantity: item?.quantity || 1,
      condition: item?.condition || "good",
      description: item?.description || "",
      brand: item?.brand || "",
      modelNumber: item?.modelNumber || "",
      serialNumber: item?.serialNumber || "",
      purchasePrice: item?.purchasePrice,
      purchaseDate: item?.purchaseDate
        ? new Date(item.purchaseDate).toISOString().split("T")[0]
        : "",
      vendor: item?.vendor || "",
      warrantyExpiry: item?.warrantyExpiry
        ? new Date(item.warrantyExpiry).toISOString().split("T")[0]
        : "",
      lastServiceDate: item?.lastServiceDate
        ? new Date(item.lastServiceDate).toISOString().split("T")[0]
        : "",
      nextServiceDueDate: item?.nextServiceDueDate
        ? new Date(item.nextServiceDueDate).toISOString().split("T")[0]
        : "",
      notes: item?.notes || "",
    },
  });

  const categoryValue = watch("category");
  const conditionValue = watch("condition");

  useEffect(() => {
    if (isOpen && item) {
      reset({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        condition: item.condition,
        description: item.description,
        brand: item.brand,
        modelNumber: item.modelNumber,
        serialNumber: item.serialNumber,
        purchasePrice: item.purchasePrice,
        purchaseDate: item.purchaseDate
          ? new Date(item.purchaseDate).toISOString().split("T")[0]
          : "",
        vendor: item.vendor,
        warrantyExpiry: item.warrantyExpiry
          ? new Date(item.warrantyExpiry).toISOString().split("T")[0]
          : "",
        lastServiceDate: item.lastServiceDate
          ? new Date(item.lastServiceDate).toISOString().split("T")[0]
          : "",
        nextServiceDueDate: item.nextServiceDueDate
          ? new Date(item.nextServiceDueDate).toISOString().split("T")[0]
          : "",
        notes: item.notes,
      });
      setImages(item.images || []);
    } else if (isOpen) {
      reset({
        name: "",
        category: "other",
        quantity: 1,
        condition: "good",
        description: "",
      });
      setImages([]);
    }
  }, [isOpen, item, reset]);

  const createMutation = useCreateInventoryItem();
  const updateMutation = useUpdateInventoryItem();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadApi.uploadFile(file, "image");
      if (res.success && res.data) {
        setImages((prev) => [...prev, res.data!.url]);
        toast.success(
          t("common.uploadSuccess", { defaultValue: "Image uploaded" }),
        );
      } else {
        toast.error(
          res.message ||
            t("common.uploadError", { defaultValue: "Upload failed" }),
        );
      }
    } catch (error) {
      toast.error(t("common.uploadError", { defaultValue: "Upload failed" }));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateEquipmentDto) => {
    if (!gymId) return;

    const payload = { ...data, images };

    try {
      if (isEdit && item) {
        await updateMutation.mutateAsync({
          gymId,
          itemId: item._id,
          data: payload as UpdateEquipmentDto,
        });
        toast.success(
          t("inventory.updateSuccess", {
            defaultValue: "Equipment updated successfully",
          }),
        );
      } else {
        await createMutation.mutateAsync({ gymId, data: payload });
        toast.success(
          t("inventory.createSuccess", {
            defaultValue: "Equipment added successfully",
          }),
        );
      }
      onSuccess?.();
      closeModal();
    } catch (error: any) {
      toast.error(
        error.message ||
          t("common.error", { defaultValue: "Something went wrong" }),
      );
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={
        isEdit
          ? t("inventory.modal.editTitle", { defaultValue: "Edit Equipment" })
          : t("inventory.modal.createTitle", {
              defaultValue: "Add New Equipment",
            })
      }
      maxWidth="max-w-3xl"
      icon={Plus}
      primaryButton={{
        label: isEdit
          ? t("common.saveChanges", { defaultValue: "Save Changes" })
          : t("inventory.form.addEquipment", { defaultValue: "Add Equipment" }),
        type: "submit",
        form: "inventory-item-form",
        loading: createMutation.isPending || updateMutation.isPending,
        icon: Save,
      }}
      secondaryButton={{
        label: t("common.cancel", { defaultValue: "Cancel" }),
        onClick: closeModal,
      }}
    >
      <form
        id="inventory-item-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Images Selection */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">
            {t("inventory.form.images", { defaultValue: "Equipment Images" })}
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative w-24 h-24 rounded-xl border border-border overflow-hidden group"
              >
                <img
                  src={img}
                  className="w-full h-full object-cover"
                  alt="Equipment"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-24 h-24  rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-text-secondary hover:text-primary"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Camera className="w-6 h-6" />
              )}
              <span className="text-[10px] font-bold uppercase">
                {t("common.add", { defaultValue: "Add" })}
              </span>
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={t("inventory.form.name", { defaultValue: "Equipment Name" })}
            {...register("name", { required: true })}
            error={errors.name?.message}
            placeholder="e.g. Treadmill X100"
          />
          <CustomSelect
            title={t("inventory.form.category", { defaultValue: "Category" })}
            options={EQUIPMENT_CATEGORIES.map((cat) => ({
              value: cat,
              label: t(`inventory.categories.${cat}`, { defaultValue: cat }),
            }))}
            selectedOption={categoryValue}
            onChange={(val) => setValue("category", val as any)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label={t("inventory.form.quantity", { defaultValue: "Quantity" })}
            type="number"
            {...register("quantity", { required: true, valueAsNumber: true })}
            error={errors.quantity?.message}
            placeholder="1"
          />
          <CustomSelect
            title={t("inventory.form.condition", { defaultValue: "Condition" })}
            options={EQUIPMENT_CONDITIONS.map((cond) => ({
              value: cond,
              label: t(`inventory.conditions.${cond}`, {
                defaultValue: cond.replace("_", " "),
              }),
            }))}
            selectedOption={conditionValue}
            onChange={(val) => setValue("condition", val as any)}
          />
          <InputField
            label={t("inventory.form.brand", { defaultValue: "Brand" })}
            {...register("brand")}
            placeholder="e.g. Life Fitness"
          />
        </div>

        <TextArea
          label={t("inventory.form.description", {
            defaultValue: "Description",
          })}
          {...register("description")}
          rows={3}
          placeholder="Describe the machine, its features, or usage instructions..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest">
              {t("inventory.form.specsHeader", {
                defaultValue: "Technical Specs & IDs",
              })}
            </h4>
            <InputField
              label={t("inventory.form.modelNumber", {
                defaultValue: "Model Number",
              })}
              {...register("modelNumber")}
              placeholder="e.g. TX-4000"
            />
            <InputField
              label={t("inventory.form.serialNumber", {
                defaultValue: "Serial Number",
              })}
              {...register("serialNumber")}
              placeholder="e.g. SN12345678"
            />
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest">
              {t("inventory.form.managementHeader", {
                defaultValue: "Purchase & Warranty",
              })}
            </h4>
            <InputField
              label={t("inventory.form.purchasePrice", {
                defaultValue: "Purchase Price",
              })}
              type="number"
              step="0.01"
              {...register("purchasePrice", { valueAsNumber: true })}
              placeholder="0.00"
            />
            <InputField
              label={t("inventory.form.purchaseDate", {
                defaultValue: "Purchase Date",
              })}
              type="date"
              {...register("purchaseDate")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label={t("inventory.form.vendor", { defaultValue: "Vendor" })}
                {...register("vendor")}
                placeholder="e.g. Fitness Gear Co."
              />
              <InputField
                label={t("inventory.form.warrantyExpiry", {
                  defaultValue: "Warranty Expiry",
                })}
                type="date"
                {...register("warrantyExpiry")}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest">
              {t("inventory.form.maintenanceHeader", {
                defaultValue: "Maintenance Schedule",
              })}
            </h4>
            <InputField
              label={t("inventory.form.lastServiceDate", {
                defaultValue: "Last Service Date",
              })}
              type="date"
              {...register("lastServiceDate")}
            />
            <InputField
              label={t("inventory.form.nextServiceDueDate", {
                defaultValue: "Next Service Due",
              })}
              type="date"
              {...register("nextServiceDueDate")}
            />
          </div>
          <div className="flex flex-col h-full">
            <h4 className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">
              {t("inventory.form.additionalNotes", {
                defaultValue: "Internal Notes",
              })}
            </h4>
            <div className="flex-1">
              <TextArea
                {...register("notes")}
                rows={6}
                placeholder="e.g. Contact technician @ 123-456 if error code E01 appears..."
                className="h-[calc(100%-2rem)]"
              />
            </div>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}
