import {
  authApi,
  DEFAULT_COUNTRY_CODE,
  UserRole,
} from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Lock, Mail, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Hero from "../../../../components/Hero";
import Button from "../../../../components/ui/Button";
import InputField from "../../../../components/ui/InputField";
import PhoneNumberInput, {
  usePhoneNumber,
} from "../../../../components/ui/PhoneNumberInput";
import { APP_PAGES } from "../../../../constants/navigation";
import { bgGradient } from "../../../../constants/styles";
import { useTheme } from "../../../../context/ThemeContext";
import { useUserStore } from "../../../../store/user";
import { parsePhoneNumber } from "../../../../utils/phone.util";
import { getRoleHomePage } from "../../../../utils/roles";
import { getMessage, showStatusToast } from "../../../../utils/statusMessage";
import AuthHeader from "../components/AuthHeader";

type LoginMethod = "email" | "phone";

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [method, setMethod] = useState<LoginMethod>("email");
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserStore();
  const { isDark } = useTheme();
  const phone = usePhoneNumber(DEFAULT_COUNTRY_CODE);

  // Check for Google OAuth error in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error === "google_auth_failed") {
      toast.error(t("auth.google_auth_error"));
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Pre-fill email or phone from URL params (from invitation links)
    const emailParam = urlParams.get("email");
    const phoneParam = urlParams.get("phone");

    if (emailParam) {
      setMethod("email");
      setFormData((prev) => ({ ...prev, email: emailParam }));
    } else if (phoneParam) {
      setMethod("phone");
      // Parse phone number to extract country code and number
      const parsed = parsePhoneNumber(DEFAULT_COUNTRY_CODE, phoneParam);
      if (parsed) {
        // Extract country code (e.g., +213 from +213123456789)
        const match = parsed.match(/^(\+\d{1,4})(\d+)$/);
        if (match) {
          phone.setCountryCode(match[1]);
          phone.setPhoneNumber(match[2]);
        }
      }
    }
  }, [t]);

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

  // Validation function
  const isFormValid = () => {
    const { email, phoneNumber, password } = formData;

    if (method === "email") {
      if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return false;
    } else {
      // Validate phone number length (should be between 7-15 digits)
      if (
        !phoneNumber.trim() ||
        phoneNumber.length < 7 ||
        phoneNumber.length > 15
      )
        return false;
    }

    if (!password || password.length < 6) return false;
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) return;

    setIsLoading(true);

    try {
      const identifier =
        method === "email"
          ? formData.email
          : parsePhoneNumber(phone.countryCode, formData.phoneNumber);

      const response = await authApi.signin({
        identifier: identifier,
        password: formData.password,
        rememberMe: rememberMe,
      });

      const statusMessage = getMessage(response, t);

      showStatusToast(statusMessage, toast);

      if (response.success) {
        setUser(response.data.user);
        const redirectUrl = getRoleHomePage(
          response.data.user.role as UserRole
        );
        window.location.href = redirectUrl;
      }
    } catch (error: any) {
      if (error?.statusCode) {
        const statusMessage = getMessage(error, t);

        showStatusToast(statusMessage, toast);
      } else {
        // Handle unexpected errors
        toast.error(t("status.error.unexpected"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.getGoogleAuthUrl();
      window.location.href = response.data?.authUrl;
    } catch (error) {
      setIsLoading(false);
      toast.error(t("auth.google_auth_error"));
    }
  };

  // Check if form is valid for button disabling
  const formIsValid = isFormValid();

  return (
    <div
      className={`min-h-screen ${
        isDark ? bgGradient : "bg-background"
      } flex flex-col lg:flex-row overflow-x-hidden`}
    >
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
        <div className="max-w-md w-full space-y-8">
          <AuthHeader />

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
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
                    <PhoneNumberInput
                      countryCode={phone.countryCode}
                      phoneNumber={phone.phoneNumber}
                      onCountryCodeChange={phone.setCountryCode}
                      onPhoneNumberChange={phone.setPhoneNumber}
                      required
                    />
                  )}
                </div>

                {/* Slick Toggle Button */}
                <button
                  type="button"
                  onClick={() =>
                    setMethod(method === "email" ? "phone" : "email")
                  }
                  className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg border border-border bg-surface hover:bg-border text-text-secondary hover:text-primary transition-all"
                  title={method === "email" ? t("auth.phone") : t("auth.email")}
                >
                  {method === "email" ? (
                    <Phone className="w-5 h-5" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Field */}
              <div>
                <InputField
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("auth.password_placeholder")}
                  className="pl-12"
                  leftIcon={<Lock className="h-5 w-5" />}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center cursor-pointer">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="cursor-pointer h-4 w-4 text-primary bg-surface border-border rounded focus:ring-2 focus:ring-primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-text-secondary cursor-pointer"
                >
                  {t("auth.remember_me")}
                </label>
              </div>
              <button
                type="button"
                className="text-sm font-medium transition-colors text-primary hover:text-secondary cursor-pointer"
                onClick={() => navigate({ to: "/auth/forgot-password" })}
              >
                {t("auth.forgot_password")}
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              size="lg"
              disabled={!formIsValid || isLoading}
              className="group relative w-full flex justify-center !py-4 px-4 font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              loading={isLoading}
            >
              {t("auth.sign_in")}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2  text-text-secondary">
                  {t("auth.or_continue_with")}
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center px-4 py-3 border border-border rounded-xl bg-surface hover:bg-border text-text-primary font-medium transition-all duration-200 transform cursor-pointer"
            >
              <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="truncate">{t("auth.continue_with_google")}</span>
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-text-secondary text-sm">
                {t("auth.dont_have_account")}{" "}
                <button
                  onClick={() => (window.location.href = APP_PAGES.signUp.link)}
                  type="button"
                  className="cursor-pointer font-medium text-primary hover:text-secondary transition-colors"
                >
                  {t("auth.sign_up")}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      <Hero />
    </div>
  );
}

export default LoginPage;
