import { type Product } from "@ahmedrioueche/gympro-client";
import {
  Edit2,
  MoreVertical,
  Package,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Dropdown, {
  DropdownItem,
} from "../../../../../../../components/ui/Dropdown";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const statusColors = {
    active: "bg-success/10 text-success border-success/20",
    out_of_stock: "bg-danger/10 text-danger border-danger/20",
    hidden: "bg-muted text-text-secondary border-border",
  };

  const productThumbnail = product.images?.[0];

  return (
    <div className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {!imageError && productThumbnail ? (
          <img
            src={productThumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <ShoppingBag className="w-12 h-12 opacity-20" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
              statusColors[product.status]
            }`}
          >
            {t(`store.status.${product.status}`)}
          </span>
        </div>

        {/* Actions Dropdown */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dropdown
            trigger={
              <button className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-xl shadow-lg border border-border transition-colors">
                <MoreVertical className="w-4 h-4 text-primary" />
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
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              {t(`store.categories.${product.category}`)}
            </span>
            <h3
              className="font-bold text-text-primary truncate"
              title={product.name}
            >
              {product.name}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-black text-primary leading-none">
              {product.price}
              <span className="text-xs ml-0.5 uppercase">
                {product.currency}
              </span>
            </div>
          </div>
        </div>

        {product.description && (
          <p className="text-sm text-text-secondary line-clamp-2">
            {product.description}
          </p>
        )}
        {product.status !== "out_of_stock" && (
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Package className="w-4 h-4" />
              <span className="text-sm font-medium">
                {product.quantity} {t("store.form.quantity")}
              </span>
            </div>
          </div>
        )}
        {product.sku && (
          <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-text-muted">
            {product.sku}
          </span>
        )}
      </div>
    </div>
  );
}
