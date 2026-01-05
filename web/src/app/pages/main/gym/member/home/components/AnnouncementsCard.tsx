import type { AppNotification } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns";
import { Bell, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AnnouncementsCardProps {
  announcements: AppNotification[];
  isLoading?: boolean;
}

export default function AnnouncementsCard({
  announcements,
  isLoading,
}: AnnouncementsCardProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-warning/10 rounded-xl text-warning">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-text-primary">
            {t("home.gymMember.announcements.title", "Announcements")}
          </h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-muted rounded-xl" />
          <div className="h-16 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-warning/10 rounded-xl text-warning">
          <Bell className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-text-primary">
          {t("home.gymMember.announcements.title", "Announcements")}
        </h3>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
            <Bell className="w-8 h-8 text-text-secondary/50" />
          </div>
          <p className="text-text-secondary text-sm">
            {t(
              "home.gymMember.announcements.empty",
              "No announcements at the moment"
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.slice(0, 5).map((announcement) => (
            <div
              key={announcement._id}
              className="p-4 bg-muted/30 hover:bg-muted/50 rounded-2xl border border-border/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-text-primary mb-1 line-clamp-1">
                    {announcement.title}
                  </h4>
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {announcement.message}
                  </p>
                </div>
                {announcement.priority === "high" && (
                  <span className="px-2 py-1 rounded-lg bg-error/20 text-error text-xs font-bold flex-shrink-0">
                    {t("home.gymMember.announcements.urgent", "Urgent")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-text-secondary">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {formatDistanceToNow(new Date(announcement.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
