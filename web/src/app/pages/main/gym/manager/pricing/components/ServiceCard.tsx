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
    <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col justify-between group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-primary/10 p-3 rounded-xl text-primary ring-4 ring-primary/5">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
            <button
              onClick={() => onEdit(service)}
              className="p-2 hover:bg-background rounded-lg text-text-secondary hover:text-primary transition-colors"
              title={t("common.edit")}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(service._id)}
              className="p-2 hover:bg-red-50 rounded-lg text-text-secondary hover:text-error transition-colors"
              title={t("common.delete")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h4 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
          {service.name}
        </h4>

        {service.description && (
          <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed mb-4">
            {service.description}
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-primary/40" />
          {t("services.addedOn", "Added on")}:{" "}
          {new Date(service.createdAt || "").toLocaleDateString()}
        </span>
      </div>

      {/* Decorative background element */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
    </div>
  );
};
