import { authApi } from "@ahmedrioueche/gympro-client";
import { useSearch } from "@tanstack/react-router";
import { CheckCircle, Mail, Phone, Smartphone, Sparkles } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AnimatedLogo from "../../../../components/ui/AnimatedLogo";
import Button from "../../../../components/ui/Button";
import Confetti from "../../../../components/ui/Confetti";
import CustomSelect from "../../../../components/ui/CustomSelect";
import InputField from "../../../../components/ui/InputField";
import { COUNTRY_CODES } from "../../../../constants/countryCodes";
import { bgGradient } from "../../../../constants/styles";
import { useTheme } from "../../../../context/ThemeContext";
import {
  formatPhoneDigitsForInput,
  getExampleNumber,
  parsePhoneNumber,
} from "../../../../utils/phone.util";

type ForgotPasswordMethod = "email" | "phone";
type ForgotPasswordStep = "form" | "code-verification" | "success";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const search = useSearch({ from: "/auth/forgot-password" });
  const [method, setMethod] = useState<ForgotPasswordMethod>("email");
  const [countryCode, setCountryCode] = useState("+213");
  const [formData, setFormData] = useState({
    email: search.email || "",
    phoneNumber: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ForgotPasswordStep>("form");
  const [error, setError] = useState("");
  const [submittedIdentifier, setSubmittedIdentifier] = useState("");
  const { isDark } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For phone number, only allow digits
    if (name === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: digitsOnly,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const isFormValid = () => {
    if (method === "email") {
      return !!formData.email.trim() && /^\S+@\S+\.\S+$/.test(formData.email);
    } else {
      return (
        formData.phoneNumber.trim().length >= 7 &&
        formData.phoneNumber.trim().length <= 15
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const identifier =
        method === "email"
          ? formData.email
          : parsePhoneNumber(countryCode, formData.phoneNumber);

      const response = await authApi.forgotPassword(identifier);
      setSubmittedIdentifier(identifier);

      // If phone method, show code verification step
      // If email method, show success immediately
      if (method === "phone") {
        setStep("code-verification");
      } else {
        setStep("success");
      }
    } catch (err: any) {
      setError(t("status.error.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.verifyForgotPasswordOtp(
        submittedIdentifier,
        verificationCode
      );

      if (response.success && response.data?.resetToken) {
        // Redirect to reset password page with the reset token
        window.location.href = `/auth/reset-password?token=${response.data.resetToken}`;
      } else {
        setError(t("auth.invalid_verification_code"));
      }
    } catch (err: any) {
      setError(err.message || t("status.error.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  const formIsValid = isFormValid();

  // Format country code options with flags
  const countryCodeOptions = COUNTRY_CODES.map((country) => ({
    value: country.code,
    label: country.code,
    flag: country.flag,
  }));

  const displayIdentifier =
    method === "email"
      ? formData.email
      : parsePhoneNumber(countryCode, formData.phoneNumber);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDark ? bgGradient : "bg-background"
      } `}
    >
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="mb-8">
          <AnimatedLogo />
        </div>

        <div
          className={`bg-background rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden ${
            isDark ? bgGradient : "bg-background"
          }`}
        >
          {step === "success" ? (
            // Success State with Animations (Email)
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
                          {submittedIdentifier}
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
          ) : step === "code-verification" ? (
            // Code Verification State (Phone)
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg mb-4">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  {t("auth.verify_reset_code", "Verify Reset Code")}
                </h2>
                <p className="text-text-primary">
                  {t(
                    "auth.enter_code_sent_to",
                    "Enter the verification code sent to"
                  )}{" "}
                  <span className="font-semibold">{submittedIdentifier}</span>
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleVerifyCode}>
                <div>
                  <InputField
                    id="verificationCode"
                    type="text"
                    required
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest pl-0"
                    maxLength={6}
                    leftIcon={<Smartphone className="h-5 w-5" />}
                  />
                </div>

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
                  disabled={verificationCode.length !== 6 || isLoading}
                  loading={isLoading}
                >
                  {t("auth.verify_code", "Verify Code")}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button
                  onClick={() => {
                    setStep("form");
                    setVerificationCode("");
                    setError("");
                  }}
                  variant="ghost"
                  className="text-text-primary"
                >
                  ← {t("auth.back", "Back")}
                </Button>
              </div>
            </div>
          ) : (
            // Form State
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg mb-4">
                  {method === "email" ? (
                    <Mail className="w-8 h-8 text-white" />
                  ) : (
                    <Phone className="w-8 h-8 text-white" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  {t("auth.forgot_password")}
                </h2>
                <p className="text-text-primary">
                  {method === "email"
                    ? t("auth.forgot_password_email_description")
                    : t("auth.forgot_password_phone_description")}
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email or Phone Field with Inline Toggle */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    {method === "email" ? (
                      <InputField
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("auth.email_placeholder")}
                        className="pl-12"
                        leftIcon={<Mail className="h-5 w-5" />}
                      />
                    ) : (
                      <div className="flex gap-2">
                        {/* Country Code Selector */}
                        <div className="w-32 flex-shrink-0">
                          <CustomSelect
                            title=""
                            options={countryCodeOptions}
                            selectedOption={countryCode}
                            onChange={setCountryCode}
                            className="text-sm"
                            marginTop="mt-0"
                          />
                        </div>

                        {/* Phone Number Input */}
                        <div className="flex-1">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-text-secondary" />
                            </div>
                            <input
                              id="phoneNumber"
                              name="phoneNumber"
                              type="tel"
                              required
                              value={formatPhoneDigitsForInput(
                                formData.phoneNumber
                              )}
                              onChange={handleChange}
                              placeholder={getExampleNumber(countryCode)}
                              className="pl-10 w-full px-4 py-3 border border-border rounded-lg bg-surface text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Slick Toggle Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setMethod(method === "email" ? "phone" : "email")
                    }
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg border border-border bg-surface hover:bg-border text-text-secondary hover:text-primary transition-all"
                    title={
                      method === "email" ? t("auth.phone") : t("auth.email")
                    }
                  >
                    {method === "email" ? (
                      <Phone className="w-5 h-5" />
                    ) : (
                      <Mail className="w-5 h-5" />
                    )}
                  </button>
                </div>

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
                  disabled={!formIsValid || isLoading}
                  loading={isLoading}
                >
                  {method === "email"
                    ? t("auth.send_reset_link")
                    : t("auth.send_reset_code")}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button
                  onClick={() => (window.location.href = "/auth/login")}
                  variant="ghost"
                  className="text-text-primary"
                >
                  ← {t("auth.email_sent.back_to_login_button")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
