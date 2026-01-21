import type { CoachPricingTier } from "@ahmedrioueche/gympro-client";
import { DollarSign, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../components/ui/Error";
import Loading from "../../../../../components/ui/Loading";
import NoData from "../../../../../components/ui/NoData";
import { useModalStore } from "../../../../../store/modal";
import PageHeader from "../../../../components/PageHeader";
import { PricingCard } from "./components/PricingCard";
import { useCoachPricing, useDeletePricing } from "./hooks/useCoachPricing";

export default function PricingPage() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { data: pricingList, isLoading, error } = useCoachPricing();
  const deleteMutation = useDeletePricing();
  const hasPricing = pricingList && pricingList.length > 0;

  const handleAddPricing = () => {
    openModal("coach_pricing", { onSuccess: () => {} });
  };

  const handleEditPricing = (pricing: CoachPricingTier) => {
    openModal("coach_pricing", { pricingId: pricing._id, onSuccess: () => {} });
  };

  const handleDeletePricing = (pricing: CoachPricingTier) => {
    openModal("confirm", {
      title: t("coachPricing.deletePricing"),
      text: t("coachPricing.deletePricingConfirm"),
      confirmVariant: "danger",
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(pricing._id);
          toast.success(t("coachPricing.pricingDeleted"));
        } catch {
          toast.error(t("status.error.coach.pricing_delete_error"));
        }
      },
    });
  };

  if (isLoading) {
    return (
      <>
        <PageHeader
          icon={DollarSign}
          title={t("coachPricing.title")}
          subtitle={t("coachPricing.subtitle")}
          actionButton={
            hasPricing
              ? {
                  label: t("coachPricing.addPricing"),
                  onClick: handleAddPricing,
                  icon: Plus,
                }
              : undefined
          }
        />
        <Loading />;
      </>
    );
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={DollarSign}
        title={t("coachPricing.title")}
        subtitle={t("coachPricing.subtitle")}
        actionButton={
          hasPricing
            ? {
                label: t("coachPricing.addPricing"),
                onClick: handleAddPricing,
                icon: Plus,
              }
            : undefined
        }
      />

      {hasPricing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingList.map((pricing) => (
            <PricingCard
              key={pricing._id}
              pricing={pricing}
              onEdit={handleEditPricing}
              onDelete={handleDeletePricing}
            />
          ))}
        </div>
      ) : (
        <NoData
          icon={DollarSign}
          title={t("coachPricing.noPricing")}
          description={t("coachPricing.noPricingDesc")}
          actionButton={{
            label: t("coachPricing.addPricing"),
            onClick: handleAddPricing,
            icon: Plus,
          }}
        />
      )}
    </div>
  );
}
