import { type Gym } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { Dumbbell, MapPin, ShieldAlert, ShieldCheck, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../components/ui/NoData";
import Table, { type TableColumn } from "../../../../../components/ui/Table";
import { useModalStore } from "../../../../../store/modal";
import { useUpdateGymStatus } from "../hooks/useUpdateGymStatus";

interface GymTableProps {
  gyms: Gym[];
}

export const GymTable = ({ gyms }: GymTableProps) => {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { mutate: toggleStatus, isPending } = useUpdateGymStatus();

  const handleToggleStatus = (gym: Gym) => {
    const isActivating = !gym.isActive;

    openModal("confirm", {
      title: isActivating
        ? t("admin.gyms.modals.activate_title", "Activate Gym")
        : t("admin.gyms.modals.deactivate_title", "Deactivate Gym"),
      text: isActivating
        ? t(
            "admin.gyms.modals.activate_message",
            "Are you sure you want to activate this gym?",
          )
        : t(
            "admin.gyms.modals.deactivate_message",
            "Are you sure you want to deactivate this gym? Members will not be able to interact with it.",
          ),
      confirmText: isActivating ? t("common.activate") : t("common.deactivate"),
      confirmVariant: isActivating ? "primary" : "danger",
      onConfirm: () => toggleStatus(gym._id),
    });
  };

  const columns: TableColumn<Gym>[] = [
    {
      key: "name",
      header: t("admin.gyms.table.gym"),
      render: (gym) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
            {gym.logoUrl ? (
              <img
                src={gym.logoUrl}
                alt={gym.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              gym.name.charAt(0)
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-text-primary">{gym.name}</span>
            <span className="text-xs text-text-secondary">
              {gym.slogan || "Training Center"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "owner",
      header: t("admin.gyms.table.owner"),
      render: (gym) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-text-secondary" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">
              {gym.owner?.profile?.fullName ||
                gym.owner?.profile?.username ||
                "N/A"}
            </span>
            <span className="text-xs text-text-secondary lowercase">
              {gym.owner?.profile?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: t("admin.gyms.table.location"),
      render: (gym) => (
        <div className="flex items-center gap-1.5 text-text-secondary">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{gym.city || gym.country || "N/A"}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: t("admin.gyms.table.status"),
      render: (gym) => (
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${gym.isActive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"}`}
          />
          <span className="text-sm font-medium text-text-primary">
            {gym.isActive ? t("common.active") : t("common.inactive")}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: t("admin.gyms.table.joined"),
      render: (gym) => (
        <span className="text-sm text-text-secondary">
          {gym.createdAt
            ? format(new Date(gym.createdAt), "MMM dd, yyyy")
            : "N/A"}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (gym) => (
        <button
          onClick={() => handleToggleStatus(gym)}
          disabled={isPending}
          className={`p-2 rounded-lg transition-all ${
            gym.isActive
              ? "text-red-500 hover:bg-red-500/10"
              : "text-green-500 hover:bg-green-500/10"
          }`}
          title={gym.isActive ? t("common.deactivate") : t("common.activate")}
        >
          {gym.isActive ? (
            <ShieldAlert className="w-5 h-5" />
          ) : (
            <ShieldCheck className="w-5 h-5" />
          )}
        </button>
      ),
    },
  ];

  const renderMobileCard = (gym: Gym) => {
    return (
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
              {gym.logoUrl ? (
                <img
                  src={gym.logoUrl}
                  alt={gym.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                gym.name.charAt(0)
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-text-primary">
                {gym.name}
              </span>
              <span className="text-xs text-text-secondary">
                {gym.slogan || "Training Center"}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(gym);
            }}
            disabled={isPending}
            className={`p-2 rounded-lg transition-all ${
              gym.isActive
                ? "text-red-500 hover:bg-red-500/10"
                : "text-green-500 hover:bg-green-500/10"
            }`}
            title={gym.isActive ? t("common.deactivate") : t("common.activate")}
          >
            {gym.isActive ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              {t("admin.gyms.table.owner")}
            </span>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-text-secondary" />
              <span className="text-xs font-medium text-text-primary capitalize">
                {gym.owner?.profile?.fullName ||
                  gym.owner?.profile?.username ||
                  "N/A"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              {t("admin.gyms.table.status")}
            </span>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${gym.isActive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"}`}
              />
              <span className="text-xs font-medium text-text-primary">
                {gym.isActive ? t("common.active") : t("common.inactive")}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              {t("admin.gyms.table.location")}
            </span>
            <div className="flex items-center gap-1 text-text-primary font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs">
                {gym.city || gym.country || "N/A"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              {t("admin.gyms.table.joined")}
            </span>
            <span className="text-xs text-text-primary font-medium">
              {gym.createdAt
                ? format(new Date(gym.createdAt), "MMM dd, yyyy")
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Table<Gym>
      columns={columns}
      data={gyms}
      keyExtractor={(item) => item._id}
      renderMobileCard={renderMobileCard}
      emptyState={
        <NoData
          icon={Dumbbell}
          title={t("admin.gyms.empty")}
          description={t("admin.gyms.subtitle")}
          className="p-12"
        />
      }
    />
  );
};
