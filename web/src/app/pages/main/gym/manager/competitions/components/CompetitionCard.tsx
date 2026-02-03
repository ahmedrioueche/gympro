import { type Competition } from "@ahmedrioueche/gympro-client";
import { Calendar, MoreVertical, Trophy, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import Dropdown, {
  DropdownItem,
} from "../../../../../../../components/ui/Dropdown";

interface CompetitionCardProps {
  competition: Competition;
  onEdit: (competition: Competition) => void;
  onDelete: (competition: Competition) => void;
}

export function CompetitionCard({
  competition,
  onEdit,
  onDelete,
}: CompetitionCardProps) {
  const { t } = useTranslation();

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
        return "bg-surface-tertiary text-text-secondary border-border";
    }
  };

  return (
    <div className="group bg-surface border border-border rounded-2xl overflow-visible hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row shadow-sm hover:shadow-xl relative">
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
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(
              competition.status,
            )} backdrop-blur-md uppercase tracking-wider shadow-sm`}
          >
            {t(`competitions.status.${competition.status}`)}
          </span>
        </div>
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

            {/* Actions Dropdown - Positioned here to avoid overflow clipping */}
            <div className="relative z-10">
              <Dropdown
                align="right"
                trigger={
                  <button className="p-2 hover:bg-surface-secondary rounded-xl text-text-secondary transition-all border border-transparent hover:border-border">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                }
              >
                <DropdownItem
                  label={t("common.edit")}
                  onClick={() => onEdit(competition)}
                />
                <DropdownItem
                  label={t("common.delete")}
                  variant="danger"
                  onClick={() => onDelete(competition)}
                />
              </Dropdown>
            </div>
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
                  <span className="text-text-secondary font-bold">
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

            <div className="flex items-center gap-3 bg-surface-secondary/50 p-3 rounded-xl border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shadow-sm">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-tight">
                  {t("common.startDate")}
                </span>
                <span className="text-xs font-semibold text-text-primary">
                  {new Date(competition.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-surface-secondary/50 p-3 rounded-xl border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shadow-sm">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-tight">
                  {t("common.endDate")}
                </span>
                <span className="text-xs font-semibold text-text-primary">
                  {new Date(competition.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
