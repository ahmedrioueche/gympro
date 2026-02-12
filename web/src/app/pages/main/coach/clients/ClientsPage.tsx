import { Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Tab from "../../../../../components/ui/Tab";
import PageHeader from "../../../../components/PageHeader";
import { ActiveClientsSection } from "./components/ActiveClientsSection";
import { PendingRequestsSection } from "./components/PendingRequestsSection";
import { ProspectiveMembersSection } from "./components/ProspectiveMembersSection";
import { useActiveClients } from "./hooks/useActiveClients";
import { usePendingRequests } from "./hooks/usePendingRequests";
import { useProspectiveMembers } from "./hooks/useProspectiveMembers";

export default function ClientsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(0);

  // Fetch data for counts
  const { data: activeClients = [] } = useActiveClients();
  const { data: pendingRequests = [] } = usePendingRequests();
  const { data: prospectiveMembers = [] } = useProspectiveMembers();

  // Get IDs of people who already have a pending/active relationship
  const excludedUserIds = useMemo(() => {
    const activeIds = activeClients.map((c) => c.userId);
    const pendingIds = pendingRequests.map((r) => r.memberId);
    return new Set([...activeIds, ...pendingIds]);
  }, [activeClients, pendingRequests]);

  // Filtered prospective members
  const filteredProspective = useMemo(() => {
    return prospectiveMembers.filter((m) => !excludedUserIds.has(m.userId));
  }, [prospectiveMembers, excludedUserIds]);

  const tabs = [
    {
      id: 0,
      label: `${t("coach.clients.tabs.active")} (${activeClients.length})`,
    },
    {
      id: 1,
      label: `${t("coach.clients.tabs.pending")} (${pendingRequests.length})`,
    },
    {
      id: 2,
      label: `${t("coach.clients.tabs.prospective")} (${filteredProspective.length})`,
    },
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
        {activeTab === 2 && (
          <ProspectiveMembersSection members={filteredProspective} />
        )}
      </div>
    </div>
  );
}
