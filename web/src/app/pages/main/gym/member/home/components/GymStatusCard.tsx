import type { Gym } from "@ahmedrioueche/gympro-client";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { GymStatus } from "../hooks/useGymMemberHome";

interface GymStatusCardProps {
  gym: Gym;
  status: GymStatus;
}

export default function GymStatusCard({ gym, status }: GymStatusCardProps) {
  const { t } = useTranslation();

  const getStatusColor = () => {
    if (!status.isOpen) return "bg-error/10 border-error/30";
    if (status.isWomenOnly) return "bg-pink-500/10 border-pink-500/30";
    return "bg-success/10 border-success/30";
  };

  const getStatusIcon = () => {
    if (!status.isOpen) {
      return <XCircle className="w-8 h-8 text-error" />;
    }
    return <CheckCircle className="w-8 h-8 text-success" />;
  };

  const getStatusText = () => {
    if (!status.isOpen) {
      return t("home.gymMember.status.closed", "Closed");
    }
    if (status.isWomenOnly) {
      return t("home.gymMember.status.womenOnly", "Women Only");
    }
    if (status.currentSession === "menOnly") {
      return t("home.gymMember.status.menOnly", "Men Only");
    }
    return t("home.gymMember.status.open", "Open Now");
  };

  const getSessionBadge = () => {
    if (!status.isOpen) return null;

    if (status.isWomenOnly) {
      return (
        <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-600 text-xs font-bold border border-pink-500/30">
          {t("home.gymMember.status.womenSession", "Women's Session")}
        </span>
      );
    }

    if (status.currentSession === "mixed") {
      return (
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-600 text-xs font-bold border border-indigo-500/30">
          {t("home.gymMember.status.mixedSession", "Mixed Session")}
        </span>
      );
    }

    if (status.currentSession === "menOnly") {
      return (
        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-600 text-xs font-bold border border-blue-500/30">
          {t("home.gymMember.status.menSession", "Men's Session")}
        </span>
      );
    }

    return null;
  };

  return (
    <div
      className={`bg-surface border ${getStatusColor()} rounded-3xl p-6 shadow-sm transition-all duration-300`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-text-primary truncate">
            {gym.name}
          </h2>
          {gym.slogan && (
            <p className="text-text-secondary text-sm mt-1 line-clamp-2">
              {gym.slogan}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span
              className={`text-lg font-bold ${
                status.isOpen ? "text-success" : "text-error"
              }`}
            >
              {getStatusText()}
            </span>
          </div>
          {getSessionBadge()}
        </div>
      </div>

      {status.nextStatusChange && (
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-text-secondary">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{status.nextStatusChange}</span>
        </div>
      )}
    </div>
  );
}
