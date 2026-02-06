import { type EquipmentItem } from "@ahmedrioueche/gympro-client";
import { Package } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface MemberEquipmentCardProps {
  item: EquipmentItem;
}

const conditionColors: Record<string, string> = {
  excellent: "bg-success/10 text-success border-success/20",
  good: "bg-primary/10 text-primary border-primary/20",
  fair: "bg-warning/10 text-warning border-warning/20",
  poor: "bg-danger/10 text-danger border-danger/20",
  out_of_service: "bg-muted text-text-muted border-border",
};

export function MemberEquipmentCard({ item }: MemberEquipmentCardProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {!imageError && item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-background">
            <Package className="w-16 h-16 text-text-muted/30" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
            {t(`inventory.categories.${item.category}`, {
              defaultValue: item.category,
            })}
          </span>
        </div>

        {/* Condition Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-lg text-xs font-bold border ${conditionColors[item.condition] || conditionColors.good}`}
          >
            {t(`inventory.conditions.${item.condition}`, {
              defaultValue: item.condition,
            })}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-text-primary text-lg truncate group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            {item.brand && (
              <p className="text-sm text-text-secondary line-clamp-1">
                {item.brand} {item.modelNumber ? `• ${item.modelNumber}` : ""}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-lg ml-2">
            <Package className="w-4 h-4 text-text-secondary" />
            <span className="font-bold text-text-primary">{item.quantity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
