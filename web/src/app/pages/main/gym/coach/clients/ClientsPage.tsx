import { Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Tab from "../../../../../../components/ui/Tab";
import PageHeader from "../../../../../components/PageHeader";
import { GymActiveClientsSection } from "./components/GymActiveClientsSection";
import { GymMembersSection } from "./components/GymMembersSection";
import { ReceivedRequestsSection } from "./components/ReceivedRequestsSection";
import { SentRequestsSection } from "./components/SentRequestsSection";

export default function ClientsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    { id: 0, label: t("coach.clients.tabs.active") },
    { id: 1, label: t("coach.clients.tabs.gymMembers") },
    {
      id: 2,
      label: t("coach.clients.tabs.receivedRequests"),
    },
    { id: 3, label: t("coach.clients.tabs.sentRequests") },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <PageHeader
        title={t("coach.clients.title")}
        subtitle={t("coach.clients.subtitle")}
        icon={Users}
      />

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          {tabs.map((tab) => (
            <div key={tab.id} className="whitespace-nowrap">
              <Tab
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 0 && <GymActiveClientsSection />}
        {activeTab === 1 && <GymMembersSection />}
        {activeTab === 2 && <ReceivedRequestsSection />}
        {activeTab === 3 && <SentRequestsSection />}
      </div>
    </div>
  );
}
