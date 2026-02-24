import { ChevronDown, Users } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const activeTabLabel = tabs.find((t) => t.id === activeTab)?.label;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <PageHeader
        title={t("coach.clients.title")}
        subtitle={t("coach.clients.subtitle")}
        icon={Users}
      />

      {/* Mobile Custom Selector */}
      <div className="sm:hidden px-4 relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-between w-full px-5 py-3.5 rounded-2xl bg-surface border border-border shadow-sm active:scale-95 transition-all group overflow-hidden"
        >
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <Users size={20} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em] leading-none mb-1">
                {t("common.viewing", "Currently Viewing")}
              </span>
              <span className="font-extrabold text-sm uppercase tracking-tight text-text-primary leading-none">
                {activeTabLabel}
              </span>
            </div>
          </div>
          <div
            className={`p-2 rounded-xl bg-background border border-border transition-transform duration-300 ${
              isMenuOpen ? "rotate-180 border-primary/30" : ""
            }`}
          >
            <ChevronDown
              size={14}
              className={`text-text-secondary transition-colors ${
                isMenuOpen ? "text-primary" : ""
              }`}
            />
          </div>
        </button>

        {/* Custom Mobile Dropdown Menu */}
        {isMenuOpen && (
          <>
            {/* Backdrop for closing */}
            <div
              className="fixed inset-0 z-40 bg-black/5"
              onClick={() => setIsMenuOpen(false)}
            />

            <div className="absolute top-full left-4 right-4 mt-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 origin-top">
              <div className="overflow-hidden rounded-2xl border border-border bg-surface/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                <div className="p-2 space-y-1">
                  <div className="px-4 py-3 border-b border-border/50 mb-1">
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                      {t("coach.clients.title")}
                    </p>
                  </div>
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                        activeTab === tab.id
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "hover:bg-primary/5 text-text-primary"
                      }`}
                    >
                      <span
                        className={`text-[13px] uppercase tracking-wide ${
                          activeTab === tab.id ? "font-black" : "font-bold"
                        }`}
                      >
                        {tab.label}
                      </span>
                      {activeTab === tab.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:block border-b border-border px-4 sm:px-0">
        <nav className="flex space-x-8 pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <div key={tab.id}>
              <Tab
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="whitespace-nowrap"
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
