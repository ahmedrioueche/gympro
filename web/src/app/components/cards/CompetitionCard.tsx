import { type Competition } from "@ahmedrioueche/gympro-client";
import {
  Calendar,
  ChevronRight,
  Medal,
  MoreVertical,
  Pencil,
  Trash,
  Trophy,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Dropdown, { DropdownItem } from "../../../components/ui/Dropdown";
import { useUserStore } from "../../../store/user";

interface CompetitionCardProps {
  competition: Competition;
  onViewDetails: (competition: Competition) => void;
  // Manager Actions
  onEdit?: (competition: Competition) => void;
  onDelete?: (competition: Competition) => void;
  onSetWinners?: (competition: Competition) => void;
  onViewParticipants?: (competition: Competition) => void;
  // Member Actions
  onJoin?: (competition: Competition) => void;
  onLeave?: (competition: Competition) => void;
  isJoining?: boolean;
  isLeaving?: boolean;
}

export function CompetitionCard({
  competition,
  onViewDetails,
  onEdit,
  onDelete,
  onSetWinners,
  onViewParticipants,
  onJoin,
  onLeave,
  isJoining,
  isLeaving,
}: CompetitionCardProps) {
  const { t } = useTranslation();
  const { user } = useUserStore();

  const isManagerOrStaff =
    user?.role === "manager" ||
    user?.role === "receptionist" ||
    user?.role === "owner";
  const isParticipant = competition.participants?.includes(user?._id || "");
  const isCompleted = competition.status === "completed";
  const hasWinners = competition.winners && competition.winners.length > 0;
  const userPlace = competition.winners?.find(
    (w) => w.userId === user?._id,
  )?.place;
  const isFull =
    competition.maxParticipants &&
    competition.participantCount >= competition.maxParticipants;

  const now = new Date();
  const isPastTime =
    competition.schedulingMode === "fixed"
      ? competition.eventTime && new Date(competition.eventTime) < now
      : competition.endDate && new Date(competition.endDate) < now;

  const canSetWinners =
    (competition.status === "active" && isPastTime) || isCompleted;

  const getStatusColor = (status: Competition["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "draft":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-surface-secondary text-text-secondary border-border";
    }
  };

  return (
    <div
      onClick={() => onViewDetails(competition)}
      className="group cursor-pointer bg-surface border border-border rounded-2xl overflow-visible hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row shadow-sm hover:shadow-xl relative min-h-[12rem]"
    >
      {/* Banner Section */}
      <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-t-none">
        {competition.bannerImage ? (
          <img
            src={competition.bannerImage}
            alt={competition.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <Trophy className="w-12 h-12 text-primary/30" />
          </div>
        )}

        {/* Status Badge Over Image */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(
              competition.status,
            )} backdrop-blur-md uppercase tracking-wider shadow-sm`}
          >
            {t(`competitions.status.${competition.status}`)}
          </span>
        </div>

        {/* Participant / Winner Badges (for members) */}
        {!isManagerOrStaff && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {userPlace && (
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-amber-600 text-white rounded-lg text-[10px] font-bold uppercase shadow-lg flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {t("common.winner", { place: userPlace })}
              </span>
            )}
            {isParticipant && !userPlace && (
              <span className="px-2 py-1 bg-primary text-white rounded-lg text-[10px] font-bold uppercase shadow-lg">
                {t("competitions.joined")}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Content Info */}
      <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 max-w-[85%]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                  {t(`competitions.types.${competition.type}`)}
                </span>
                <span className="text-xs text-text-secondary flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {competition.type}
                </span>
              </div>
              <h3 className="font-bold text-xl text-text-primary group-hover:text-primary transition-colors truncate">
                {competition.title}
              </h3>
              <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                {competition.description}
              </p>
            </div>

            {/* Manager Actions Dropdown */}
            {isManagerOrStaff &&
              (onEdit || onDelete || onSetWinners || onViewParticipants) && (
                <div
                  className="relative z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dropdown
                    align="right"
                    trigger={
                      <button className="p-2 hover:bg-surface-secondary rounded-xl text-text-secondary transition-all border border-transparent hover:border-border">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    }
                  >
                    {onEdit && (
                      <DropdownItem
                        label={t("common.edit")}
                        onClick={() => onEdit(competition)}
                        icon={<Pencil className="w-4 h-4" />}
                      />
                    )}
                    {canSetWinners && onSetWinners && (
                      <DropdownItem
                        icon={<Medal className="w-4 h-4" />}
                        label={t("competitions.setWinners")}
                        onClick={() => onSetWinners(competition)}
                      />
                    )}
                    {onViewParticipants && (
                      <DropdownItem
                        icon={<Users className="w-4 h-4" />}
                        label={t("competitions.viewParticipants", {
                          defaultValue: "View Participants",
                        })}
                        onClick={() => onViewParticipants(competition)}
                      />
                    )}
                    {onDelete && (
                      <DropdownItem
                        label={t("common.delete")}
                        variant="danger"
                        onClick={() => onDelete(competition)}
                        icon={<Trash className="w-4 h-4" />}
                      />
                    )}
                  </Dropdown>
                </div>
              )}
          </div>

          {/* Stats & Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5" />
                  {t("competitions.card.participants", {
                    count: competition.participantCount,
                  })}
                </span>
                {competition.maxParticipants && (
                  <span className="text-text-secondary font-bold text-[10px]">
                    {competition.participantCount} /{" "}
                    {competition.maxParticipants}
                  </span>
                )}
              </div>
              {competition.maxParticipants && (
                <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min((competition.participantCount / competition.maxParticipants) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 bg-surface-secondary/50 p-2.5 rounded-xl border border-border/50">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shadow-sm">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-tight">
                  {competition.schedulingMode === "fixed"
                    ? t("competitions.eventTime")
                    : t("competitions.duration")}
                </span>
                <span className="text-[10px] font-semibold text-text-primary truncate">
                  {competition.schedulingMode === "fixed" ? (
                    <>
                      {new Date(competition.eventTime!).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })}{" "}
                      {new Date(competition.eventTime!).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </>
                  ) : (
                    <>
                      {new Date(competition.startDate).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(competition.endDate!).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Winners Display Summary (for completed competitions) */}
          {isCompleted && hasWinners && (
            <div className="pt-3 border-t border-border mt-2">
              <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                <Medal className="w-3.5 h-3.5 text-primary" />
                {t("common.winners")}
              </div>
              <div className="flex flex-wrap gap-2">
                {competition
                  .winners!.sort((a, b) => a.place - b.place)
                  .map((winner) => (
                    <div
                      key={winner.userId}
                      className="flex items-center gap-2 px-2.5 py-1 bg-surface-secondary border border-border/50 rounded-lg"
                    >
                      <span
                        className={`text-xs font-bold ${
                          winner.place === 1
                            ? "text-yellow-500"
                            : winner.place === 2
                              ? "text-gray-400"
                              : "text-amber-600"
                        }`}
                      >
                        #{winner.place}
                      </span>
                      <span className="text-[10px] font-medium text-text-primary truncate max-w-[80px]">
                        {winner.userName || "Unknown"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        {!isCompleted && !isManagerOrStaff && (onJoin || onLeave) && (
          <div
            className="flex justify-end gap-3 mt-4 pt-4 border-t border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {isParticipant
              ? onLeave && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLeave(competition);
                    }}
                    disabled={isLeaving}
                    className="px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-all disabled:opacity-50 uppercase tracking-wider"
                  >
                    {isLeaving ? t("common.leaving") : t("competitions.leave")}
                  </button>
                )
              : onJoin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onJoin(competition);
                    }}
                    disabled={isJoining || isFull}
                    className="px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold text-white bg-primary hover:bg-primary/80 shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all disabled:opacity-50 uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    {isJoining ? (
                      t("common.joining")
                    ) : isFull ? (
                      t("competitions.full")
                    ) : (
                      <>
                        {t("competitions.join")}
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
          </div>
        )}
      </div>
    </div>
  );
}
