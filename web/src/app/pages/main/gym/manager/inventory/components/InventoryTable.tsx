import {
  type EquipmentCondition,
  type EquipmentItem,
} from "@ahmedrioueche/gympro-client";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Dropdown, {
  DropdownItem,
} from "../../../../../../../components/ui/Dropdown";
import {
  Table,
  type TableColumn,
} from "../../../../../../../components/ui/Table";

interface InventoryTableProps {
  items: EquipmentItem[];
  isLoading: boolean;
  onEdit: (item: EquipmentItem) => void;
  onDelete: (item: EquipmentItem) => void;
}

export function InventoryTable({
  items,
  isLoading,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  const { t } = useTranslation();

  const columns: TableColumn<EquipmentItem>[] = [
    {
      key: "name",
      header: t("inventory.table.name", { defaultValue: "Equipment" }),
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.images?.[0] ? (
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-10 h-10 rounded-lg object-cover border border-border"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg border border-border">
              ⚙️
            </div>
          )}
          <div>
            <div className="font-medium text-text-primary">{item.name}</div>
            <div className="text-xs text-text-secondary">
              {item.brand || t("common.noBrand", { defaultValue: "No Brand" })}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: t("inventory.table.category", { defaultValue: "Category" }),
      render: (item) => (
        <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium capitalize">
          {t(`inventory.categories.${item.category}`, {
            defaultValue: item.category,
          })}
        </span>
      ),
    },
    {
      key: "quantity",
      header: t("inventory.table.quantity", { defaultValue: "Qty" }),
      align: "center" as const,
      render: (item) => (
        <span className="font-medium text-text-primary">{item.quantity}</span>
      ),
    },
    {
      key: "condition",
      header: t("inventory.table.condition", { defaultValue: "Condition" }),
      render: (item) => <ConditionBadge condition={item.condition} t={t} />,
    },
    {
      key: "nextService",
      header: t("inventory.table.nextService", {
        defaultValue: "Next Service",
      }),
      render: (item) => (
        <span className="text-sm text-text-secondary">
          {item.nextServiceDueDate
            ? new Date(item.nextServiceDueDate).toLocaleDateString()
            : t("common.notSet", { defaultValue: "Not set" })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (item) => (
        <Dropdown
          trigger={
            <button className="p-2 hover:bg-muted rounded-full transition-colors text-text-secondary">
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
      ),
    },
  ];

  const renderMobileCard = (item: EquipmentItem) => {
    return (
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {item.images?.[0] ? (
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-10 h-10 rounded-lg object-cover border border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg border border-border">
                ⚙️
              </div>
            )}
            <div>
              <div className="font-semibold text-text-primary">{item.name}</div>
              <div className="text-xs text-text-secondary">
                {item.brand ||
                  t("common.noBrand", { defaultValue: "No Brand" })}
              </div>
            </div>
          </div>
          <Dropdown
            trigger={
              <button className="p-2 hover:bg-muted rounded-full transition-colors text-text-secondary">
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

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              {t("inventory.table.category", { defaultValue: "Category" })}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase w-fit">
              {t(`inventory.categories.${item.category}`, {
                defaultValue: item.category,
              })}
            </span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              {t("inventory.table.condition", { defaultValue: "Condition" })}
            </span>
            <ConditionBadge condition={item.condition} t={t} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              {t("inventory.table.quantity", { defaultValue: "Qty" })}
            </span>
            <span className="text-sm font-bold text-text-primary">
              {item.quantity}
            </span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider text-right">
              {t("inventory.table.nextService", {
                defaultValue: "Next Service",
              })}
            </span>
            <span className="text-[10px] text-text-primary font-medium text-right">
              {item.nextServiceDueDate
                ? new Date(item.nextServiceDueDate).toLocaleDateString()
                : t("common.notSet", { defaultValue: "Not set" })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Table<EquipmentItem>
      columns={columns}
      data={items}
      isLoading={isLoading}
      keyExtractor={(item) => item._id}
      renderMobileCard={renderMobileCard}
      emptyState={
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🛠️</div>
          <h3 className="text-lg font-medium text-text-primary">
            {t("inventory.empty.title", { defaultValue: "No equipment found" })}
          </h3>
          <p className="text-text-secondary">
            {t("inventory.empty.message", {
              defaultValue:
                "Start by adding your gym equipment to keep track of maintenance and stock.",
            })}
          </p>
        </div>
      }
    />
  );
}

export function ConditionBadge({
  condition,
  t,
}: {
  condition: EquipmentCondition;
  t: any;
}) {
  const config: Record<EquipmentCondition, { bg: string; text: string }> = {
    good: { bg: "bg-green-500/10", text: "text-green-500" },
    needs_maintenance: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
    broken: { bg: "bg-red-500/10", text: "text-red-500" },
    out_of_service: { bg: "bg-gray-500/10", text: "text-gray-500" },
  };

  const { bg, text } = config[condition] || config.good;

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-current shadow-sm ${bg} ${text}`}
    >
      {t(`inventory.conditions.${condition}`, {
        defaultValue: condition.replace("_", " "),
      })}
    </span>
  );
}
