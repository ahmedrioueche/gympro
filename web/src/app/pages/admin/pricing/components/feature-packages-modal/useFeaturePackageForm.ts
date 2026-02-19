import {
  adminApi,
  GymManagerFeature,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../../../store/modal";

export function useFeaturePackageForm() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { currentModal, featurePackageProps, closeModal, openModal } =
    useModalStore();

  const isOpen = currentModal === "feature_package";
  const pkg = featurePackageProps?.pkg;
  const isEdit = !!pkg;

  const [formData, setFormData] = useState({
    name: "",
    localizedName: {} as Record<AppLanguage, string>,
    features: [] as GymManagerFeature[],
    order: 0,
    isActive: true,
  });

  const [isTranslating, setIsTranslating] = useState(false);

  // Fetch all packages to check for feature overlap
  const { data: allPackagesRes } = useQuery({
    queryKey: ["adminFeaturePackages"],
    queryFn: async () => {
      const res = await adminApi.getFeaturePackages();
      return Array.isArray(res) ? res : (res as any).data;
    },
    enabled: isOpen,
  });

  const allPackages = allPackagesRes || [];

  // Features already assigned to other packages (mapping feature -> package name)
  const takenFeaturesMap = allPackages
    .filter((p: any) => p._id !== pkg?._id)
    .reduce((acc: Record<string, string>, p: any) => {
      (p.features || []).forEach((f: string) => {
        acc[f] = p.name;
      });
      return acc;
    }, {});

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name,
        localizedName: pkg.localizedName || ({} as Record<AppLanguage, string>),
        features: pkg.features || [],
        order: pkg.order || 0,
        isActive: pkg.isActive !== false,
      });
    } else {
      const initialLocalized = {} as Record<AppLanguage, string>;
      SUPPORTED_LANGUAGES.forEach((lang) => {
        initialLocalized[lang] = "";
      });
      setFormData({
        name: "",
        localizedName: initialLocalized,
        features: [],
        order: 0,
        isActive: true,
      });
    }
  }, [pkg, isOpen]);

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => adminApi.createFeaturePackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFeaturePackages"] });
      toast.success(
        t("admin.pricing.packageCreated", "Package created successfully"),
      );
      closeModal();
    },
    onError: () => toast.error(t("common.error_occurred")),
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      adminApi.updateFeaturePackage(pkg!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFeaturePackages"] });
      toast.success(
        t("admin.pricing.packageUpdated", "Package updated successfully"),
      );
      closeModal();
    },
    onError: () => toast.error(t("common.error_occurred")),
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminApi.deleteFeaturePackage(pkg!._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFeaturePackages"] });
      toast.success(
        t("admin.pricing.packageDeleted", "Package deleted successfully"),
      );
      closeModal();
    },
    onError: () => toast.error(t("common.error_occurred")),
  });

  const handleTranslate = async () => {
    const sourceName = formData.localizedName.en || formData.name;

    if (!sourceName) {
      toast.error(
        t("admin.pricing.enterNameFirst", "Please enter a name first"),
      );
      return;
    }

    setIsTranslating(true);
    try {
      const { aiApi } = await import("@ahmedrioueche/gympro-client");
      const prompt = `Translate the following gym management feature package name into English, French, and Arabic. Return ONLY a JSON object with keys "en", "fr", "ar".\nName: "${sourceName}"`;

      const res = await aiApi.getResponse(prompt);
      if (res.data) {
        // Clean up potential markdown formatting from AI response
        const jsonStr = res.data.replace(/```json|```/g, "").trim();
        const translations = JSON.parse(jsonStr);

        setFormData((prev) => ({
          ...prev,
          localizedName: translations,
        }));
        toast.success(
          t("admin.pricing.translationSuccess", "Translations generated"),
        );
      }
    } catch (error) {
      console.error("AI Translation error:", error);
      toast.error(t("admin.pricing.translationError", "Translation failed"));
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleFeature = (feature: GymManagerFeature) => {
    if (takenFeaturesMap[feature] && !formData.features.includes(feature)) {
      toast.error(
        t(
          "admin.pricing.featureAlreadyTaken",
          "This feature is already assigned to the '{{packageName}}' package",
          { packageName: takenFeaturesMap[feature] },
        ),
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error(t("admin.pricing.nameRequired", "Name is required"));
      return;
    }
    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const setFormDataField = (field: string, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name") {
        next.localizedName = { ...prev.localizedName, en: value };
      }
      return next;
    });
  };

  return {
    isOpen,
    isEdit,
    pkg,
    formData,
    setFormDataField,
    isTranslating,
    handleTranslate,
    toggleFeature,
    handleSave,
    isPending: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    handleDelete: () => {
      openModal("confirm", {
        title: t("admin.pricing.deletePackageTitle", "Delete Feature Package?"),
        text: t(
          "admin.pricing.deletePackageText",
          "Are you sure you want to delete this feature package? This will unassign its features and they will become available for other packages.",
        ),
        confirmText: t("common.delete", "Delete"),
        confirmVariant: "danger",
        onConfirm: () => deleteMutation.mutate(),
      });
    },
    takenFeaturesMap,
    closeModal,
    t,
  };
}
