import {
  type GetSubscriptionDto,
  type User,
} from "@ahmedrioueche/gympro-client";
import { Edit } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../components/ui/Button";
import { useModalStore } from "../../../../../../store/modal";

function ProfileOverview({
  user,
  subscription,
}: {
  user: User;
  subscription: GetSubscriptionDto;
}) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  // Get account status from subscription
  const getAccountStatus = () => {
    if (!subscription?.plan) {
      return t("home.manager.profile.status.free");
    }

    if (subscription.trial && !subscription.trial.convertedToPaid) {
      return t("home.manager.profile.status.freeTrial");
    }

    return subscription.plan.name || t("home.manager.profile.status.active");
  };

  const getStatusColor = () => {
    if (!subscription?.plan) return "text-slate-600 dark:text-slate-400";
    if (subscription.trial && !subscription.trial.convertedToPaid)
      return "text-yellow-600";
    if (subscription.status === "active") return "text-green-600";
    if (subscription.status === "cancelled") return "text-red-600";
    return "text-slate-600 dark:text-slate-400";
  };

  const managerData = {
    name: user.profile.fullName || user.profile.username,
    subName: user.profile.fullName
      ? user.profile.username
      : user.profile.country,
    accountStatus: getAccountStatus(),
    statusColor: getStatusColor(),
  };

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-purple-600/10 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg">
            {managerData.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              {managerData.name}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
              {managerData.subName}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex items-center bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-5 py-2.5 h-[42px]">
            <p className={`text-sm font-semibold ${managerData.statusColor}`}>
              {managerData.accountStatus}
            </p>
          </div>

          <Button
            onClick={() => {
              openModal("edit_user_profile");
            }}
            className="group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-[42px] text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {t("home.manager.profile.editProfile")}
            <Edit className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileOverview;
