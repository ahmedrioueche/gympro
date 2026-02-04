import { type Gym, type GymMedia } from "@ahmedrioueche/gympro-client";
import {
  Check,
  ExternalLink,
  Image as ImageIcon,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "../../../../../../../components/ui/Card";
import NoData from "../../../../../../../components/ui/NoData";
import { useMarketing } from "../../../../../../../hooks/queries/useMarketing";
import { useModalStore } from "../../../../../../../store/modal";

interface GalleryTabProps {
  gym: Gym;
  media: GymMedia[];
  isLoading?: boolean;
  handleAddMedia: () => void;
}

export default function GalleryTab({
  gym,
  media,
  isLoading,
  handleAddMedia,
}: GalleryTabProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { removeMedia, setBanner } = useMarketing(gym._id);

  const galleryMedia = media.filter(
    (m) => m.type === "image" || m.type === "video",
  );

  const handleSetBanner = (item: GymMedia) => {
    openModal("confirm", {
      title: t("marketing.gallery.setBanner"),
      text: t("marketing.gallery.confirmBanner"),
      confirmText: t("common.confirm"),
      confirmVariant: "primary",
      onConfirm: () =>
        setBanner.mutate({ url: item.url, publicId: item.publicId }),
    });
  };

  const handleDelete = (publicId: string) => {
    openModal("confirm", {
      title: t("common.delete"),
      text: t("marketing.form.confirmDelete"),
      confirmText: t("common.delete"),
      confirmVariant: "danger",
      onConfirm: () => removeMedia.mutate(publicId),
    });
  };

  if (galleryMedia.length === 0 && !isLoading) {
    return (
      <NoData
        title={t("marketing.gallery.empty")}
        description={t("marketing.gallery.emptyDesc")}
        actionButton={{
          label: t("marketing.gallery.uploadAction"),
          onClick: handleAddMedia,
          icon: Plus,
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {galleryMedia.map((item) => (
          <Card
            key={item.publicId}
            className="group relative overflow-hidden h-full flex flex-col"
          >
            <div className="aspect-video relative overflow-hidden bg-bg-secondary">
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/10">
                  <Video className="w-12 h-12 text-text-secondary" />
                </div>
              )}

              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.type === "image" &&
                  item.publicId !== gym.bannerPublicId && (
                    <button
                      onClick={() => handleSetBanner(item)}
                      className="p-1.5 bg-primary/90 text-white rounded-md hover:bg-primary shadow-sm"
                      disabled={setBanner.isPending}
                      title={t("marketing.gallery.setBanner")}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  )}
                <button
                  onClick={() => window.open(item.url, "_blank")}
                  className="p-1.5 bg-surface text-text-primary rounded-md hover:bg-surface/70 shadow-sm"
                  title={t("common.view")}
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.publicId)}
                  className="p-1.5 bg-danger/90 text-white rounded-md hover:bg-danger shadow-sm"
                  disabled={removeMedia.isPending}
                  title={t("common.delete")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {item.category && (
                <div className="absolute bottom-2 left-2 flex gap-1">
                  {item.publicId === gym.bannerPublicId && (
                    <span className="px-2 py-0.5 bg-success text-white text-[10px] font-bold uppercase tracking-wider rounded backdrop-blur-sm flex items-center gap-1">
                      <Check className="w-3 h-3" />{" "}
                      {t("marketing.gallery.currentBanner")}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-black/50 text-white text-[10px] font-bold uppercase tracking-wider rounded backdrop-blur-sm">
                    {t(`marketing.gallery.categories.${item.category}`)}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-text-primary line-clamp-1">
                  {item.title || t(`marketing.gallery.types.${item.type}`)}
                </h4>
                {item.type === "video" ? (
                  <Video className="w-4 h-4 text-text-secondary shrink-0" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-text-secondary shrink-0" />
                )}
              </div>
              {item.description && (
                <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                  {item.description}
                </p>
              )}
              <p className="mt-2 text-[10px] text-text-secondary uppercase tracking-tight">
                {item.createdAt &&
                  new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
