import { type GymMedia } from "@ahmedrioueche/gympro-client";
import { Download, ExternalLink, FileText, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "../../../../../../../components/ui/Card";
import NoData from "../../../../../../../components/ui/NoData";
import { useMarketing } from "../../../../../../../hooks/queries/useMarketing";
import { useModalStore } from "../../../../../../../store/modal";

interface MaterialsTabProps {
  gymId: string;
  media: GymMedia[];
  isLoading?: boolean;
  handleAddMaterial: () => void;
}

export default function MaterialsTab({
  gymId,
  media,
  isLoading,
  handleAddMaterial,
}: MaterialsTabProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { removeMedia } = useMarketing(gymId);

  const materialsMedia = media.filter((m) => m.type === "document");

  const handleDelete = (publicId: string) => {
    openModal("confirm", {
      title: t("common.delete"),
      text: t("marketing.form.confirmDelete"),
      confirmText: t("common.delete"),
      confirmVariant: "danger",
      onConfirm: () => removeMedia.mutate(publicId),
    });
  };

  if (materialsMedia.length === 0 && !isLoading) {
    return (
      <NoData
        title={t("marketing.materials.empty")}
        description={t("marketing.materials.emptyDesc")}
        actionButton={{
          label: t("marketing.materials.uploadAction"),
          onClick: handleAddMaterial,
          icon: Plus,
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materialsMedia.map((item) => (
          <Card
            key={item.publicId}
            className="group flex flex-col p-4 bg-bg-primary border-border hover:border-primary transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/5 text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="font-semibold text-text-primary truncate"
                  title={item.title}
                >
                  {item.title || t("marketing.form.file")}
                </h4>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                  {item.description || "No description provided"}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                <span className="text-[10px] text-text-secondary uppercase font-semibold">
                  {new Date(item.createdAt!).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(item.url, "_blank")}
                  className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  title={t("common.view")}
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = item.url;
                    link.download = item.title || "marketing-material";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  title={t("common.download")}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.publicId)}
                  className="p-2 text-text-secondary hover:text-danger hover:bg-danger/5 rounded-lg transition-colors"
                  disabled={removeMedia.isPending}
                  title={t("common.delete")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
