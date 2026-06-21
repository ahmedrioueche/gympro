import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUS,
  uploadApi,
  type ProductCategory,
  type ProductStatus,
} from "@ahmedrioueche/gympro-client";
import { Loader2, Plus, Save, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import TextArea from "../../../../../../../components/ui/TextArea";
import { useModalStore } from "../../../../../../../store/modal";
import { getModalZIndex } from "../../../../../../../hooks/useModalLayer";
import { useCreateProduct, useUpdateProduct } from "../hooks/useStore";

export default function ProductModal() {
  const { t } = useTranslation();
  const { productProps, closeModal, isModalOpen, getStackIndex } =
    useModalStore();

  const isOpen =
    isModalOpen("create-product") || isModalOpen("edit-product");
  const isEdit = isModalOpen("edit-product");
  const stackIndex = Math.max(
    getStackIndex("create-product"),
    getStackIndex("edit-product"),
  );
  const zIndex = getModalZIndex(stackIndex);
  const { product, gymId, onSuccess } = productProps || {};

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: PRODUCT_CATEGORIES[0] as ProductCategory,
    description: "",
    price: 0,
    currency: "DZD",
    quantity: 0,
    sku: "",
    status: PRODUCT_STATUS[0] as ProductStatus,
    notes: "",
    images: [] as string[],
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (product && isEdit) {
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description || "",
        price: product.price,
        currency: product.currency,
        quantity: product.quantity,
        sku: product.sku || "",
        status: product.status,
        notes: product.notes || "",
        images: product.images || [],
      });
    } else if (isOpen) {
      setFormData({
        name: "",
        category: PRODUCT_CATEGORIES[0] as ProductCategory,
        description: "",
        price: 0,
        currency: "DZD",
        quantity: 0,
        sku: "",
        status: PRODUCT_STATUS[0] as ProductStatus,
        notes: "",
        images: [],
      });
    }
  }, [product, isEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymId) return;

    try {
      if (isEdit && product) {
        await updateProduct.mutateAsync({
          gymId,
          id: product._id,
          data: formData as any,
        });
        toast.success(t("store.update.success"));
      } else {
        await createProduct.mutateAsync({
          gymId,
          data: formData as any,
        });
        toast.success(t("store.create.success"));
      }
      onSuccess?.();
      closeModal();
    } catch (error) {
      toast.error(isEdit ? t("store.update.error") : t("store.create.error"));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadApi.uploadFile(file, "image");
      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, res.data!.url],
        }));
        toast.success(t("common.uploadSuccess"));
      } else {
        toast.error(res.message || t("common.uploadFailed"));
      }
    } catch (error) {
      toast.error(t("common.uploadError"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  const formId = "product-form";

  return (
    <BaseModal
      isOpen={isOpen}
      zIndex={zIndex}
      onClose={closeModal}
      icon={Plus}
      title={isEdit ? t("store.editProduct") : t("store.addProduct")}
      maxWidth="max-w-2xl"
      primaryButton={{
        label: isEdit ? t("common.saveChanges") : t("store.addProduct"),
        type: "submit",
        form: formId,
        loading: createProduct.isPending || updateProduct.isPending,
        icon: Save,
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: closeModal,
      }}
    >
      <form id={formId} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <InputField
              label={t("store.form.name")}
              placeholder={t("store.form.namePlaceholder")}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <CustomSelect
              title={t("store.form.category")}
              options={PRODUCT_CATEGORIES.map((cat) => ({
                label: t(`store.categories.${cat}`),
                value: cat,
              }))}
              selectedOption={formData.category}
              onChange={(val) =>
                setFormData({ ...formData, category: val as any })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                type="number"
                label={t("store.form.price")}
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
              />
              <InputField
                label={t("store.form.currency")}
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                type="number"
                label={t("store.form.quantity")}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                disabled={formData.status === "out_of_stock"}
                required={formData.status !== "out_of_stock"}
              />
              <InputField
                label={t("store.form.sku")}
                placeholder={t("store.form.skuPlaceholder")}
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
              />
            </div>

            <CustomSelect
              title={t("store.form.status")}
              options={PRODUCT_STATUS.map((s) => ({
                label: t(`store.status.${s}`),
                value: s,
              }))}
              selectedOption={formData.status}
              onChange={(val) => {
                const status = val as any;
                setFormData((prev) => ({
                  ...prev,
                  status,
                  quantity: status === "out_of_stock" ? 0 : prev.quantity,
                }));
              }}
            />
          </div>

          {/* Description and Images */}
          <div className="space-y-4">
            <TextArea
              label={t("store.form.description")}
              placeholder={t("store.form.descriptionPlaceholder")}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                {t("store.form.images")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {formData.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-danger text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddImageClick}
                  disabled={uploading}
                  className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Plus className="w-6 h-6" />
                  )}
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <TextArea
              label={t("store.form.notes")}
              value={formData.notes}
              placeholder={t("store.form.notesPlaceholder")}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
            />
          </div>
        </div>
      </form>
    </BaseModal>
  );
}
