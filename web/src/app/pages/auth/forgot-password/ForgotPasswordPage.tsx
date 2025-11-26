import { authApi } from "@ahmedrioueche/gympro-client";
import { useSearch } from "@tanstack/react-router";
import { CheckCircle, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AnimatedLogo from "../../../../components/ui/AnimatedLogo";
import Button from "../../../../components/ui/Button";
import Confetti from "../../../../components/ui/Confetti";
import InputField from "../../../../components/ui/InputField";
import { bgGradient } from "../../../../constants/styles";
import { useTheme } from "../../../../context/ThemeContext";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const search = useSearch({ from: "/auth/forgot-password" });
  const [email, setEmail] = useState(search.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { mode } = useTheme();

  const isEmailValid = !!email.trim() && /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(t("status.error.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        mode === "dark" ? bgGradient : "bg-background"
      } `}
    >
      {" "}
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="mb-8">
          <AnimatedLogo />
        </div>

        <div
          className={`bg-background rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden ${
            mode === "dark" ? bgGradient : "bg-background"
          }`}
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
                  {t("auth.email_sent.title", "Check Your Email")}
                </h2>

                <div className="space-y-3">
                  <p className="text-text-primary leading-relaxed">
                    {t(
                      "auth.forgot_password_success",
                      "If the email exists, a reset link has been sent."
                    )}
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-text-primary flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          {email}
                        </p>
                        <p className="text-xs text-text-primary">
                          {t(
                            "auth.email_sent.description",
                            "We've sent a verification link to your email address."
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  <Button
                    onClick={() => window.location.reload()}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    {t("auth.email_sent.resend_button", "Resend Email")}
                  </Button>

                  <Button
                    onClick={() => (window.location.href = "/auth/login")}
                    variant="outline"
                    className="w-full"
                  >
                    {t("auth.email_sent.back_to_login_button", "Back to Login")}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Form State
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  {t("auth.forgot_password", "Forgot your password?")}
                </h2>
                <p className="text-text-primary">
                  {t(
                    "auth.email_sent.description",
                    "We'll send you a link to reset your password."
                  )}
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <InputField
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.email_placeholder")}
                  label={t("auth.email")}
                  error={
                    !isEmailValid && email ? t("errors.email_invalid") : ""
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
                  disabled={!isEmailValid || isLoading}
                  loading={isLoading}
                >
                  {t("auth.send_reset_link", "Send Reset Link")}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button
                  onClick={() => (window.location.href = "/auth/login")}
                  variant="ghost"
                  className="text-text-primary"
                >
                  ← {t("auth.email_sent.back_to_login_button", "Back to Login")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
