import { type SubscriptionType } from "@ahmedrioueche/gympro-client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../../../../store/modal";
import { useGymServices } from "./useGymServices";
import {
  useManageSubscriptionType,
  useSubscriptionTypes,
} from "./useSubscriptionTypes";

export type TabType = "services" | "pricing";

export const usePricingPage = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const [activeTab, setActiveTab] = useState<TabType>("services");

  // Pricing Data
  const {
    data: plans,
    isLoading: isLoadingPlans,
    error,
    refetch: refetchPlans,
  } = useSubscriptionTypes();
  const { deleteSubscriptionType } = useManageSubscriptionType();

  // Services Data
  const { services, handleEditService, handleDeleteService } = useGymServices();

  const handleOpenPricingModal = (
    mode: "create" | "edit",
    plan?: SubscriptionType,
  ) => {
    openModal("pricing", {
      mode,
      plan,
      onSuccess: () => refetchPlans(),
    });
  };

  const handleDeletePlan = async (plan: SubscriptionType) => {
    openModal("confirm", {
      title: t("pricing.confirmDelete.title", "Delete Plan?"),
      text: t(
        "pricing.confirmDelete.message",
        "Are you sure you want to delete this pricing plan? This action cannot be undone.",
      ),
      confirmText: t("common.delete"),
      confirmVariant: "danger",
      onConfirm: () => {
        deleteSubscriptionType(plan._id);
      },
    });
  };

  const handleRemoveService = (service: string) => {
    openModal("confirm", {
      title: t("services.confirmDelete.title", "Delete Service?"),
      text: t(
        "services.confirmDelete.message",
        "Are you sure you want to delete this service? It may affect existing classes or plans.",
      ),
      confirmText: t("common.delete"),
      confirmVariant: "danger",
      onConfirm: () => {
        handleDeleteService(service);
      },
    });
  };

  const getPageHeaderAction = () => {
    if (activeTab === "services") {
      return {
        label: t("services.add", "Add Service"),
        icon: Plus,
        onClick: () => openModal("service", { mode: "create" }),
      };
    }
    return {
      label: t("pricing.addPlan"),
      icon: Plus,
      onClick: () => handleOpenPricingModal("create"),
    };
  };

  return {
    t,
    activeTab,
    setActiveTab,
    plans,
    isLoadingPlans,
    error,
    services,
    handleEditService,
    handleDeleteService: handleRemoveService,
    handleOpenPricingModal,
    handleDeletePlan,
    getPageHeaderAction,
  };
};
