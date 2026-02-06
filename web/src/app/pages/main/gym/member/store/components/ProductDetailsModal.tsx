import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import { useModalStore } from "../../../../../../../store/modal";

export default function ProductDetailsModal() {
  const { t } = useTranslation();
  const { currentModal, productDetailsProps, closeModal } = useModalStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const isOpen = currentModal === "product-details";
  const product = productDetailsProps?.product;

  if (!isOpen || !product) return null;

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      icon={ShoppingBag}
      title={product.name}
      maxWidth="max-w-3xl"
      secondaryButton={{
        label: t("common.close"),
        onClick: closeModal,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Section */}
        <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
          {!imageError && images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {/* Image Indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white w-4"
                            : "bg-white/50 hover:bg-white/70"
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-background">
              <ShoppingBag className="w-20 h-20 text-text-muted/30" />
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
              {t(`store.categories.${product.category}`)}
            </span>
          </div>

          {/* Out of Stock Badge */}
          {product.status === "out_of_stock" && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1.5 bg-danger text-white rounded-lg text-xs font-bold uppercase shadow-lg">
                {t("store.status.out_of_stock")}
              </span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="flex flex-col gap-4">
          {/* Price */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <span className="text-3xl font-black text-primary">
              {product.price}
              <span className="text-lg ml-1 font-bold opacity-80">
                {product.currency}
              </span>
            </span>
          </div>

          {/* Description */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
              {t("common.description")}
            </h4>
            <p className="text-text-primary leading-relaxed">
              {product.description || t("store.details.noDescription")}
            </p>
          </div>

          {/* Contact CTA */}
          <div className="bg-surface border border-border rounded-xl p-4 mt-auto">
            <div className="flex items-center gap-3 text-text-secondary">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {t("store.details.contactGym")}
                </p>
                <p className="text-xs text-text-secondary">
                  {t("store.details.visitFrontDesk")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
