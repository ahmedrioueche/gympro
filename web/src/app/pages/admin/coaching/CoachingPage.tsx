import { APP_PERMISSIONS } from "@ahmedrioueche/gympro-client";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Tab from "../../../../components/ui/Tab";
import { useAppPermissions } from "../../../../hooks/useAppPermissions";
import PageHeader from "../../../components/PageHeader";
import CoachListTab from "./components/CoachListTab";
import CoachRequestList from "./components/CoachRequestList";
import { useCoachRequests } from "./hooks/useCoachRequests";
import { useCoaches } from "./hooks/useCoaches";

export default function CoachingPage() {
  const { t } = useTranslation();
  const { hasAppPermission } = useAppPermissions();

  const canManageCoaches = hasAppPermission(APP_PERMISSIONS.MANAGE_COACHES);
  const canManageRequests = hasAppPermission(
    APP_PERMISSIONS.MANAGE_COACH_REQUESTS,
  );

  const [activeTab, setActiveTab] = useState<"active" | "requests">(
    canManageCoaches ? "active" : "requests",
  );

  // Sync active tab if permissions change or initially
  useEffect(() => {
    if (!canManageCoaches && canManageRequests) {
      setActiveTab("requests");
    } else if (canManageCoaches && !canManageRequests) {
      setActiveTab("active");
    }
  }, [canManageCoaches, canManageRequests]);

  // Fetch data conditionally based on permissions
  const { data: requests } = useCoachRequests({
    enabled: canManageRequests,
  });
  const { data: coaches } = useCoaches({
    enabled: canManageCoaches,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("admin.coaching.title")}
        subtitle={t("admin.coaching.subtitle")}
        icon={Users}
      />

      {(canManageCoaches || canManageRequests) && (
        <div className="flex gap-1 border-b border-border mb-6">
          {canManageCoaches && (
            <Tab
              label={t("coaching.activeCoaches", "Active Coaches")}
              count={coaches?.length}
              isActive={activeTab === "active"}
              onClick={() => setActiveTab("active")}
            />
          )}
          {canManageRequests && (
            <Tab
              label={t("coaching.requests", "Requests")}
              count={requests?.length}
              isActive={activeTab === "requests"}
              onClick={() => setActiveTab("requests")}
            />
          )}
        </div>
      )}

      <div className="mt-6">
        {activeTab === "active" && canManageCoaches ? (
          <CoachListTab />
        ) : activeTab === "requests" && canManageRequests ? (
          <CoachRequestList requests={requests || []} />
        ) : (
          <div className="text-center py-12 text-text-secondary">
            {t("common.insufficient_permissions")}
          </div>
        )}
      </div>
    </div>
  );
}
