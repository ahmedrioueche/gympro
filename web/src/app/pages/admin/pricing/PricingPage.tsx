import { DollarSign, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../components/ui/Error";
import Tab from "../../../../components/ui/Tab";
import { useModalStore } from "../../../../store/modal";
import PageHeader from "../../../components/PageHeader";
import FeaturePackagesTab from "./components/feature-packages-tab/FeaturePackagesTab";
import PlansTable from "./components/PlansTable";
import { usePlans } from "./hooks/usePlans";

export default function PricingPage() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const [activeTab, setActiveTab] = useState<"plans" | "packages">("plans");
  const { error } = usePlans();

  const handleCreatePlan = () => {
    openModal("edit_app_plan", { plan: null });
  };

  const handleCreatePackage = () => {
    openModal("feature_package", { pkg: null });
  };

  if (error) return <ErrorComponent />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("admin.pricing.title", "Pricing Management")}
        subtitle={t(
          "admin.pricing.description",
          "Manage subscription plans, pricing, and feature groupings",
        )}
        icon={DollarSign}
        actionButton={
          activeTab === "plans"
            ? {
                label: t("admin.pricing.createPlan", "Create Plan"),
                onClick: handleCreatePlan,
                icon: Plus,
              }
            : {
                label: t("admin.pricing.createPackage", "Create Package"),
                onClick: handleCreatePackage,
                icon: Plus,
              }
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6">
        <Tab
          label={t("admin.pricing.plans", "Pricing Plans")}
          isActive={activeTab === "plans"}
          onClick={() => setActiveTab("plans")}
        />
        <Tab
          label={t("admin.pricing.packages", "Marketable Packages")}
          isActive={activeTab === "packages"}
          onClick={() => setActiveTab("packages")}
        />
      </div>

      {activeTab === "plans" ? <PlansTable /> : <FeaturePackagesTab />}
    </div>
  );
}
