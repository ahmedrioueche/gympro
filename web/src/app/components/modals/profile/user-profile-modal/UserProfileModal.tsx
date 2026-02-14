import type { User } from "@ahmedrioueche/gympro-client";
import { CreditCard, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../../store/modal";
import {
  CustomizableProfileTemplateModal,
  type ProfileModalAction,
} from "../CustomizableProfileTemplateModal";
import { MemberSubscriptionsTable } from "../member-profile-modal/MemberSubscriptionTable";

export default function UserProfileModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, userProfileProps } = useModalStore();

  const isOpen = currentModal === "user_profile";
  const user = userProfileProps?.user as User | undefined;

  if (!isOpen || !user) return null;

  // Get user role label - capitalize first letter
  const getRoleLabel = () => {
    const role = user.role || "user";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Build tabs based on available info
  const tabs = [
    {
      id: "overview",
      label: t("common.details", "Details"),
      icon: Info,
      content: (
        <div className="space-y-4">
          {/* Basic Info Card */}
          <div className="p-4 bg-surface-secondary rounded-xl space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">
              {t("memberProfile.sections.basicInfo", "Basic Information")}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-secondary">
                  {t("dashboard.role", "Role")}
                </p>
                <p className="font-medium text-text-primary capitalize">
                  {getRoleLabel()}
                </p>
              </div>
              {user.profile?.gender && (
                <div>
                  <p className="text-text-secondary">
                    {t("settings.gender", "Gender")}
                  </p>
                  <p className="font-medium text-text-primary capitalize">
                    {user.profile.gender}
                  </p>
                </div>
              )}
              {user.profile?.age && (
                <div>
                  <p className="text-text-secondary">
                    {t("settings.age", "Age")}
                  </p>
                  <p className="font-medium text-text-primary">
                    {user.profile.age} {t("common.years")}
                  </p>
                </div>
              )}
              {user.createdAt && (
                <div>
                  <p className="text-text-secondary">{t("common.joined")}</p>
                  <p className="font-medium text-text-primary">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bio if available */}
          {user.profile?.bio && (
            <div className="p-4 bg-surface-secondary rounded-xl space-y-2">
              <h3 className="text-sm font-semibold text-text-primary">
                {t("settings.bio", "Bio")}
              </h3>
              <p className="text-sm text-text-secondary">{user.profile.bio}</p>
            </div>
          )}
        </div>
      ),
    },
    ...(user.subscriptionHistory && user.subscriptionHistory.length > 0
      ? [
          {
            id: "subscriptions",
            label: t("sidebar.subscriptions"),
            icon: CreditCard,
            count: user.subscriptionHistory.length,
            content: (
              <MemberSubscriptionsTable history={user.subscriptionHistory} />
            ),
          },
        ]
      : []),
  ];

  const actions: ProfileModalAction[] = [];

  return (
    <CustomizableProfileTemplateModal
      isOpen={isOpen}
      onClose={closeModal}
      user={user}
      isLoading={false}
      title={user.profile?.fullName || t("memberProfile.unknownMember")}
      tabs={tabs}
      actions={actions}
    />
  );
}
