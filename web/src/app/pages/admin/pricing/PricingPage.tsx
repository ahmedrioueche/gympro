import {
  appSubscriptionsApi,
  DEFAULT_CURRENCY,
  resolveLocalizedString,
  type AppPlan,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Edit2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../components/ui/Error";
import Loading from "../../../../components/ui/Loading";
import NoData from "../../../../components/ui/NoData";
import Table, { type TableColumn } from "../../../../components/ui/Table";
import { useLanguageStore } from "../../../../store/language";
import { useModalStore } from "../../../../store/modal";
import PageHeader from "../../../components/PageHeader";

export default function PricingPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { openModal } = useModalStore();

  const {
    data: plans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminPlans"],
    queryFn: async () => {
      const res = await appSubscriptionsApi.getAllPlans(true);
      return res.data;
    },
  });

  const handleCreate = () => {
    openModal("edit_app_plan", { plan: null });
  };

  const handleEdit = (plan: AppPlan) => {
    openModal("edit_app_plan", { plan });
  };

  const columns: TableColumn<AppPlan>[] = [
    {
      key: "name",
      header: t("common.name"),
      render: (plan) => (
        <div>
          <div className="flex items-center gap-2">
            <div className="font-medium text-text-primary">
              {resolveLocalizedString(plan.name, language, t)}
            </div>
            {!plan.isActive && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wide">
                {t("common.inactive", "Inactive")}
              </span>
            )}
          </div>
          {plan.description && (
            <div className="text-sm text-text-secondary truncate max-w-xs">
              {resolveLocalizedString(plan.description, language, t)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "level",
      header: t("admin.pricing.level", "Level"),
      render: (plan) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
          {plan.level}
        </span>
      ),
    },
    {
      key: "price",
      header: t("admin.pricing.price", "Price"),
      render: (plan) => (
        <div>
          <div className="text-sm text-text-primary font-medium">
            {plan.pricing?.[DEFAULT_CURRENCY]?.monthly
              ? `${plan.pricing[DEFAULT_CURRENCY]?.monthly} ${DEFAULT_CURRENCY}/mo`
              : "Free"}
          </div>
          {!!plan.pricing?.[DEFAULT_CURRENCY]?.yearly && (
            <div className="text-xs text-text-secondary">
              {plan.pricing[DEFAULT_CURRENCY]?.yearly} {DEFAULT_CURRENCY}/yr
            </div>
          )}
        </div>
      ),
    },
    {
      key: "limits",
      header: t("admin.pricing.limits", "Limits"),
      render: (plan) => (
        <div className="space-y-1 text-sm text-text-secondary">
          <div>
            <span className="font-medium text-text-primary">
              {plan.limits.maxGyms}
            </span>{" "}
            {t("common.gyms")}
          </div>
          <div>
            <span className="font-medium text-text-primary">
              {plan.limits.maxMembers}
            </span>{" "}
            {t("common.members")}
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      align: "right",
      render: (plan) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(plan);
          }}
          className="p-2 text-text-secondary hover:text-primary transition-colors hover:bg-surface-hover rounded-lg"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  if (isLoading)
    return (
      <>
        <PageHeader
          title={t("admin.pricing.title", "Pricing Plans")}
          subtitle={t(
            "admin.pricing.description",
            "Manage subscription plans and pricing",
          )}
          icon={DollarSign}
        />
        <Loading />;
      </>
    );
  if (error) return <ErrorComponent />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("admin.pricing.title", "Pricing Plans")}
        subtitle={t(
          "admin.pricing.description",
          "Manage subscription plans and pricing",
        )}
        actionButton={{
          label: t("admin.pricing.createPlan", "Create Plan"),
          onClick: handleCreate,
          icon: Plus,
        }}
        icon={DollarSign}
      />

      <Table<AppPlan>
        columns={columns}
        data={plans || []}
        keyExtractor={(item) => item._id}
        onRowClick={handleEdit}
        emptyState={
          <NoData
            title={t("admin.pricing.noPlans", "No plans found")}
            icon={DollarSign}
            className=""
          />
        }
      />
    </div>
  );
}
