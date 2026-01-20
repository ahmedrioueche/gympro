import {
  type GetSubscriptionDto,
  type User,
} from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Edit,
  Mail,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
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

  const getAccountStatus = () => {
    if (!subscription?.plan) {
      return {
        label: t("home.manager.profile.status.free"),
        color: "text-text-secondary",
        bgColor: "bg-surface-hover",
        borderColor: "border-border",
        icon: AlertCircle,
      };
    }

    if (subscription.trial && !subscription.trial.convertedToPaid) {
      return {
        label: t("home.manager.profile.status.freeTrial"),
        color: "text-warning",
        bgColor: "bg-warning/10",
        borderColor: "border-warning/20",
        icon: AlertCircle,
      };
    }

    if (subscription.status === "active") {
      return {
        label:
          subscription.plan.name || t("home.manager.profile.status.active"),
        color: "text-success",
        bgColor: "bg-success/10",
        borderColor: "border-success/20",
        icon: CheckCircle2,
      };
    }

    if (subscription.status === "cancelled") {
      return {
        label: t("home.manager.profile.status.cancelled"),
        color: "text-danger",
        bgColor: "bg-danger/10",
        borderColor: "border-danger/20",
        icon: AlertCircle,
      };
    }

    return {
      label: subscription.plan.name || t("home.manager.profile.status.active"),
      color: "text-text-secondary",
      bgColor: "bg-surface-hover",
      borderColor: "border-border",
      icon: CheckCircle2,
    };
  };

  const accountStatus = getAccountStatus();
  const StatusIcon = accountStatus.icon;

  const getLocation = () => {
    const parts = [
      user.profile.city,
      user.profile.state,
      user.profile.country,
    ].filter(Boolean);
    return (
      parts.join(", ") ||
      user.appSettings.locale.regionName ||
      t("home.manager.profile.noLocation")
    );
  };

  const getRoleDisplay = () => {
    const roleKey = `home.manager.profile.roles.${user.role}`;
    return t(roleKey);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-20 -mt-20 opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full -ml-20 -mb-20 opacity-30" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-6">
          {/* Avatar & Primary Info */}
          <div className="flex items-start gap-4">
            {user.profile.profileImageUrl ? (
              <img
                src={user.profile.profileImageUrl}
                alt=""
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-border shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {(user.profile.fullName || user.profile.username)
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">
                {user.profile.fullName || user.profile.username}
              </h1>
              {user.profile.fullName && user.profile.username && (
                <p className="text-text-secondary text-sm mb-2">
                  @{user.profile.username}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-hover text-text-secondary text-xs font-semibold rounded-lg border border-border">
                  <Shield className="w-3.5 h-3.5" />
                  {getRoleDisplay()}
                </span>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 ${accountStatus.bgColor} ${accountStatus.color} text-xs font-semibold rounded-lg border ${accountStatus.borderColor}`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  {accountStatus.label}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => openModal("edit_user_profile")}
            className="lg:ml-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-11 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md shrink-0"
          >
            {t("home.manager.profile.viewProfile")}
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        {/* Contact & Additional Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-border">
          {/* Email */}
          {user.profile.email && (
            <div className="flex items-center gap-3 text-text-secondary group">
              <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center border border-border">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-secondary font-medium">
                  {t("home.manager.profile.email")}
                </p>
                <p className="text-sm font-semibold text-text-primary truncate">
                  {user.profile.email}
                </p>
              </div>
            </div>
          )}

          {/* Phone */}
          {user.profile.phoneNumber && (
            <div className="flex items-center gap-3 text-text-secondary group">
              <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center border border-border">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-secondary font-medium">
                  {t("home.manager.profile.phone")}
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {user.profile.phoneNumber}
                  {user.profile.phoneNumberVerified && (
                    <CheckCircle2 className="inline w-3.5 h-3.5 ml-1 text-success" />
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-3 text-text-secondary group">
            <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center border border-border">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-secondary font-medium">
                {t("home.manager.profile.location")}
              </p>
              <p className="text-sm font-semibold text-text-primary truncate">
                {getLocation()}
              </p>
            </div>
          </div>

          {/* Member Since */}
          {user.createdAt && (
            <div className="flex items-center gap-3 text-text-secondary group">
              <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center border border-border">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-secondary font-medium">
                  {t("home.manager.profile.memberSince")}
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {format(new Date(user.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          )}

          {/* Active Memberships */}
          {user.memberships && user.memberships.length > 0 && (
            <div className="flex items-center gap-3 text-text-secondary group">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center border border-success/20">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-secondary font-medium">
                  {t("home.manager.profile.activeMemberships")}
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {user.memberships.length} {t("home.manager.profile.gyms")}
                </p>
              </div>
            </div>
          )}

          {/* Account Status Info */}
          <div className="flex items-center gap-3 text-text-secondary group">
            <div
              className={`w-10 h-10 rounded-lg ${accountStatus.bgColor} flex items-center justify-center border ${accountStatus.borderColor}`}
            >
              <StatusIcon className={`w-4 h-4 ${accountStatus.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-secondary font-medium">
                {t("home.manager.profile.accountStatus")}
              </p>
              <p className={`text-sm font-semibold ${accountStatus.color}`}>
                {user.profile.accountStatus === "active"
                  ? t("home.manager.profile.statusActive")
                  : t("home.manager.profile.statusPending")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileOverview;
