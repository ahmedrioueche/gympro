import { UserRole } from "@ahmedrioueche/gympro-client";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { t } from "i18next";
import { useEffect } from "react";
import toast from "react-hot-toast";
import LoadingPage from "../../../../components/ui/LoadingPage";
import { useUserStore } from "../../../../store/user";
import { getCurrentUser } from "../../../../utils";
import { getRoleHomePage } from "../../../../utils/roles";

export function AuthCallbackPage() {
  const { success, error } = useSearch({ from: "/auth/callback" });
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  useEffect(() => {
    const handleCallback = async () => {
      if (success === "false" || error) {
        toast.error(
          t(`error.auth.${error}`) || t("error.auth.google_auth_failed")
        );
        navigate({ to: "/auth/login" });
        return;
      }

      try {
        const user = await getCurrentUser();

        if (!user) {
          navigate({ to: "/auth/login" });
          return;
        }

        setUser(user);

        if (!user.profile.isOnBoarded) {
          navigate({ to: "/onboarding" });
        } else {
          navigate({ to: getRoleHomePage(user.role as UserRole) });
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate({ to: "/auth/login" });
      }
    };

    handleCallback();
  }, [success, error, navigate]);

  return <LoadingPage />;
}
