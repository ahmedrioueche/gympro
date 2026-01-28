import { type GymAnnouncement } from "@ahmedrioueche/gympro-client";
import { Megaphone, Plus, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../components/ui/Error";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { usePermissions } from "../../../../../../hooks/usePermissions";
import { useGymStore } from "../../../../../../store/gym";
import { useModalStore } from "../../../../../../store/modal";
import AnnouncementCard from "../../../../../components/cards/AnnouncementCard";
import PageHeader from "../../../../../components/PageHeader";
import { useAnnouncements } from "./hooks/useAnnouncements";

export default function AnnouncementsPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const currentGymId = currentGym?._id;
  const { hasPermission } = usePermissions();
  const { openModal } = useModalStore();

  const { announcements, isLoading, isError, deleteAnnouncement, isDeleting } =
    useAnnouncements();

  /* Removed local state for delete modal */
  const canManage = hasPermission("communication:manage");

  if (isLoading)
    return (
      <>
        <PageHeader
          title={t("announcements.title", "Announcements")}
          subtitle={t("announcements.subtitle", "Manage gym communications")}
          icon={Send}
        />
        <Loading />;
      </>
    );

  if (isError) return <ErrorComponent />;

  const handleCreateClick = () => {
    if (currentGymId) {
      openModal("create_announcement", { gymId: currentGymId });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("announcements.title", "Announcements")}
        subtitle={t("announcements.subtitle", "Manage gym communications")}
        icon={Megaphone}
        actionButton={
          canManage
            ? {
                onClick: handleCreateClick,
                icon: Plus,
                label: t("announcements.create", "New Announcement"),
              }
            : undefined
        }
      />

      <div className="grid gap-4">
        {announcements.length > 0 ? (
          announcements.map((announcement: GymAnnouncement) => (
            <AnnouncementCard
              key={announcement._id}
              announcement={announcement}
              canManage={canManage}
              onDelete={(id) =>
                openModal("confirm", {
                  title: t("announcements.deleteTitle", "Delete Announcement"),
                  text: t(
                    "announcements.deleteConfirm",
                    "Are you sure you want to delete this announcement?",
                  ),
                  confirmText: t("common.delete"),
                  confirmVariant: "danger",
                  onConfirm: async () => {
                    await deleteAnnouncement(id);
                  },
                })
              }
            />
          ))
        ) : (
          <NoData
            title={t("announcements.noData", "No announcements yet")}
            description={t(
              "announcements.noDataDesc",
              "Create your first announcement to reach your members.",
            )}
          />
        )}
      </div>
    </div>
  );
}
