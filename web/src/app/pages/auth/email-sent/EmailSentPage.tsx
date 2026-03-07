import { authApi } from "@ahmedrioueche/gympro-client";
import { useRouter } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../constants/navigation";
import { useUserStore } from "../../../../store/user";
import { getMessage, showStatusToast } from "../../../../utils/statusMessage";
import AuthLayout from "../components/AuthLayout";

const EmailSentPage: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const { user } = useUserStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get("email");
    const emailFromStorage = sessionStorage.getItem("signupEmail");
    const signupTimestamp = sessionStorage.getItem("signupTimestamp");

    const isValidSignupSession =
      signupTimestamp && Date.now() - parseInt(signupTimestamp) < 5 * 60 * 1000;

    const emailFromSignup =
      emailFromUrl || emailFromStorage || user?.profile?.email;

    const isAuthenticatedButNotValidated = user && !user.profile.isValidated;

    if (
      !emailFromSignup ||
      (!isValidSignupSession && !isAuthenticatedButNotValidated)
    ) {
      sessionStorage.removeItem("signupEmail");
      sessionStorage.removeItem("signupTimestamp");

      if (!user) {
        router.navigate({ to: APP_PAGES.signUp.link });
      } else if (user.profile.isValidated) {
        router.navigate({ to: "/" });
      }
      return;
    }

    setEmail(emailFromSignup);
    if (emailFromSignup) {
      sessionStorage.setItem("signupEmail", emailFromSignup);
    }
  }, [router, user]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error(t("auth.email_sent.no_email_error"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.resendVerification({ email });
      const statusMessage = getMessage(response, t);
      showStatusToast(statusMessage, toast);
    } catch (error: any) {
      if (error && typeof error === "object" && "success" in error) {
        const statusMessage = getMessage(error, t);
        showStatusToast(statusMessage, toast);
      } else {
        toast.error(t("status.error.unexpected"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    sessionStorage.removeItem("signupEmail");
    sessionStorage.removeItem("signupTimestamp");
    router.navigate({ to: APP_PAGES.login.link });
  };

  if (!email) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-text-secondary">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t("auth.email_sent.welcome_title")}
          </h1>
          <p className="text-lg text-slate-300 mb-2">
            {t("auth.email_sent.welcome_message")}
          </p>
        </div>

        {/* Success Message */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 shadow-sm">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-emerald-400 mt-0.5 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-emerald-300">
              <p className="font-semibold mb-2 text-base">
                {t("auth.email_sent.success_title")}
              </p>
              <p className="leading-relaxed">
                {t("auth.email_sent.success_description")}
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 shadow-sm">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-primary mt-0.5 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-primary">
              <p className="font-semibold mb-2 text-base">
                {t("auth.email_sent.info_title")}
              </p>
              <p className="leading-relaxed">
                {t("auth.email_sent.info_description")}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={isLoading}
            className="cursor-pointer w-full bg-primary text-white py-4 px-6 rounded-xl font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading
              ? t("auth.email_sent.resending")
              : t("auth.email_sent.resend_button")}
          </button>

          <button
            onClick={handleBackToLogin}
            className="cursor-pointer w-full bg-white/5 border border-white/10 text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/10 focus:outline-none transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {t("auth.email_sent.back_to_login_button")}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailSentPage;
