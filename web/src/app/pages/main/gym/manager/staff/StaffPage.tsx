import { Plus, UserCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { useGymStore } from "../../../../../../store/gym";
import { useModalStore } from "../../../../../../store/modal";
import PageHeader from "../../../../../components/PageHeader";
import StaffMemberCard from "./components/StaffMemberCard";
import { useGymStaff, useRemoveStaff } from "./hooks/useStaff";

function StaffPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { openModal } = useModalStore();
  const { data: staff, isLoading } = useGymStaff(currentGym?._id);
  const removeStaffMutation = useRemoveStaff();

  const handleAddStaff = () => {
    if (!currentGym?._id) return;
    openModal("staff_modal", {
      gymId: currentGym._id,
      mode: "add",
    });
  };

  const handleEditStaff = (member: NonNullable<typeof staff>[number]) => {
    if (!currentGym?._id) return;
    openModal("staff_modal", {
      gymId: currentGym._id,
      mode: "edit",
      staff: {
        membershipId: member.membershipId,
        fullName: member.fullName,
        email: member.email,
        phoneNumber: member.phoneNumber,
        role: member.role,
        permissions: member.permissions,
      },
    });
  };

  const handleRemoveStaff = (membershipId: string) => {
    if (!currentGym?._id) return;
    openModal("confirm", {
      title: t("staff.removeConfirmTitle"),
      text: t("staff.removeConfirmText"),
      confirmText: t("common.delete"),
      confirmVariant: "danger",
      onConfirm: () => {
        removeStaffMutation.mutate({
          gymId: currentGym._id,
          membershipId,
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title={t("staff.title")}
          subtitle={t("staff.subtitle")}
          icon={UserCircle}
          actionButton={{
            label: t("staff.addButton"),
            icon: Plus,
            onClick: handleAddStaff,
          }}
        />
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("staff.title")}
        subtitle={t("staff.subtitle")}
        icon={UserCircle}
        actionButton={{
          label: t("staff.addButton"),
          icon: Plus,
          onClick: handleAddStaff,
        }}
      />

      {!staff || staff.length === 0 ? (
        <NoData
          icon={UserCircle}
          title={t("staff.noData.title")}
          description={t("staff.noData.description")}
          actionButton={{
            label: t("staff.addButton"),
            icon: Plus,
            onClick: handleAddStaff,
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <StaffMemberCard
              key={member.membershipId}
              member={member}
              onEdit={() => handleEditStaff(member)}
              onRemove={() => handleRemoveStaff(member.membershipId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default StaffPage;
