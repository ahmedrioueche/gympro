import { Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Tab from "../../../../components/ui/Tab";
import PageHeader from "../../../components/PageHeader";
import CoachListTab from "./components/CoachListTab";
import CoachRequestList from "./components/CoachRequestList";
import { useCoachRequests } from "./hooks/useCoachRequests";
import { useCoaches } from "./hooks/useCoaches";

export default function CoachingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"active" | "requests">("active");

  // Prefetch data for counts (optional optimization)
  const { data: requests } = useCoachRequests();
  const { data: coaches } = useCoaches();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("admin.coaching.title")}
        subtitle={t("admin.coaching.subtitle")}
        icon={Users}
      />

      <div className="flex gap-1 border-b border-border mb-6">
        <Tab
          label={t("coaching.activeCoaches", "Active Coaches")}
          count={coaches?.length}
          isActive={activeTab === "active"}
          onClick={() => setActiveTab("active")}
        />
        <Tab
          label={t("coaching.requests", "Requests")}
          count={requests?.length}
          isActive={activeTab === "requests"}
          onClick={() => setActiveTab("requests")}
        />
      </div>

      <div className="mt-6">
        {activeTab === "active" ? (
          <CoachListTab />
        ) : (
          <CoachRequestList requests={requests || []} />
        )}
      </div>
    </div>
  );
}
