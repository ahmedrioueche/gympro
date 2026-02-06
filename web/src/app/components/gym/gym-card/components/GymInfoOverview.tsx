import type { Gym } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import { useCoachAffiliations } from "../../../../../hooks/queries/useGymCoach";
import { useRequestGymAccess } from "../../../../../hooks/queries/useGyms";
import { useModalStore } from "../../../../../store/modal";
import { useUserStore } from "../../../../../store/user";

interface GymInfoOverviewProps {
  gym: Gym;
  displayRole?: string;
  onSelect: () => void;
  onJoin?: () => void;
  onToggleSettings: () => void;
}

export function GymInfoOverview({
  gym,
  displayRole,
  onSelect,
  onJoin,
  onToggleSettings,
}: GymInfoOverviewProps) {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { openModal } = useModalStore();
  const requestAccess = useRequestGymAccess();

  // Check if user has an existing membership for status display
  const { data: coachAffiliations = [] } = useCoachAffiliations();

  const membership: any = user?.memberships?.find((m: any) => {
    if (typeof m === "string") return false;
    const gId =
      typeof m.gym === "string" ? m.gym : m.gym?._id || m.gym?.toString();
    return gId === gym._id;
  });

  const coachAffiliation = coachAffiliations.find(
    (a) => a.gymId === gym._id || a.gym?._id === gym._id,
  );

  const isPending =
    (membership &&
      typeof membership !== "string" &&
      membership.membershipStatus === "pending") ||
    coachAffiliation?.status === "pending";

  const isJoined =
    (membership &&
      typeof membership !== "string" &&
      membership.membershipStatus === "active") ||
    coachAffiliation?.status === "active";

  // Also check if we just started a request
  const isRequesting = requestAccess.isPending;

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPending || isJoined || requestAccess.isPending) return;

    if (onJoin) {
      onJoin();
      return;
    }

    openModal("confirm", {
      title: t("gyms.join_confirm_title", { name: gym.name }),
      text: t("gyms.join_confirm_text"),
      confirmText: t("common.confirm"),
      confirmVariant: "primary",
      onConfirm: () => {
        requestAccess.mutate(gym._id);
      },
    });
  };

  const isStaff = ["Owner", "Manager", "Staff"].includes(displayRole || "");

  return (
    <div className="p-6 md:p-8 lg:p-10">
      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Location */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${gym.address || ""} ${gym.city || ""} ${gym.state || ""} ${gym.country || ""}`.trim(),
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-surface/50 rounded-xl p-5 border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300 group cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
              📍
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1 group-hover:text-primary transition-colors">
                {t("gymCard.location", "Location")}
              </h4>
              <p className="text-sm font-medium text-text-primary break-words group-hover:text-primary transition-colors">
                {gym.address || t("gymCard.noAddress", "No address provided")}
              </p>

              {(gym.city || gym.state || gym.country) && (
                <p className="text-xs text-text-secondary mt-1">
                  {gym.city}
                  {gym.state && `, ${gym.state}`}
                  {gym.country && ` - ${gym.country}`}
                </p>
              )}
            </div>
          </div>
        </a>

        {/* Contact */}
        <div className="bg-surface/50 rounded-xl p-5 border border-border/50 hover:border-primary/50 transition-all duration-300">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📞</span>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                {t("gymCard.contact", "Contact")}
              </h4>
              <p className="text-sm font-medium text-text-primary break-all">
                {gym.phone || t("gymCard.noPhone", "No phone")}
              </p>

              {gym.email && (
                <p className="text-xs text-text-secondary mt-1 break-all">
                  {gym.email}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Website */}
      {gym.website && (
        <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">🌐</span>
            <span className="text-text-secondary">
              {t("gymCard.website", "Website")}:
            </span>
            <a
              href={gym.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {gym.website}
            </a>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={
            isStaff
              ? (e) => {
                  e.stopPropagation();
                  onSelect();
                }
              : handleJoinClick
          }
          disabled={
            !isStaff && (isPending || isJoined || requestAccess.isPending)
          }
          className={`flex-1 py-4 px-6 text-center rounded-xl font-semibold text-lg transition-all duration-300 active:scale-95 ${
            isStaff
              ? "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:scale-105"
              : isJoined
                ? "bg-success/20 text-success border-2 border-success/30 cursor-default"
                : isPending || requestAccess.isPending
                  ? "bg-warning/20 text-warning border-2 border-warning/30 cursor-wait"
                  : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:scale-105"
          }`}
        >
          {isStaff
            ? t("gymCard.manageGym", "Manage Gym")
            : isJoined
              ? t("gyms.status_joined", "Joined")
              : isPending || isRequesting
                ? t("gyms.status_pending", "Pending")
                : t("gymCard.joinGym", "Join Gym")}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSettings();
          }}
          className="flex-1 py-4 px-6 text-center rounded-xl bg-surface border-2 border-border text-text-primary font-semibold text-lg hover:bg-surface/50 hover:border-primary hover:text-primary transition-all duration-300 active:scale-95"
        >
          {t("gymCard.viewMoreDetails")}
        </button>
      </div>
    </div>
  );
}
