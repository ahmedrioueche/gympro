import { Plus, UserCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../components/ui/Button";
import Loading from "../../../../../../components/ui/Loading";
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
    return <Loading />;
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
        <div className="bg-surface border border-border rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {t("staff.noData.title")}
          </h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            {t("staff.noData.description")}
          </p>
          <Button onClick={handleAddStaff} icon={<Plus className="w-5 h-5" />}>
            {t("staff.addButton")}
          </Button>
        </div>
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
