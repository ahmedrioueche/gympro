import {
  type CreateSubscriptionTypeDto,
  type SubscriptionType,
} from "@ahmedrioueche/gympro-client";
import { DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import { PricingForm } from "./PricingForm";

interface CreatePricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubscriptionTypeDto) => Promise<void>;
  isLoading?: boolean;
}

export const CreatePricingModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreatePricingModalProps) => {
  const { t } = useTranslation();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("pricing.addPlan")}
      icon={DollarSign}
      maxWidth="max-w-2xl"
      primaryButton={{
        label: t("common.create"),
        type: "submit",
        form: "create-pricing-form",
        loading: isLoading,
      }}
    >
      <PricingForm formId="create-pricing-form" onSubmit={onSubmit} />
    </BaseModal>
  );
};

interface EditPricingModalProps {
  plan: SubscriptionType | null;
  onClose: () => void;
  onSubmit: (id: string, data: CreateSubscriptionTypeDto) => Promise<void>;
  isLoading?: boolean;
}

export const EditPricingModal = ({
  plan,
  onClose,
  onSubmit,
  isLoading,
}: EditPricingModalProps) => {
  const { t } = useTranslation();

  if (!plan) return null;

  return (
    <BaseModal
      isOpen={!!plan}
      onClose={onClose}
      title={t("pricing.editPlan")}
      subtitle={
        plan.customName ||
        (plan.services && plan.services.length > 0
          ? plan.services
              .map((s) => t(`settings.gym.services.${s}`, s))
              .join(", ")
          : t("pricing.form.regularPlan", "Regular Plan"))
      }
      icon={DollarSign}
      maxWidth="max-w-2xl"
      primaryButton={{
        label: t("common.save"),
        type: "submit",
        form: "edit-pricing-form",
        loading: isLoading,
      }}
    >
      <PricingForm
        formId="edit-pricing-form"
        defaultValues={{
          customName: plan.customName,
          description: plan.description,
          isAvailable: plan.isAvailable,
          services: plan.services || [],
        }}
        initialTiers={plan.pricingTiers}
        onSubmit={(data) => onSubmit(plan._id, data)}
      />
    </BaseModal>
  );
};
