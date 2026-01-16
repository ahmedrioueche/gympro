import { Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../../../components/PageHeader";
import { ActiveClientsSection } from "./components/ActiveClientsSection";
import { PendingRequestsSection } from "./components/PendingRequestsSection";
import { ProspectiveMembersSection } from "./components/ProspectiveMembersSection";

export default function ClientsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    { id: 0, label: t("coach.clients.tabs.pending") },
    { id: 1, label: t("coach.clients.tabs.active") },
    { id: 2, label: t("coach.clients.tabs.prospective") },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("coach.clients.title")}
        subtitle={t("coach.clients.subtitle")}
        icon={Users}
      />

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-hover"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 0 && <PendingRequestsSection />}
        {activeTab === 1 && <ActiveClientsSection />}
        {activeTab === 2 && <ProspectiveMembersSection />}
      </div>
    </div>
  );
}
