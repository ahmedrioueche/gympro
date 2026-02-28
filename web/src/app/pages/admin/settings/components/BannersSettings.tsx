import type { AppBanner } from "@ahmedrioueche/gympro-client";
import { Edit2, Megaphone, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../components/ui/Button";
import Table, { type TableColumn } from "../../../../../components/ui/Table";
import { useAdminBanners } from "../../../../../hooks/queries/useBanners";
import { useModalStore } from "../../../../../store/modal";
import SettingsTab from "../../../../components/settings/SettingsTab";

export default function BannersSettings() {
  const { t } = useTranslation();
  const { banners, isLoading, deleteBanner } = useAdminBanners();
  const { openModal, closeModal } = useModalStore();

  const handleEdit = (banner: AppBanner) => {
    openModal("banner_form", { banner });
  };

  const handleCreate = () => {
    openModal("banner_form");
  };

  const handleDeleteClick = (bannerId: string) => {
    openModal("confirm", {
      title: t("settings.banners.deleteTitle", "Delete Banner"),
      text: t(
        "settings.banners.deleteDesc",
        "Are you sure you want to delete this banner? This action cannot be undone.",
      ),
      confirmText: t("common.delete", "Delete"),
      confirmVariant: "danger",
      onConfirm: () => {
        deleteBanner(bannerId);
        closeModal();
      },
    });
  };

  const columns: TableColumn<AppBanner>[] = [
    {
      key: "status",
      header: t("common.status", "Status"),
      render: (banner) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${banner.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
        >
          {banner.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "message",
      header: t("common.message", "Message"),
      render: (banner) => (
        <div className="max-w-sm truncate text-text-primary font-medium">
          {banner.translations?.["en"] ||
            Object.values(banner.translations || {})[0] ||
            "No Text"}
        </div>
      ),
    },
    {
      key: "type",
      header: t("common.type", "Type"),
      render: (banner) => (
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
            banner.variant === "warning"
              ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
              : banner.variant === "error"
                ? "bg-red-500/20 text-red-600 dark:text-red-400"
                : banner.variant === "success"
                  ? "bg-green-500/20 text-green-600 dark:text-green-400"
                  : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
          }`}
        >
          {banner.variant}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("common.actions", "Actions"),
      align: "right",
      render: (banner) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(banner);
            }}
            className="p-2 hover:bg-black/10 rounded-lg transition-colors text-primary"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(banner._id);
            }}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const renderMobileCard = (banner: AppBanner) => (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex gap-2 items-center">
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
              banner.variant === "warning"
                ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                : banner.variant === "error"
                  ? "bg-red-500/20 text-red-600 dark:text-red-400"
                  : banner.variant === "success"
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
            }`}
          >
            {banner.variant}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${banner.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
          >
            {banner.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(banner);
            }}
            className="p-2 hover:bg-black/10 rounded-lg transition-colors text-primary"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(banner._id);
            }}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="text-text-primary font-medium line-clamp-2">
        {banner.translations?.["en"] ||
          Object.values(banner.translations || {})[0] ||
          "No Text"}
      </div>
    </div>
  );

  return (
    <SettingsTab
      title={t("settings.banners.title", "System Announcements")}
      description={t(
        "settings.banners.description",
        "Manage global banners and alerts displayed to all users.",
      )}
      icon={Megaphone}
      headerAction={
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus size={16} /> {t("common.create", "Create Banner")}
        </Button>
      }
    >
      <Table<AppBanner>
        columns={columns}
        data={banners}
        keyExtractor={(b) => b._id}
        isLoading={isLoading}
        renderMobileCard={renderMobileCard}
        emptyState={
          <div className="flex flex-col items-center gap-2 text-text-secondary">
            <Megaphone className="opacity-50" size={32} />
            <p>{t("settings.banners.empty", "No active banners found.")}</p>
          </div>
        }
      />
    </SettingsTab>
  );
}
