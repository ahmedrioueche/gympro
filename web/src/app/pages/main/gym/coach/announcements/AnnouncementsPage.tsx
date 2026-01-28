import { Megaphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../components/ui/Error";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import AnnouncementCard from "../../../../../components/cards/AnnouncementCard";
import PageHeader from "../../../../../components/PageHeader";
import { useCoachAnnouncements } from "./hooks/useCoachAnnouncements";

function AnnouncementsPage() {
  const { t } = useTranslation();
  const { announcements, isLoading, isError } = useCoachAnnouncements();

  if (isLoading)
    return (
      <>
        <PageHeader
          title={t("announcements.consumer.title", "Announcements")}
          subtitle={t(
            "announcements.consumer.subtitle",
            "Stay updated with gym news",
          )}
          icon={Megaphone}
        />
        <Loading />
      </>
    );

  if (isError) return <ErrorComponent />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("announcements.consumer.title", "Announcements")}
        subtitle={t(
          "announcements.consumer.subtitle",
          "Stay updated with gym news",
        )}
        icon={Megaphone}
      />

      <div className="grid gap-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement._id}
              announcement={announcement}
              canManage={false}
            />
          ))
        ) : (
          <NoData
            title={t("announcements.noData", "No announcements yet")}
            description={t(
              "announcements.noDataCheckBack",
              "Check back later for updates from your gym.",
            )}
          />
        )}
      </div>
    </div>
  );
}

export default AnnouncementsPage;
