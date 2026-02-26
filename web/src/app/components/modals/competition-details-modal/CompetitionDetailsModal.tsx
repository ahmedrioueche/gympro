import type { User as UserType } from "@ahmedrioueche/gympro-client";
import {
  Calendar,
  ChevronRight,
  Loader2,
  Mail,
  Medal,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { useCompetitionParticipants } from "../../../../hooks/queries/useCompetitions";
import { useModalStore } from "../../../../store/modal";
import { useUserStore } from "../../../../store/user";

export default function CompetitionDetailsModal() {
  const { t } = useTranslation();
  const { user: currentUser } = useUserStore();
  const { currentModal, competitionDetailsProps, closeModal, openModal } =
    useModalStore();

  const isOpen = currentModal === "competition-details";
  const competition = competitionDetailsProps?.competition;

  const {
    data: participants,
    isLoading: isLoadingParticipants,
    isError: isErrorParticipants,
  } = useCompetitionParticipants(
    competitionDetailsProps?.gymId || competition?.gymId || "",
    competition?._id || "",
  );

  const isManagerOrStaff =
    currentUser?.role === "manager" || currentUser?.role === "receptionist";

  if (!isOpen || !competition) return null;

  const isCompleted = competition.status === "completed";

  const getMedalColor = (place: number) => {
    switch (place) {
      case 1:
        return "from-yellow-400 to-yellow-600 text-yellow-900";
      case 2:
        return "from-gray-300 to-gray-500 text-gray-900";
      case 3:
        return "from-amber-500 to-amber-700 text-amber-900";
      default:
        return "from-gray-200 to-gray-400";
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={competition.title}
      subtitle={t(`competitions.status.${competition.status}`)}
      icon={Trophy}
      maxWidth="max-w-2xl"
      secondaryButton={{
        label: t("common.close"),
        icon: X,
      }}
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
          {competition.bannerImage ? (
            <img
              src={competition.bannerImage}
              alt={competition.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Trophy className="w-20 h-20 text-primary/20" />
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                isCompleted
                  ? "bg-blue-500/80 text-white"
                  : "bg-green-500/80 text-white"
              }`}
            >
              {t(`competitions.status.${competition.status}`)}
            </span>
          </div>
        </div>

        {/* Title & Type */}
        <div>
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            {t(`competitions.types.${competition.type}`)}
          </span>
          <h2 className="text-2xl font-bold text-text-primary mt-2">
            {competition.title}
          </h2>
          <p className="text-text-secondary mt-2 leading-relaxed">
            {competition.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-surface-secondary rounded-xl border border-border/50">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium uppercase">
                {t("competitions.participants")}
              </p>
              <p className="text-lg font-bold text-text-primary">
                {competition.participantCount}
                {competition.maxParticipants &&
                  ` / ${competition.maxParticipants}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-surface-secondary rounded-xl border border-border/50">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium uppercase">
                {competition.schedulingMode === "fixed"
                  ? t("competitions.eventTime")
                  : t("competitions.duration")}
              </p>
              <p className="text-sm font-bold text-text-primary">
                {competition.schedulingMode === "fixed" ? (
                  <>
                    {new Date(competition.eventTime!).toLocaleDateString([], {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(competition.eventTime!).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </>
                ) : (
                  <>
                    {new Date(competition.startDate).toLocaleDateString()} -{" "}
                    {new Date(competition.endDate!).toLocaleDateString()}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Rules */}
        {competition.rules && (
          <div>
            <h3 className="font-bold text-text-primary mb-2">
              {t("competitions.rules")}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line bg-surface-secondary p-4 rounded-xl border border-border/50">
              {competition.rules}
            </p>
          </div>
        )}

        {/* Prize */}
        {competition.prize && (
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <h3 className="font-bold text-primary mb-1">
              🏆 {t("competitions.prize")}
            </h3>
            <p className="text-text-primary font-medium">{competition.prize}</p>
          </div>
        )}

        {/* Winners Podium (for completed competitions) */}
        {isCompleted &&
          competition.winners &&
          competition.winners.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Medal className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-text-primary">
                  {t("common.winners")}
                </h3>
              </div>
              <div className="flex justify-center items-end gap-3 sm:gap-6 pt-10 pb-4">
                {competition.winners
                  .sort((a, b) => a.place - b.place)
                  .map((winner) => (
                    <div
                      key={winner.userId}
                      className={`flex flex-col items-center flex-1 min-w-0 ${
                        winner.place === 1
                          ? "order-2"
                          : winner.place === 2
                            ? "order-1"
                            : "order-3"
                      }`}
                    >
                      <div className="relative mb-4">
                        {/* Profile Image/Initial */}
                        <div
                          className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-surface shadow-xl overflow-hidden ${winner.place === 1 ? "scale-110 sm:scale-125" : ""}`}
                        >
                          {winner.userAvatar ? (
                            <img
                              src={winner.userAvatar}
                              alt={winner.userName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-xl font-bold text-text-secondary">
                              {winner.userName?.charAt(0)}
                            </div>
                          )}
                        </div>
                        {/* Medal Badge */}
                        <div
                          className={`absolute -bottom-2 -right-2 z-20 w-8 h-8 rounded-full bg-gradient-to-b ${getMedalColor(winner.place)} flex items-center justify-center text-xs font-bold shadow-lg border-2 border-surface`}
                        >
                          {winner.place}
                        </div>
                      </div>

                      {/* Podium Base */}
                      <div
                        className={`w-full max-w-[120px] bg-surface-secondary rounded-t-2xl px-2 pt-4 flex flex-col items-center justify-center border-x border-t border-border/50 shadow-inner ${
                          winner.place === 1
                            ? "h-28 bg-primary/5 border-primary/20"
                            : winner.place === 2
                              ? "h-20"
                              : "h-16"
                        }`}
                      >
                        <p className="font-bold text-text-primary text-xs sm:text-sm truncate w-full text-center px-1">
                          {winner.userName || "Unknown"}
                        </p>
                        <p
                          className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${winner.place === 1 ? "text-primary" : "text-text-secondary"}`}
                        >
                          {winner.place === 1
                            ? "🥇 First"
                            : winner.place === 2
                              ? "🥈 Second"
                              : "🥉 Third"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Participants Section */}
        <div className="pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-text-primary">
                {t("competitions.participants.title", {
                  defaultValue: "Participants",
                })}
              </h3>
            </div>
            <span className="text-xs font-bold text-text-secondary bg-surface-secondary px-2 py-1 rounded-lg border border-border/50">
              {participants?.length || 0}
            </span>
          </div>

          {isLoadingParticipants ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-text-secondary">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm">{t("common.loading")}</p>
            </div>
          ) : isErrorParticipants ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-red-500/5 rounded-2xl border border-dashed border-red-500/20">
              <p className="text-sm font-medium text-danger">
                {t("competitions.participants.error", {
                  defaultValue: "Failed to load participants",
                })}
              </p>
            </div>
          ) : !participants || participants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-surface-secondary/50 rounded-2xl border border-dashed border-border">
              <Users className="w-8 h-8 text-text-secondary/20 mb-2" />
              <p className="text-sm font-medium text-text-secondary">
                {t("competitions.participants.empty", {
                  defaultValue: "No participants yet",
                })}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {participants.map((user: UserType) => (
                <button
                  key={user._id}
                  onClick={() => openModal("user_profile", { user })}
                  className="group p-3 flex items-center justify-between bg-surface-secondary/50 hover:bg-surface-secondary border border-border/50 hover:border-primary/30 rounded-xl transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      {user.profile.profileImageUrl ? (
                        <img
                          src={user.profile.profileImageUrl}
                          alt={user.profile.fullName || user.profile.username}
                          className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary/30 transition-all shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-sm shadow-sm">
                          {(user.profile.fullName || user.profile.username)
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors truncate">
                        {user.profile.fullName || user.profile.username}
                      </h4>
                      {isManagerOrStaff && (
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          {user.profile.email && (
                            <span className="flex items-center gap-1 text-[10px] text-text-secondary truncate">
                              <Mail className="w-2.5 h-2.5" />
                              {user.profile.email}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
