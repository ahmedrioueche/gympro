import { type Product } from "@ahmedrioueche/gympro-client";
import { Edit2, MoreVertical, Package, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Dropdown, {
  DropdownItem,
} from "../../../../../../../components/ui/Dropdown";
import {
  Table,
  type TableColumn,
} from "../../../../../../../components/ui/Table";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({
  products,
  isLoading,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const { t } = useTranslation();

  const statusColors = {
    active: "bg-success/10 text-success border-success/20",
    out_of_stock: "bg-danger/10 text-danger border-danger/20",
    hidden: "bg-muted text-text-secondary border-border",
  };

  const columns: TableColumn<Product>[] = [
    {
      key: "name",
      header: t("store.table.product"),
      render: (product) => (
        <div className="flex items-center gap-3">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-10 h-10 rounded-lg object-cover border border-border"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg border border-border">
              📦
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider leading-none mb-0.5">
              {t(`store.categories.${product.category}`)}
            </span>
            <div
              className="font-medium text-text-primary truncate"
              title={product.name}
            >
              {product.name}
            </div>
            {product.sku && (
              <span className="text-[10px] font-mono text-text-muted">
                {product.sku}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: t("store.table.price"),
      render: (product) => (
        <div className="font-black text-primary">
          {product.price}
          <span className="text-[10px] ml-0.5 uppercase">
            {product.currency}
          </span>
        </div>
      ),
    },
    {
      key: "quantity",
      header: t("store.table.quantity"),
      render: (product) => (
        <div className="flex items-center gap-1.5 text-text-secondary">
          <Package className="w-4 h-4" />
          <span className="font-medium">
            {product.status === "out_of_stock" ? "0" : product.quantity}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: t("store.table.status"),
      render: (product) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-current shadow-sm ${
            statusColors[product.status]
          }`}
        >
          {t(`store.status.${product.status}`)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (product) => (
        <Dropdown
          trigger={
            <button className="p-2 hover:bg-muted rounded-full transition-colors text-text-secondary">
              <MoreVertical className="w-4 h-4" />
            </button>
          }
        >
          {(close) => (
            <>
              <DropdownItem
                label={t("common.edit")}
                icon={<Edit2 className="w-4 h-4" />}
                onClick={() => {
                  onEdit(product);
                  close();
                }}
              />
              <DropdownItem
                label={t("common.delete")}
                icon={<Trash2 className="w-4 h-4" />}
                variant="danger"
                onClick={() => {
                  onDelete(product);
                  close();
                }}
              />
            </>
          )}
        </Dropdown>
      ),
    },
  ];

  const renderMobileCard = (product: Product) => {
    return (
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-10 h-10 rounded-lg object-cover border border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg border border-border">
                📦
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider leading-none mb-0.5">
                {t(`store.categories.${product.category}`)}
              </span>
              <div className="font-medium text-text-primary truncate max-w-[150px]">
                {product.name}
              </div>
              {product.sku && (
                <span className="text-[10px] font-mono text-text-muted">
                  {product.sku}
                </span>
              )}
            </div>
          </div>
          <Dropdown
            trigger={
              <button className="p-2 hover:bg-muted rounded-full transition-colors text-text-secondary">
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            }
          >
            {(close) => (
              <>
                <DropdownItem
                  label={t("common.edit")}
                  icon={<Edit2 className="w-4 h-4" />}
                  onClick={() => {
                    onEdit(product);
                    close();
                  }}
                />
                <DropdownItem
                  label={t("common.delete")}
                  icon={<Trash2 className="w-4 h-4" />}
                  variant="danger"
                  onClick={() => {
                    onDelete(product);
                    close();
                  }}
                />
              </>
            )}
          </Dropdown>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              {t("store.table.price")}
            </span>
            <div className="font-black text-primary">
              {product.price}
              <span className="text-[10px] ml-0.5 uppercase">
                {product.currency}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              {t("store.table.status")}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-current shadow-sm ${
                statusColors[product.status]
              }`}
            >
              {t(`store.status.${product.status}`)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
            {t("store.table.quantity")}
          </span>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Package className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {product.status === "out_of_stock" ? "0" : product.quantity}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Table<Product>
      columns={columns}
      data={products}
      isLoading={isLoading}
      keyExtractor={(product) => product._id}
      renderMobileCard={renderMobileCard}
    />
  );
}
