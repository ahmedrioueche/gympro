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

  return (
    <div className="space-y-4">
      {/* Grid view - visible on mobile ALWAYS, and on desktop if viewMode is "cards" */}
      <div
        className={`${
          viewMode === "cards" ? "block" : "md:hidden"
        } grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6`}
      >
        {members.map((member) => (
          <MemberCard
            key={member._id}
            member={member}
            onViewProfile={() => onViewProfile(member._id)}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Table view - visible ONLY on desktop and ONLY if viewMode is "table" */}
      <div className={viewMode === "table" ? "hidden md:block" : "hidden"}>
        <MembersTable
          members={members}
          onViewProfile={onViewProfile}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
