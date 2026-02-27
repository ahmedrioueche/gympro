import { ErrorComponent } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../../components/ui/Loading";
import NoData from "../../../../../../../components/ui/NoData";
import type { ViewMode } from "../../../../../../../types/common";
import { MemberCard, MembersTable, type MemberDisplay } from "./index";

interface MembersListProps {
  isLoading: boolean;
  error: any;
  members: MemberDisplay[];
  totalMembersCount: number; // to check if truly empty or just no results
  searchQuery: string;
  viewMode: ViewMode;
  onViewProfile: (id: string) => void;
  onDelete: (id: string) => void;
  handleAddMember: () => void;
}

export function MembersList({
  isLoading,
  error,
  members,
  handleAddMember,
  viewMode,
  onViewProfile,
  onDelete,
}: MembersListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <Loading className="py-22" />;
  }

  if (error) {
    return <ErrorComponent error={error.message} />;
  }

  if (members.length === 0) {
    return (
      <NoData
        icon={Users}
        title={t("members.empty.title")}
        description={t("members.empty.description")}
        actionButton={{
          label: t("members.addMember"),
          onClick: handleAddMember,
          icon: Plus,
        }}
      />
    );
  }

  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {members.map((member) => (
          <MemberCard
            key={member._id}
            member={member}
            onViewProfile={handleViewProfile}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <MembersTable
      members={members}
      onViewProfile={onViewProfile}
      onDelete={onDelete}
    />
  );

  // Helper because MemberCard expects onViewProfile but we want to pass the ID
  function handleViewProfile(member: any) {
    onViewProfile(member._id);
  }
}
