import { type EquipmentItem } from "@ahmedrioueche/gympro-client";
import { Calendar, Edit2, MoreVertical, Package, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Dropdown, {
  DropdownItem,
} from "../../../../../../../components/ui/Dropdown";
import { ConditionBadge } from "./InventoryTable";

interface InventoryCardProps {
  item: EquipmentItem;
  onEdit: (item: EquipmentItem) => void;
  onDelete: (item: EquipmentItem) => void;
}

export function InventoryCard({ item, onEdit, onDelete }: InventoryCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
            ⚙️
          </div>
        )}
        <div className="absolute top-3 left-3">
          <ConditionBadge condition={item.condition} t={t} />
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dropdown
            trigger={
              <button className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full transition-colors text-text-primary shadow-sm border border-border">
                <MoreVertical className="w-4 h-4" />
              </button>
            }
          >
            <DropdownItem
              label={t("common.edit", { defaultValue: "Edit" })}
              icon={<Edit2 className="w-4 h-4" />}
              onClick={() => onEdit(item)}
            />
            <DropdownItem
              label={t("common.delete", { defaultValue: "Delete" })}
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => onDelete(item)}
              variant="danger"
            />
          </Dropdown>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-text-primary text-lg truncate pr-2">
              {item.name}
            </h3>
            <span className="text-xs text-primary font-bold uppercase tracking-wider">
              {t(`inventory.categories.${item.category}`, {
                defaultValue: item.category,
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-lg">
            <Package className="w-4 h-4 text-text-secondary" />
            <span className="font-bold text-text-primary">{item.quantity}</span>
          </div>
        </div>

        {item.brand && (
          <p className="text-sm text-text-secondary mb-4 line-clamp-1 italic">
            {item.brand} {item.modelNumber ? `• ${item.modelNumber}` : ""}
          </p>
        )}

        <div className="space-y-2 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Calendar className="w-3.5 h-3.5" />
              {t("inventory.card.nextService", {
                defaultValue: "Next Service",
              })}
            </div>
            <span
              className={`font-medium ${item.nextServiceDueDate ? "text-text-primary" : "text-text-muted"}`}
            >
              {item.nextServiceDueDate
                ? new Date(item.nextServiceDueDate).toLocaleDateString()
                : t("common.notSet", { defaultValue: "Not set" })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
