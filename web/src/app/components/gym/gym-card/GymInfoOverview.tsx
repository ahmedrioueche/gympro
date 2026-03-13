import { type Gym } from "@ahmedrioueche/gympro-client";
import { MapPin } from "lucide-react";
import React, { useMemo } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useCoachAffiliations,
  useRequestGymAffiliation,
} from "../../../../hooks/queries/useGymCoach";
import { useModalStore } from "../../../../store/modal";
import { useUserStore } from "../../../../store/user";
import { cn } from "../../../../utils/helper";
import { getMessage } from "../../../../utils/statusMessage";

interface GymInfoOverviewProps {
  gym: Gym;
  displayRole?: string;
  onSelect: () => void;
  onJoin?: () => void;
  onOpenDetails: () => void;
  hideActions?: boolean;
}

export function GymInfoOverview({
  gym,
  displayRole,
  onJoin,
  onOpenDetails,
  hideActions = false,
}: GymInfoOverviewProps) {
  const { t } = useTranslation();
  const { user, activeDashboard } = useUserStore();
  const { openModal } = useModalStore();

  const { mutate: requestAffiliation, isPending: isJoining } =
    useRequestGymAffiliation();

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();

    openModal("confirm", {
      title: t("coach.gyms.requestJoinTitle", "Join Gym"),
      text: t("coach.gyms.requestJoinConfirm", {
        gymName: gym.name,
        defaultValue: `Are you sure you want to join ${gym.name}?`,
      }),
      confirmText: t("coach.gyms.requestJoin", "Join"),
      onConfirm: () => {
        requestAffiliation(
          { gymId: gym._id },
          {
            onSuccess: (data) => {
              if (data.success) {
                toast.success(
                  t(
                    "gyms.request_success",
                    "Join request submitted successfully!",
                  ),
                );
              } else {
                const statusMessage = getMessage(data, t);
                toast.error(statusMessage.message);
              }
            },
            onError: (error: any) => {
              const statusMessage = getMessage(
                error.response?.data || error,
                t,
              );
              toast.error(statusMessage.message);
            },
          },
        );
      },
      confirmVariant: "primary",
    });
  };

  const { data: coachAffiliations = [] } = useCoachAffiliations();

  const membership = useMemo(
    () =>
      user?.memberships?.find((m: any) => {
        if (typeof m === "string") return false;
        const gId =
          typeof m.gym === "string" ? m.gym : m.gym?._id || m.gym?.toString();
        return gId === gym._id;
      }),
    [user?.memberships, gym._id],
  );

  const coachAffiliation = useMemo(
    () =>
      coachAffiliations.find(
        (a) => a.gymId === gym._id || a.gym?._id === gym._id,
      ),
    [coachAffiliations, gym._id],
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

  const isStaff = ["Owner", "Manager", "Staff"].includes(displayRole || "");

  const hasLocation = !!(gym.address || gym.city || gym.state || gym.country);

  return (
    <div className="p-5 md:p-8 lg:p-10 space-y-10">
      {/* Location Section */}
      <div className="space-y-5">
        <SectionHeader
          icon={<MapPin className="w-5 h-5 text-primary" />}
          title={t("gymCard.location", "Location")}
        />
        {hasLocation ? (
          <div className="p-6 md:p-8 rounded-2xl border border-border/60 bg-surface-secondary/30 group hover:border-primary/30 transition-colors">
            <p className="text-text-primary font-black text-sm md:text-base lg:text-xl leading-tight">
              {gym.address}
            </p>
            {(gym.city || gym.state || gym.country) && (
              <p className="text-xs md:text-sm lg:text-base text-text-secondary font-medium mt-2">
                {gym.city}
                {gym.state ? `, ${gym.state}` : ""}
                {gym.country ? ` - ${gym.country}` : ""}
              </p>
            )}
          </div>
        ) : (
          <div className="p-6 md:p-8 rounded-2xl border border-dashed border-border/60 bg-surface-secondary/10 flex flex-col items-center justify-center text-center opacity-50">
            <p className="text-text-secondary font-black text-sm md:text-base lg:text-lg italic uppercase tracking-wider">
              {t("gymCard.noLocationAvailable", "No location available")}
            </p>
          </div>
        )}
      </div>

      {/* Action Section - Restored styling with margin-top separation */}
      {!hideActions && (
        <div className="mt-4 pt-2 flex items-center justify-between gap-6">
          <div className="flex-1">
            {activeDashboard === "coach" && !isStaff && !isJoined && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPending && !isJoining) {
                    if (onJoin) {
                      onJoin();
                    } else {
                      handleJoin(e as any);
                    }
                  }
                }}
                disabled={isPending || isJoining}
                className={cn(
                  "px-8 py-3.5 rounded-2xl font-black text-sm md:text-base transition-all active:scale-[0.98] shadow-lg",
                  isPending || isJoining
                    ? "bg-warning/10 text-warning border border-warning/20 cursor-wait"
                    : "bg-primary text-white hover:bg-primary-hover shadow-primary/25 hover:shadow-primary/40",
                )}
              >
                {isPending || isJoining
                  ? t("gyms.status_pending", "Pending Request")
                  : t("gymCard.joinGym", "Join Gym Now")}
              </button>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="shrink-0 px-8 py-3.5 rounded-2xl bg-surface border-2 border-primary/30 text-primary font-black text-xs md:text-sm hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.95] uppercase tracking-[0.15em]"
          >
            {t("gymCard.viewDetails", "View Full Details")}
          </button>
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="p-2.5 bg-primary/5 rounded-xl border border-primary/10 shadow-sm">
        {icon}
      </div>
      <h4 className="text-[11px] md:text-xs font-black text-text-primary uppercase tracking-[0.2em]">
        {title}
      </h4>
    </div>
  );
}
