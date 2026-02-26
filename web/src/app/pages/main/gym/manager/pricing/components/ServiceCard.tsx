import type { GymService } from "@ahmedrioueche/gympro-client";
import { Dumbbell, Edit2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ServiceCardProps {
  service: GymService;
  onEdit: (service: GymService) => void;
  onDelete: (serviceId: string) => void;
}

export const ServiceCard = ({
  service,
  onEdit,
  onDelete,
}: ServiceCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="group relative overflow-hidden flex flex-col rounded-3xl border border-border/50 bg-surface p-4 md:p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 h-full">
      {/* Background Gradient Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-primary to-indigo-600 opacity-10 blur-3xl group-hover:opacity-20 transition-opacity" />

      {/* Header */}
      <div className="mb-4 relative z-10 flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/10 shrink-0">
          <Dumbbell className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <h3 className="text-lg md:text-xl font-black text-text-primary tracking-tight line-clamp-2">
          {service.name}
        </h3>
      </div>

      {/* Description */}
      {service.description ? (
        <p className="text-xs md:text-sm text-text-secondary font-medium mb-6 line-clamp-3 relative z-10">
          {service.description}
        </p>
      ) : (
        <p className="text-xs md:text-sm text-text-secondary font-medium mb-6 line-clamp-3 relative z-10 italic opacity-60">
          {t("common.noDescription", "No description")}
        </p>
      )}

      {/* Information Area (e.g. Added On) */}
      <div className="mb-5 flex-1 flex flex-col justify-end relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          <span className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-wider">
            {t("services.addedOn", "Added on")}:{" "}
            {new Date(service.createdAt || "").toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto relative z-10">
        <div className="flex gap-2 pt-4 border-t border-border/50">
          <button
            onClick={() => onEdit(service)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 bg-surface-secondary hover:bg-surface-secondary/80 text-text-primary border border-border/50 rounded-2xl transition-all text-[11px] md:text-xs font-black uppercase tracking-widest"
          >
            <Edit2 className="w-4 h-4" />
            {t("common.edit")}
          </button>
          <button
            onClick={() => onDelete(service._id)}
            className="flex items-center justify-center px-4 py-2.5 md:py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/10 rounded-2xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
