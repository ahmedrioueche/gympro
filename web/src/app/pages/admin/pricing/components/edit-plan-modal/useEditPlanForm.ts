import {
  adminApi,
  type CreateAppPlanDto,
  type UpdateAppPlanDto,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../../../store/modal";

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
  featurePackages: [],
  publicFeaturePackages: [],
};

export function useEditPlanForm() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { currentModal, closeModal, editAppPlanProps } = useModalStore();
  const [formData, setFormData] = useState<CreateAppPlanDto>(initialPlanState);

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
        featurePackages: (plan.featurePackages || []).map((p: any) =>
          typeof p === "string" ? p : p._id,
        ),
        publicFeaturePackages: (plan.publicFeaturePackages || []).map(
          (p: any) => (typeof p === "string" ? p : p._id),
        ),
      } as CreateAppPlanDto);
    } else if (isOpen) {
      setFormData(initialPlanState);
    }

    // No cleanup needed for features
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

  const togglePackageVisibility = (pkgId: string) => {
    setFormData((prev) => {
      const currentPublic = (prev as any).publicFeaturePackages || [];
      const isPublic = currentPublic.includes(pkgId);
      const newPublic = isPublic
        ? currentPublic.filter((id: string) => id !== pkgId)
        : [...currentPublic, pkgId];

      return {
        ...prev,
        publicFeaturePackages: newPublic,
      };
    });
  };

  const { data: allPackages = [] } = useQuery({
    queryKey: ["adminFeaturePackages"],
    queryFn: async () => {
      const res = await adminApi.getFeaturePackages();
      return Array.isArray(res) ? res : (res as any).data;
    },
    enabled: isOpen,
  });

  const togglePackage = (pkgId: string) => {
    setFormData((prev) => {
      const currentPackages = prev.featurePackages || [];
      const isSelected = currentPackages.includes(pkgId);
      const newPackages = isSelected
        ? currentPackages.filter((id) => id !== pkgId)
        : [...currentPackages, pkgId];

      return {
        ...prev,
        featurePackages: newPackages,
        publicFeaturePackages: (prev as any).publicFeaturePackages?.filter(
          (id: string) => newPackages.includes(id),
        ),
      };
    });
  };

  return {
    isOpen,
    isEdit,
    closeModal,
    formData,
    setFormData,
    savePlan,
    isPending,
    isDeleting,
    handleDelete,
    handlePricingChange,
    handleLimitChange,
    togglePackage,
    togglePackageVisibility,
    allPackages,
    t,
  };
}
