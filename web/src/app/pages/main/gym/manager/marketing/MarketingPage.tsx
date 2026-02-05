import { Megaphone, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Tab from "../../../../../../components/ui/Tab";
import { useGym } from "../../../../../../hooks/queries/useGyms";
import { useGymStore } from "../../../../../../store/gym";
import { useModalStore } from "../../../../../../store/modal";
import PageHeader from "../../../../../components/PageHeader";
import GalleryTab from "./components/GalleryTab";
import MaterialsTab from "./components/MaterialsTab";

type ActiveTab = "gallery" | "materials";

function MarketingPage() {
  const { t } = useTranslation();
  const { currentGym: storeGym } = useGymStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>("gallery");
  const { openModal } = useModalStore();

  const handleAdd = () => {
    openModal("add-gym-media", {
      gymId: currentGym._id,
      // Only fix type for materials tab, gallery allows image or video selection
      type: activeTab === "materials" ? "document" : undefined,
    });
  };

  // Use useGym hook to get fresh data, syncing with React Query invalidations
  const { data: gym, isLoading } = useGym(storeGym?._id || "", !!storeGym);

  const currentGym = gym || storeGym;

  if (!currentGym) return null;

  const media = currentGym.media || [];
  const galleryCount = media.filter(
    (m) => m.type === "image" || m.type === "video",
  ).length;
  const materialsCount = media.filter((m) => m.type === "document").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("marketing.title")}
        subtitle={t("marketing.subtitle")}
        icon={Megaphone}
        actionButton={{
          label:
            activeTab === "gallery"
              ? t("marketing.gallery.uploadAction")
              : t("marketing.materials.uploadAction"),
          onClick: handleAdd,
          icon: Plus,
        }}
      />

      <div className="border-b border-border">
        <div className="flex gap-8">
          <Tab
            label={t("marketing.tabs.gallery")}
            isActive={activeTab === "gallery"}
            onClick={() => setActiveTab("gallery")}
            count={galleryCount}
          />
          <Tab
            label={t("marketing.tabs.materials")}
            isActive={activeTab === "materials"}
            onClick={() => setActiveTab("materials")}
            count={materialsCount}
          />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "gallery" ? (
          <GalleryTab
            gym={currentGym}
            media={media}
            isLoading={isLoading}
            handleAddMedia={handleAdd}
          />
        ) : (
          <MaterialsTab
            gymId={currentGym._id}
            media={media}
            isLoading={isLoading}
            handleAddMaterial={handleAdd}
          />
        )}
      </div>
    </div>
  );
}

export default MarketingPage;
