import { Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Tab from "../../../../../../components/ui/Tab";
import PageHeader from "../../../../../components/PageHeader";
import { useActiveClients } from "../../../coach/clients/hooks/useActiveClients";
import { usePendingRequests } from "../../../coach/clients/hooks/usePendingRequests";
import { GymActiveClientsSection } from "./components/GymActiveClientsSection";
import { GymMembersSection } from "./components/GymMembersSection";
import { ReceivedRequestsSection } from "./components/ReceivedRequestsSection";
import { SentRequestsSection } from "./components/SentRequestsSection";
import { useGymMembers } from "./hooks/useGymMembers";
import { useSentRequests } from "./hooks/useSentRequests";

export default function ClientsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(0);

  // Fetch data for counts
  const { data: activeClients = [] } = useActiveClients();
  const { data: receivedRequests = [] } = usePendingRequests();
  const { data: sentRequests = [] } = useSentRequests();
  const { data: gymMembers = [] } = useGymMembers();

  // Filtration logic: exclude those who have a pending or active relationship
  const excludedUserIds = useMemo(() => {
    const activeIds = activeClients.map((c) => c.userId);
    const receivedIds = receivedRequests.map((r) => r.memberId);
    const sentIds = sentRequests.map((r) => r.memberId);
    return new Set([...activeIds, ...receivedIds, ...sentIds]);
  }, [activeClients, receivedRequests, sentRequests]);

  const filteredGymMembers = useMemo(() => {
    return gymMembers.filter((m) => !excludedUserIds.has(m.userId));
  }, [gymMembers, excludedUserIds]);

  const tabs = [
    {
      id: 0,
      label: `${t("coach.clients.tabs.active")} (${activeClients.length})`,
    },
    {
      id: 1,
      label: `${t("coach.clients.tabs.gymMembers")} (${filteredGymMembers.length})`,
    },
    {
      id: 2,
      label: `${t("coach.clients.tabs.receivedRequests")} (${receivedRequests.length})`,
    },
    {
      id: 3,
      label: `${t("coach.clients.tabs.sentRequests")} (${sentRequests.length})`,
    },
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
        {activeTab === 1 && <GymMembersSection members={filteredGymMembers} />}
        {activeTab === 2 && <ReceivedRequestsSection />}
        {activeTab === 3 && <SentRequestsSection />}
      </div>
    </div>
  );
}
