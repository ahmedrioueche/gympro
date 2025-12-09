import { authApi } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, RefreshCw, Smartphone } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Hero from "../../../../components/Hero";
import Button from "../../../../components/ui/Button";
import InputField from "../../../../components/ui/InputField";
import { bgGradient } from "../../../../constants/styles";
import { useTheme } from "../../../../context/ThemeContext";
import { useUserStore } from "../../../../store/user";
import { formatPhoneForDisplay } from "../../../../utils/phone.util";
import { getMessage, showStatusToast } from "../../../../utils/statusMessage";
import AuthHeader from "../components/AuthHeader";

function PhoneVerificationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { mode } = useTheme();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);

  // Get phone number from URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const phoneNumber = urlParams.get("phone") || "";

  useEffect(() => {
    if (!phoneNumber) {
      toast.error(t("auth.phone_required"));
      navigate({ to: "/auth/signup" });
    }

    // Start countdown for resend button
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phoneNumber, navigate, t]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;

    setIsLoading(true);
    try {
      const response = await authApi.verifyOtp(phoneNumber, otp);

      const statusMessage = getMessage(response, {
        t: t,
        showToast: true,
      });

      showStatusToast(statusMessage, toast);

      if (response.success) {
        // After verification, we might need to fetch the user profile or login
        // For now, let's assume the user needs to login again or we can auto-login if the backend supported it
        // But the verifyOtp endpoint returns userId.
        // Ideally, we should auto-login.
        // Since verifyOtp doesn't return a token, we redirect to login page with a success message
        // OR we could modify the backend to return tokens on verification.
        // For now, let's redirect to login.

        toast.success(t("auth.phone_verified_success"));
        navigate({ to: "/auth/login" });
      }
    } catch (error: any) {
      if (error?.statusCode) {
        const statusMessage = getMessage(error.statusCode, {
          t: t,
          showToast: true,
        });
        showStatusToast(statusMessage, toast);
      } else {
        toast.error(t("status.error.unexpected"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendDisabled) return;

    setIsLoading(true);
    try {
      const response = await authApi.sendOtp(phoneNumber);

      const statusMessage = getMessage(response, {
        t: t,
        showToast: true,
      });
      showStatusToast(statusMessage, toast);

      if (response.success) {
        setResendDisabled(true);
        setCountdown(60);
        // Restart timer
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error: any) {
      toast.error(t("status.error.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex ${isDark ? bgGradient : "bg-background"}`}
    >
      <div className="overflow-y-auto flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <AuthHeader />
            <h2 className="mt-6 text-3xl font-extrabold text-text-primary">
              {t("auth.verify_phone")}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {t("auth.enter_otp_sent_to")}{" "}
              <span className="font-semibold text-text-primary">
                {formatPhoneForDisplay(phoneNumber)}
              </span>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleVerify}>
            <div>
              <InputField
                id="otp"
                type="text"
                required
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="text-center text-2xl tracking-widest pl-0"
                maxLength={6}
                leftIcon={<Smartphone className="h-6 w-6" />}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={otp.length !== 6 || isLoading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
              loading={isLoading}
            >
              {t("auth.verify")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled || isLoading}
                className={`flex items-center justify-center mx-auto text-sm font-medium transition-colors ${
                  resendDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-primary hover:text-secondary cursor-pointer"
                }`}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                {resendDisabled
                  ? `${t("auth.resend_in")} ${countdown}s`
                  : t("auth.resend_code")}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Hero />
    </div>
  );
}

export default PhoneVerificationPage;
