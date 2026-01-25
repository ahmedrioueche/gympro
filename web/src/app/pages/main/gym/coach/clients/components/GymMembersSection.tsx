import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../../components/ui/Error";
import Loading from "../../../../../../../components/ui/Loading";
import NoData from "../../../../../../../components/ui/NoData";
import { useGymMembers } from "../hooks/useGymMembers";
import GymMemberItem from "./GymMemberItem";

export function GymMembersSection() {
  const { t } = useTranslation();
  const { data: members, isLoading, isError, error } = useGymMembers();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorComponent />;
  }

  if (!members || !Array.isArray(members) || members.length === 0) {
    return (
      <NoData
        emoji="👥"
        title={t("coach.clients.gymMembers.noData", "No Members Found")}
        description={t(
          "coach.clients.gymMembers.noDataDesc",
          "There are no other members in this gym available for coaching.",
        )}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <GymMemberItem key={member.userId} member={member} />
      ))}
    </div>
  );
}
