import type { ProspectiveMember } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { useProspectiveMembers } from "../hooks/useProspectiveMembers";
import { ProspectiveMemberCard } from "./ProspectiveMemberCard";

interface ProspectiveMembersSectionProps {
  members?: ProspectiveMember[];
}

export function ProspectiveMembersSection({
  members: membersProp,
}: ProspectiveMembersSectionProps) {
  const { t } = useTranslation();
  const [filters] = useState<{
    city?: string;
    state?: string;
  }>({});

  const { data: fetchedMembers = [], isLoading } =
    useProspectiveMembers(filters);

  const members = membersProp || fetchedMembers;

  if (isLoading && !membersProp) {
    return <Loading />;
  }

  if (!members || members.length === 0) {
    return (
      <NoData
        emoji="🔍"
        title={t("coach.clients.prospectiveMembers.noData")}
        description={t("coach.clients.prospectiveMembers.noDataDesc")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Future: Add filter controls here */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <ProspectiveMemberCard key={member.userId} member={member} />
        ))}
      </div>
    </div>
  );
}
