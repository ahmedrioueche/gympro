import { authApi } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Lock, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Hero from "../../../../components/Hero";
import AnimatedLogo from "../../../../components/ui/AnimatedLogo";
import Button from "../../../../components/ui/Button";
import InputField from "../../../../components/ui/InputField";
import PhoneNumberInput, {
  usePhoneNumber,
} from "../../../../components/ui/PhoneNumberInput";
import { DEFAULT_COUNTRY_CODE } from "../../../../constants/common";
import { APP_PAGES } from "../../../../constants/navigation";
import { redirectAfterTimeout } from "../../../../utils/helper";
import { extractCountryCodeAndNumber } from "../../../../utils/phone.util";
import { getMessage, showStatusToast } from "../../../../utils/statusMessage";

type SetupMethod = "email" | "phone";

function SetupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [method, setMethod] = useState<SetupMethod>("email");
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const phone = usePhoneNumber(DEFAULT_COUNTRY_CODE);
  const [setupToken, setSetupToken] = useState("");

  // Extract token and pre-fill email/phone from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    const emailParam = urlParams.get("email");
    const phoneParam = urlParams.get("phone");

    if (tokenParam) {
      setSetupToken(tokenParam);
    } else {
      toast.error(t("auth.setup.invalid_link"));
      navigate({ to: "/auth/login" });
    }

    if (emailParam) {
      setMethod("email");
      setFormData((prev) => ({ ...prev, email: emailParam }));
    } else if (phoneParam) {
      setMethod("phone");
      // Use utility to robustly parse phone number
      const parsed = extractCountryCodeAndNumber(phoneParam);
      if (parsed) {
        phone.setCountryCode(parsed.countryCode);
        phone.setPhoneNumber(parsed.number);
      } else {
        console.warn("Could not parse phone number:", phoneParam);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Validate token when it's set
  useEffect(() => {
    if (!setupToken) return;

    const validateToken = async () => {
      try {
        setIsLoading(true);
        await authApi.validateSetupToken(setupToken);
      } catch (error) {
        toast.error(t("auth.setup.invalid_link"));
        navigate({ to: "/auth/login" });
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [setupToken, navigate, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation function
  const isFormValid = () => {
    const { password, confirmPassword } = formData;

    if (!password || password.length < 8) return false;
    if (password !== confirmPassword) return false;
    return true;
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error(t("auth.setup.password_validation_error"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.setupAccount(
        setupToken,
        formData.password
      );

      const statusMessage = getMessage(response, t);

      showStatusToast(statusMessage, toast);

      redirectAfterTimeout(APP_PAGES.member.link, 3000, navigate);
    } catch (error: any) {
      if (error?.statusCode) {
        const statusMessage = getMessage(error, t);
        showStatusToast(statusMessage, toast);
      } else {
        toast.error(t("status.error.unexpected"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formIsValid = isFormValid();

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row overflow-x-hidden`}>
      {/* Left Side - Setup Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
        <div className="max-w-md w-full space-y-8">
          <AnimatedLogo />

          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary">
              {t("auth.setup.title")}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {t("auth.setup.subtitle")}
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSetup}>
            <div className="space-y-4">
              {/* Display Email or Phone (read-only) */}
              <div>
                {method === "email" ? (
                  <InputField
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    placeholder={t("auth.email_placeholder")}
                    className="pl-12 bg-surface-dark"
                    leftIcon={<Mail className="h-5 w-5" />}
                  />
                ) : (
                  <PhoneNumberInput
                    countryCode={phone.countryCode}
                    phoneNumber={phone.phoneNumber}
                    onCountryCodeChange={phone.setCountryCode}
                    onPhoneNumberChange={phone.setPhoneNumber}
                    disabled
                  />
                )}
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
                  placeholder={t("auth.setup.password_placeholder")}
                  className="pl-12"
                  leftIcon={<Lock className="h-5 w-5" />}
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <InputField
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t("auth.setup.confirm_password_placeholder")}
                  className="pl-12"
                  leftIcon={<Lock className="h-5 w-5" />}
                />
              </div>

              {/* Password match indicator */}
              {formData.confirmPassword && (
                <p
                  className={`text-sm ${
                    formData.password === formData.confirmPassword
                      ? "text-text-success"
                      : "text-text-error"
                  }`}
                >
                  {formData.password === formData.confirmPassword
                    ? ""
                    : t("auth.setup.passwords_no_match")}
                </p>
              )}
            </div>

            {/* Setup Button */}
            <Button
              type="submit"
              size="lg"
              disabled={!formIsValid || isLoading}
              className="group relative w-full flex justify-center !py-4 px-4 font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              loading={isLoading}
            >
              {t("auth.setup.complete_button")}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-text-secondary text-sm">
                {t("auth.setup.already_have_account")}{" "}
                <button
                  onClick={() => navigate({ to: "/auth/login" })}
                  type="button"
                  className="cursor-pointer font-medium text-primary hover:text-secondary transition-colors"
                >
                  {t("auth.sign_in")}
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

export default SetupPage;
