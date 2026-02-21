import {
  DEFAULT_CURRENCY,
  resolveLocalizedString,
  type AppPlan,
} from "@ahmedrioueche/gympro-client";
import { DollarSign, Edit2, Home, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../components/ui/NoData";
import Table, { type TableColumn } from "../../../../../components/ui/Table";
import { useLanguageStore } from "../../../../../store/language";
import { useModalStore } from "../../../../../store/modal";
import { usePlans } from "../hooks/usePlans";

export default function PlansTable() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { openModal } = useModalStore();
  const { plans, isLoading } = usePlans();

  const handleEditPlan = (plan: AppPlan) => {
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
            {plan.level === "free"
              ? t("admin.pricing.freePlanDuration", {
                  days: plan.trialDays || 30,
                  defaultValue: "Free ({{days}} days)",
                })
              : plan.pricing?.[DEFAULT_CURRENCY]?.monthly
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
          <div className="flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-text-secondary/50" />
            <span className="font-medium text-text-primary">
              {plan.limits.maxGyms === 0 ? "∞" : plan.limits.maxGyms}
            </span>{" "}
            {plan.limits.maxGyms === 0
              ? t("plans.infinite_gyms", "Infinite Gyms")
              : t("common.gyms")}
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-text-secondary/50" />
            <span className="font-medium text-text-primary">
              {plan.limits.maxMembers === 0 ? "∞" : plan.limits.maxMembers}
            </span>{" "}
            {plan.limits.maxMembers === 0
              ? t("plans.infinite_members", "Infinite Members")
              : t("common.members")}
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-text-secondary/50" />
            <span className="font-medium text-text-primary">
              {plan.limits.maxGems === 0 ? "∞" : plan.limits.maxGems}
            </span>{" "}
            {plan.limits.maxGems === 0
              ? t("plans.infinite_gems", "Infinite Gems")
              : t("common.gems")}
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
            handleEditPlan(plan);
          }}
          className="p-2 text-text-secondary hover:text-primary transition-colors hover:bg-surface-hover rounded-lg"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const renderMobileCard = (plan: AppPlan) => (
    <div className="p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-primary truncate">
              {resolveLocalizedString(plan.name, language, t)}
            </span>
            {!plan.isActive && (
              <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wide">
                {t("common.inactive")}
              </span>
            )}
          </div>
          <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">
            {plan.level}
          </span>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-black text-primary">
            {plan.level === "free"
              ? t("admin.pricing.freePlanDuration", {
                  days: plan.trialDays || 30,
                  defaultValue: "Free ({{days}} days)",
                })
              : plan.pricing?.[DEFAULT_CURRENCY]?.monthly
                ? `${plan.pricing[DEFAULT_CURRENCY]?.monthly} ${DEFAULT_CURRENCY}`
                : "Free"}
          </div>
          <div className="text-[10px] text-text-secondary font-medium">
            {plan.pricing?.[DEFAULT_CURRENCY]?.monthly
              ? t("common.per_month")
              : ""}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-secondary border border-border/50">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Home className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {t("common.gyms")}
            </span>
          </div>
          <div className="text-sm font-black text-text-primary">
            {plan.limits.maxGyms === 0 ? "∞" : plan.limits.maxGyms}
          </div>
        </div>
        <div className="space-y-1 border-l border-border/50 pl-3">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Users className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {t("common.members")}
            </span>
          </div>
          <div className="text-sm font-black text-text-primary">
            {plan.limits.maxMembers === 0 ? "∞" : plan.limits.maxMembers}
          </div>
        </div>
        <div className="space-y-1 border-l border-border/50 pl-3">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {t("common.gems")}
            </span>
          </div>
          <div className="text-sm font-black text-text-primary">
            {plan.limits.maxGems === 0 ? "∞" : plan.limits.maxGems}
          </div>
        </div>
      </div>

      <button
        onClick={() => handleEditPlan(plan)}
        className="w-full py-2.5 flex items-center justify-center gap-2 bg-primary/5 text-primary text-xs font-bold rounded-xl border border-primary/10 active:scale-95 transition-all"
      >
        <Edit2 className="w-4 h-4" />
        {t("common.edit")}
      </button>
    </div>
  );

  const renderMobileLoadingSkeleton = () => (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-border rounded w-32" />
          <div className="h-3 bg-border rounded w-16" />
        </div>
        <div className="h-4 bg-border rounded w-20" />
      </div>
      <div className="h-16 bg-border rounded-xl" />
      <div className="h-10 bg-border rounded-xl" />
    </div>
  );

  return (
    <Table<AppPlan>
      columns={columns}
      data={plans || []}
      keyExtractor={(item) => item._id}
      onRowClick={handleEditPlan}
      isLoading={isLoading}
      renderMobileCard={renderMobileCard}
      renderMobileLoadingSkeleton={renderMobileLoadingSkeleton}
      emptyState={
        <NoData
          title={t("admin.pricing.noPlans", "No plans found")}
          icon={DollarSign}
          className=""
        />
      }
    />
  );
}
