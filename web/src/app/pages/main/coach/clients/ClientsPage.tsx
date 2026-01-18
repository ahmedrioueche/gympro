import { Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Tab from "../../../../../components/ui/Tab";
import PageHeader from "../../../../components/PageHeader";
import { ActiveClientsSection } from "./components/ActiveClientsSection";
import { PendingRequestsSection } from "./components/PendingRequestsSection";
import { ProspectiveMembersSection } from "./components/ProspectiveMembersSection";

export default function ClientsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    { id: 0, label: t("coach.clients.tabs.active") },
    { id: 1, label: t("coach.clients.tabs.pending") },
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
            <Tab
              key={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 0 && <ActiveClientsSection />}
        {activeTab === 1 && <PendingRequestsSection />}
        {activeTab === 2 && <ProspectiveMembersSection />}
      </div>
    </div>
  );
}
