import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronRight, Speaker } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../../constants/navigation";
import { useGymCoachAnnouncements } from "../hooks/useGymCoachAnnouncements";

interface GymCoachAnnouncementsSectionProps {
  gymId: string;
}

export default function GymCoachAnnouncementsSection({
  gymId,
}: GymCoachAnnouncementsSectionProps) {
  const { t } = useTranslation();
  const { data: announcements, isLoading } = useGymCoachAnnouncements(gymId);
  const navigate = useNavigate();

  if (isLoading) return null;
  if (!announcements || announcements.length === 0) return null;

  // Show only top 2 recent announcements
  const recentAnnouncements = announcements.slice(0, 2);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
          <Speaker className="w-5 h-5 text-primary" />
          {t("home.coach.announcements.title", "Latest Announcements")}
        </h3>
        <Link
          to={APP_PAGES.gym.coach.announcements.link}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          {t("common.viewAll", "View All")}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid gap-3">
        {recentAnnouncements.map((announcement) => (
          <div
            key={announcement._id}
            onClick={() =>
              navigate({ to: APP_PAGES.gym.coach.announcements.link })
            }
            className="group relative overflow-hidden bg-surface border border-border hover:border-primary/50 rounded-xl p-4 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform duration-300`}
              >
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-text-primary truncate">
                    {announcement.title}
                  </h4>
                  <span className="text-xs text-text-secondary whitespace-nowrap bg-surface-hover px-2 py-0.5 rounded-full">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-text-secondary line-clamp-2">
                  {announcement.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
