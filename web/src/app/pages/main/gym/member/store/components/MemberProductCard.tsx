import { type Product } from "@ahmedrioueche/gympro-client";
import { Eye, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/ui/Button";

interface MemberProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export function MemberProductCard({
  product,
  onViewDetails,
}: MemberProductCardProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const productThumbnail = product.images?.[0];

  return (
    <div className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {!imageError && productThumbnail ? (
          <img
            src={productThumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-background">
            <ShoppingBag className="w-16 h-16 text-text-muted/30" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
            {t(`store.categories.${product.category}`)}
          </span>
        </div>

        {/* Out of Stock Badge */}
        {product.status === "out_of_stock" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-danger text-white rounded-xl text-sm font-bold uppercase tracking-wider">
              {t("store.status.out_of_stock")}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="font-bold text-lg text-text-primary line-clamp-2 group-hover:text-primary transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {product.description && (
          <p className="text-sm text-text-secondary line-clamp-2 flex-1">
            {product.description}
          </p>
        )}

        {/* Price & CTA */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-primary">
              {product.price}
              <span className="text-sm ml-1 font-bold opacity-80">
                {product.currency}
              </span>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(product)}
            aria-label={t("store.details.title")}
          >
            <Eye className="w-4 h-4 mr-1.5" />
            {t("common.view")}
          </Button>
        </div>
      </div>
    </div>
  );
}
