import {
  type CreateSubscriptionTypeDto,
  type SubscriptionType,
} from "@ahmedrioueche/gympro-client";
import { DollarSign, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../components/ui/Error";
import Loading from "../../../../../../components/ui/Loading";
import PageHeader from "../../../../../components/PageHeader";
import { PricingCard } from "./components/PricingCard";
import {
  CreatePricingModal,
  EditPricingModal,
} from "./components/PricingModals";
import {
  useManageSubscriptionType,
  useSubscriptionTypes,
} from "./hooks/useSubscriptionTypes";

function PricingPage() {
  const { t } = useTranslation();
  const { data: plans, isLoading, error } = useSubscriptionTypes();
  const {
    createSubscriptionType,
    updateSubscriptionType,
    deleteSubscriptionType,
    isCreating,
    isUpdating,
    isDeleting,
  } = useManageSubscriptionType();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionType | null>(null);

  const handleCreate = async (data: CreateSubscriptionTypeDto) => {
    await createSubscriptionType(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdate = async (id: string, data: CreateSubscriptionTypeDto) => {
    await updateSubscriptionType({ id, dto: data });
    setEditingPlan(null);
  };

  const handleDelete = async (plan: SubscriptionType) => {
    if (window.confirm(t("pricing.confirmDelete.message"))) {
      await deleteSubscriptionType(plan._id);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorComponent error={error.message} />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title={t("pricing.title")}
        subtitle={t("pricing.subtitle")}
        icon={DollarSign}
        actionButton={{
          label: t("pricing.addPlan"),
          icon: Plus,
          onClick: () => setIsCreateModalOpen(true),
        }}
      />

      {plans?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface border border-border rounded-xl">
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {t("pricing.noPlans.title")}
          </h3>
          <p className="text-zinc-400 mb-6">{t("pricing.noPlans.subtitle")}</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
          >
            {t("pricing.addPlan")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans?.map((plan) => (
            <PricingCard
              key={plan._id}
              plan={plan}
              onEdit={setEditingPlan}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreatePricingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />

      <EditPricingModal
        plan={editingPlan}
        onClose={() => setEditingPlan(null)}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
      />
    </div>
  );
}

export default PricingPage;
