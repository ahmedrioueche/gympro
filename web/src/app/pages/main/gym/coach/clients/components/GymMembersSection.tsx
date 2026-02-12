import type { ProspectiveMember } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../../components/ui/Loading";
import NoData from "../../../../../../../components/ui/NoData";
import { ProspectiveMemberCard } from "../../../../coach/clients/components/ProspectiveMemberCard";
import { useProspectiveMembers } from "../../../../coach/clients/hooks/useProspectiveMembers";

interface GymMembersSectionProps {
  members?: ProspectiveMember[];
}

export function GymMembersSection({
  members: membersProp,
}: GymMembersSectionProps) {
  const { t } = useTranslation();
  const { data: fetchedMembers, isLoading } = useProspectiveMembers();

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <ProspectiveMemberCard key={member.userId} member={member} />
      ))}
    </div>
  );
}
