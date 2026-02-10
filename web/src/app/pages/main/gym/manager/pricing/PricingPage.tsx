import { DollarSign, Dumbbell, Edit2, Trash2 } from "lucide-react";
import ErrorComponent from "../../../../../../components/ui/Error";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import Tab from "../../../../../../components/ui/Tab";
import PageHeader from "../../../../../components/PageHeader";
import { PricingCard } from "./components/PricingCard";
import { usePricingPage } from "./hooks/usePricingPage";

function PricingPage() {
  const {
    t,
    activeTab,
    setActiveTab,
    plans,
    isLoadingPlans,
    error,
    services,
    handleEditService,
    handleDeleteService,
    handleOpenPricingModal,
    handleDeletePlan,
    getPageHeaderAction,
  } = usePricingPage();

  if (isLoadingPlans) {
    return (
      <div className="space-y-8">
        <PageHeader
          title={t("pricing.title")}
          subtitle={t("pricing.subtitle")}
          icon={DollarSign}
        />
        <Loading />
      </div>
    );
  }

  if (error) return <ErrorComponent error={error.message} />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title={t("pricing.title")}
        subtitle={t("pricing.subtitle")}
        icon={DollarSign}
        actionButton={getPageHeaderAction()}
      />

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        <Tab
          label={t("settings.gym.tabs.services", "Services")}
          isActive={activeTab === "services"}
          onClick={() => setActiveTab("services")}
        />
        <Tab
          label={t("pricing.tab", "Pricing Plans")}
          isActive={activeTab === "pricing"}
          onClick={() => setActiveTab("pricing")}
          count={plans?.length}
        />
      </div>

      {/* Services Tab Content */}
      {activeTab === "services" && (
        <div className="space-y-6">
          {services.length === 0 ? (
            <NoData
              icon={Dumbbell}
              title={t("services.noData.title", "No Services Added")}
              description={t(
                "services.noData.desc",
                "Add services like 'Gym Access', 'Yoga', or 'Sauna' to get started.",
              )}
              actionButton={getPageHeaderAction()}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service}
                  className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between group hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-text-primary">
                      {service}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditService(service)}
                      className="p-2 hover:bg-background rounded-lg text-text-secondary hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service)}
                      className="p-2 hover:bg-red-50 rounded-lg text-text-secondary hover:text-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pricing Tab Content */}
      {activeTab === "pricing" && (
        <>
          {plans?.length === 0 ? (
            <NoData
              icon={DollarSign}
              title={t("pricing.noPlans.title")}
              description={t("pricing.noPlans.subtitle")}
              actionButton={getPageHeaderAction()}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans?.map((plan) => (
                <PricingCard
                  key={plan._id}
                  plan={plan}
                  onEdit={(p) => handleOpenPricingModal("edit", p)}
                  onDelete={handleDeletePlan}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PricingPage;
