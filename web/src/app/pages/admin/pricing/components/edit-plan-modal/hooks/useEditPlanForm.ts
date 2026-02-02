import {
  adminApi,
  aiApi,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
  type CreateAppPlanDto,
  type UpdateAppPlanDto,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../../../../store/language";
import { useModalStore } from "../../../../../../../store/modal";

const initialPlanState: CreateAppPlanDto = {
  planId: "",
  name: "",
  description: "",
  isActive: true,
  level: "starter",
  order: 0,
  pricing: {
    EUR: { monthly: 0, yearly: 0 },
    USD: { monthly: 0, yearly: 0 },
    DZD: { monthly: 0, yearly: 0 },
  },
  limits: {
    maxGyms: 1,
    maxMembers: 100,
    maxGems: 0,
  },
  features: [],
};

const initialFeatureState = SUPPORTED_LANGUAGES.reduce(
  (acc, lng) => {
    acc[lng] = "";
    return acc;
  },
  {} as Record<AppLanguage, string>,
);

export function useEditPlanForm() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { currentModal, closeModal, editAppPlanProps } = useModalStore();
  const { language: currentLang } = useLanguageStore();
  const [formData, setFormData] = useState<CreateAppPlanDto>(initialPlanState);
  const [newFeature, setNewFeature] =
    useState<Record<AppLanguage, string>>(initialFeatureState);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const isOpen = currentModal === "edit_app_plan";
  const plan = editAppPlanProps?.plan;
  const isEdit = !!plan;

  useEffect(() => {
    if (plan && isOpen) {
      setFormData({
        planId: plan.planId,
        name: plan.name,
        description: plan.description,
        isActive: plan.isActive ?? true,
        level: plan.level,
        order: plan.order,
        pricing: plan.pricing,
        limits: plan.limits,
        features: plan.features,
      } as CreateAppPlanDto);
    } else if (isOpen) {
      setFormData(initialPlanState);
    }

    if (!isOpen) {
      setNewFeature(initialFeatureState);
      setEditingIndex(null);
    }
  }, [plan, isOpen]);

  const { mutate: savePlan, isPending } = useMutation({
    mutationFn: async (data: CreateAppPlanDto) => {
      if (isEdit && plan) {
        return adminApi.updatePlan(plan._id, data as UpdateAppPlanDto);
      } else {
        return adminApi.createPlan(data);
      }
    },
    onSuccess: () => {
      toast.success(
        isEdit
          ? t("admin.pricing.updateSuccess", "Plan updated successfully")
          : t("admin.pricing.createSuccess", "Plan created successfully"),
      );
      queryClient.invalidateQueries({ queryKey: ["adminPlans"] });
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.message || t("common.error"));
    },
  });

  const { mutate: deletePlan, isPending: isDeleting } = useMutation({
    mutationFn: adminApi.deletePlan,
    onSuccess: () => {
      toast.success(
        t("admin.pricing.deleteSuccess", "Plan deleted successfully"),
      );
      queryClient.invalidateQueries({ queryKey: ["adminPlans"] });
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.message || t("common.error"));
    },
  });

  const handleDelete = () => {
    if (
      plan &&
      window.confirm(
        t(
          "admin.pricing.confirmDelete",
          "Are you sure you want to delete this plan?",
        ),
      )
    ) {
      deletePlan(plan._id);
    }
  };

  const handlePricingChange = (
    currency: "EUR" | "USD" | "DZD",
    cycle: "monthly" | "yearly",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [currency]: {
          ...prev.pricing[currency],
          [cycle]: parseFloat(value) || 0,
        },
      },
    }));
  };

  const handleLimitChange = (
    field: keyof typeof initialPlanState.limits,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      limits: {
        ...prev.limits,
        [field]: parseInt(value) || 0,
      },
    }));
  };

  const handleAutoTranslate = async () => {
    const sourceText = newFeature[currentLang]?.trim();
    if (!sourceText) {
      toast.error(
        t(
          "admin.pricing.enterBaseFirst",
          "Please enter the base translation first ({{lang}})",
          { lang: currentLang.toUpperCase() },
        ),
      );
      return;
    }

    setIsTranslating(true);
    try {
      const otherLanguages = SUPPORTED_LANGUAGES.filter(
        (l) => l !== currentLang,
      );
      const prompt = `Translate the following gym management software feature from ${currentLang.toUpperCase()} into: ${otherLanguages.join(
        ", ",
      )}. Return ONLY a valid JSON object where keys are the language codes and values are the translations. ${currentLang.toUpperCase()}: ${sourceText}`;

      const res = await aiApi.getResponse(prompt);
      if (res.success && res.data) {
        // Find JSON block in response
        const jsonMatch = res.data.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const translations = JSON.parse(jsonMatch[0]);
          setNewFeature((prev) => ({
            ...prev,
            ...translations,
          }));
          toast.success(t("common.success"));
        } else {
          throw new Error("Invalid AI response format");
        }
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast.error(
        t("admin.pricing.translationError", "Failed to auto-translate feature"),
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const addFeature = () => {
    const hasValue = Object.values(newFeature).some((v) => v.trim());
    if (hasValue) {
      setFormData((prev) => {
        const newFeatures = [...prev.features];
        if (editingIndex !== null) {
          newFeatures[editingIndex] = newFeature as any;
        } else {
          newFeatures.push(newFeature as any);
        }

        return {
          ...prev,
          features: newFeatures,
        };
      });
      setNewFeature(initialFeatureState);
      setEditingIndex(null);
    }
  };

  const startEditFeature = (index: number) => {
    const feature = formData.features[index];
    if (typeof feature === "object" && feature !== null) {
      // It's a localized object
      const editState = { ...initialFeatureState };
      SUPPORTED_LANGUAGES.forEach((lng) => {
        editState[lng] = (feature as any)[lng] || "";
      });
      setNewFeature(editState);
    } else if (typeof feature === "string") {
      // It's a legacy string key
      const editState = { ...initialFeatureState };
      editState.en = feature; // Assuming English as base for legacy keys
      setNewFeature(editState);
    }
    setEditingIndex(index);
  };

  const cancelEdit = () => {
    setNewFeature(initialFeatureState);
    setEditingIndex(null);
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index) as any,
    }));
  };

  return {
    isOpen,
    isEdit,
    closeModal,
    formData,
    setFormData,
    newFeature,
    setNewFeature,
    savePlan,
    isPending,
    isDeleting,
    handleDelete,
    handlePricingChange,
    handleLimitChange,
    addFeature,
    removeFeature,
    startEditFeature,
    cancelEdit,
    editingIndex,
    handleAutoTranslate,
    isTranslating,
    t,
  };
}
