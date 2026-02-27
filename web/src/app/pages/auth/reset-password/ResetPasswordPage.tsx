import { authApi } from "@ahmedrioueche/gympro-client";
import { useRouter, useSearch } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, Lock, Shield, Sparkles } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AnimatedLogo from "../../../../components/ui/AnimatedLogo";
import Button from "../../../../components/ui/Button";
import Confetti from "../../../../components/ui/Confetti";
import InputField from "../../../../components/ui/InputField";
import { BG_GRADIENT } from "../../../../constants/styles";
import { useTheme } from "../../../../context/ThemeContext";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const search = useSearch({ from: "/auth/reset-password" });
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const token = search.token;
  const isPasswordValid = password.length >= 8;
  const isConfirmValid = password === confirm && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authApi.resetPassword(token, password);
      setSubmitted(true);
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.navigate({ to: "/auth/login" });
      }, 3000);
    } catch (err: any) {
      setError(
        t("auth.reset_password_error", "Invalid or expired reset token."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className={`min-h-[100dvh] relative overflow-x-hidden flex items-center justify-center p-4 ${isDark ? BG_GRADIENT : "bg-background"}`}
      >
        <div className="max-w-md w-full">
          <div className="mb-8">
            <AnimatedLogo />
          </div>

          <div className="bg-background rounded-2xl shadow-xl border border-red-100 dark:border-red-800 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">
              {t(
                "auth.reset_password_error",
                "Invalid or expired reset token.",
              )}
            </h2>
            <p className="text-text-secondary mb-6">
              The password reset link has expired or is invalid. Please request
              a new one.
            </p>
            <Button
              onClick={() => router.navigate({ to: "/auth/forgot-password" })}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
            >
              {t("auth.request_new_reset", "Request New Reset Link")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-[100dvh] relative overflow-x-hidden flex items-center justify-center p-4 ${isDark ? BG_GRADIENT : "bg-background"}`}
    >
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="mb-8">
          <AnimatedLogo />
        </div>

        <div
          className={`bg-background rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden ${isDark ? BG_GRADIENT : "bg-background"}`}
        >
          {submitted ? (
            // Success State with Animations
            <div className="p-8 text-center relative overflow-hidden">
              {/* Confetti Effect */}
              <Confetti />

              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"></div>

              {/* Floating Sparkles */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-4 left-4 animate-sparkle"
                  style={{ animationDelay: "0s" }}
                >
                  <Sparkles className="w-4 h-4 text-green-400" />
                </div>
                <div
                  className="absolute top-8 right-6 animate-sparkle"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                </div>
                <div
                  className="absolute bottom-6 left-8 animate-sparkle"
                  style={{ animationDelay: "1s" }}
                >
                  <Sparkles className="w-5 h-5 text-green-300" />
                </div>
                <div
                  className="absolute bottom-4 right-4 animate-sparkle"
                  style={{ animationDelay: "1.5s" }}
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                </div>
                <div
                  className="absolute top-1/2 left-2 animate-float"
                  style={{ animationDelay: "0.8s" }}
                >
                  <Sparkles className="w-3 h-3 text-green-500" />
                </div>
                <div
                  className="absolute top-1/3 right-2 animate-float"
                  style={{ animationDelay: "1.2s" }}
                >
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              {/* Success Icon */}
              <div className="relative z-10 mb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-success-pulse">
                  <CheckCircle className="w-10 h-10 text-white animate-success-bounce" />
                </div>
              </div>

              {/* Success Content */}
              <div className="relative z-10 space-y-4">
                <h2 className="text-2xl font-bold text-text-primary">
                  {t(
                    "auth.reset_password_success",
                    "Password Reset Successfully!",
                  )}
                </h2>

                <div className="space-y-3">
                  <p className="text-text-secondary leading-relaxed">
                    Your password has been updated successfully. You can now
                    sign in with your new password.
                  </p>

                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          {t("auth.account_secured", "Account Secured")}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {t(
                            "auth.account_secured_desc",
                            "Your account is now protected with a new password",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Countdown and Action Buttons */}
                <div className="pt-4 space-y-3">
                  <div className="text-sm text-text-secondary">
                    {t(
                      "auth.redirecting_to_login",
                      "Redirecting to login page...",
                    )}
                  </div>

                  <Button
                    onClick={() => router.navigate({ to: "/auth/login" })}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>{t("auth.sign_in", "Sign in")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Form State
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  {t("auth.reset_password", "Reset Password")}
                </h2>
                <p className="text-text-secondary">
                  {t(
                    "auth.enter_new_password",
                    "Enter your new password below to secure your account",
                  )}
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <InputField
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.password_placeholder")}
                  label={t("auth.password")}
                  error={
                    !isPasswordValid && password
                      ? t("errors.password_length")
                      : ""
                  }
                />
                <InputField
                  id="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder={t("auth.confirm_password_placeholder")}
                  label={t("auth.confirm_password")}
                  error={
                    confirm && !isConfirmValid
                      ? t("errors.password_mismatch")
                      : ""
                  }
                />

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  disabled={!isConfirmValid || isLoading}
                  loading={isLoading}
                >
                  {t("auth.reset_password", "Reset Password")}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button
                  onClick={() => router.navigate({ to: "/auth/login" })}
                  variant="ghost"
                  className="text-text-secondary hover:text-text-primary"
                >
                  ← {t("auth.sign_in", "Back to Sign in")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
