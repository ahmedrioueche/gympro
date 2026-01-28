import { type GymAnnouncement } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Info,
  Megaphone,
  Trash2,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface AnnouncementCardProps {
  announcement: GymAnnouncement;
  onDelete?: (id: string) => void;
  canManage?: boolean;
}

export default function AnnouncementCard({
  announcement,
  onDelete,
  canManage = false,
}: AnnouncementCardProps) {
  const { t } = useTranslation();

  const getPriorityConfig = () => {
    switch (announcement.priority) {
      case "critical":
        return {
          icon: AlertTriangle,
          gradient: "from-red-500 to-orange-500",
          colors: "bg-red-500/10 text-red-500 border-red-500/20",
          iconBg: "bg-gradient-to-br from-red-500 to-orange-500",
        };
      case "high":
        return {
          icon: Megaphone,
          gradient: "from-amber-500 to-yellow-500",
          colors: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          iconBg: "bg-gradient-to-br from-amber-500 to-yellow-500",
        };
      default:
        return {
          icon: Bell,
          gradient: "from-blue-500 to-cyan-500",
          colors: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
        };
    }
  };

  const config = getPriorityConfig();
  const Icon = config.icon;

  return (
    <div
      className={`group relative bg-surface border border-border hover:border-primary/40 transition-all duration-300 rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl`}
    >
      {/* Gradient accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
      />

      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${config.iconBg} flex items-center justify-center shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}
            >
              <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>

            {/* Title & Meta */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1 mb-2">
                {announcement.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border flex items-center gap-1.5 ${config.colors}`}
                >
                  <Info size={12} />
                  {t(`announcements.priority.${announcement.priority}`)}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium bg-background-secondary text-text-secondary rounded-lg border border-border flex items-center gap-1.5">
                  <User size={12} />
                  {t(`announcements.audience.${announcement.targetAudience}`)}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium bg-background-secondary text-text-secondary rounded-lg border border-border flex items-center gap-1.5">
                  <Calendar size={12} />
                  {format(new Date(announcement.createdAt), "PPP")}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {canManage && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(announcement._id);
              }}
              className="p-2 rounded-lg text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title={t("common.delete")}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="bg-background-secondary/30 rounded-xl p-4 border border-border/50">
          <p className="text-sm md:text-base text-text-secondary whitespace-pre-wrap leading-relaxed">
            {announcement.content}
          </p>
        </div>

        {/* Footer info - Author */}
        <div className="mt-4 flex items-center justify-end">
          <p className="text-xs text-text-secondary flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            {t("common.postedBy")}
            <span className="font-medium text-text-primary">
              {announcement.author.name}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
