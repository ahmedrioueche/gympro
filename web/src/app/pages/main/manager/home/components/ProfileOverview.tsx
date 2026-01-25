import {
  type GetSubscriptionDto,
  type User,
} from "@ahmedrioueche/gympro-client";
import { Edit } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../components/ui/Button";
import { useModalStore } from "../../../../../../store/modal";
import ProfileHeader from "../../../../../components/templates/profile-header/ProfileHeader";

function ProfileOverview({
  user,
  subscription,
}: {
  user: User;
  subscription: GetSubscriptionDto;
}) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  return (
    <ProfileHeader
      user={user}
      subscription={subscription}
      action={
        <Button
          onClick={() => openModal("edit_user_profile")}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-11 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md shrink-0"
        >
          {t("home.manager.profile.viewProfile")}
          <Edit className="w-4 h-4" />
        </Button>
      }
    />
  );
}

export default ProfileOverview;
