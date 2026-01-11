import { authApi } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";
import { useUserStore } from "../../../../../store/user";
import { parsePhoneNumber } from "../../../../../utils/phone.util";
import {
  getMessage,
  showStatusToast,
} from "../../../../../utils/statusMessage";

export type SignupMethod = "email" | "phone";

interface UseSignupReturn {
  // Form state
  method: SignupMethod;
  setMethod: (method: SignupMethod) => void;
  formData: {
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (digits: string) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;

  // Loading states
  isSubmitting: boolean;
  isGoogleLoading: boolean;

  // Validation
  isFormValid: boolean;

  // Actions
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleGoogleSignup: () => Promise<void>;
}

export function useSignup(): UseSignupReturn {
  const { t } = useTranslation();
  const { setUser } = useUserStore();

  const [method, setMethod] = useState<SignupMethod>("email");
  const [countryCode, setCountryCode] = useState("+213");
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (digits: string) => {
    setFormData((prev) => ({ ...prev, phoneNumber: digits }));
  };

  const isFormValid = (() => {
    const { email, phoneNumber, password, confirmPassword } = formData;

    if (method === "email") {
      if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return false;
    } else {
      if (
        !phoneNumber.trim() ||
        phoneNumber.length < 7 ||
        phoneNumber.length > 15
      )
        return false;
    }

    if (!password || password.length < 8) return false;
    if (password !== confirmPassword) return false;

    return true;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      const payload = {
        password: formData.password,
        ...(method === "email"
          ? { email: formData.email }
          : {
              phoneNumber: parsePhoneNumber(countryCode, formData.phoneNumber),
            }),
      };

      const response = await authApi.signup(payload);
      const statusMessage = getMessage(response, t);
      showStatusToast(statusMessage, toast);

      if (response.success) {
        setUser(response.data.user);

        if (method === "email") {
          sessionStorage.setItem("signupEmail", formData.email);
          sessionStorage.setItem("signupTimestamp", Date.now().toString());

          window.location.href = `${
            APP_PAGES.email_sent.link
          }?email=${encodeURIComponent(formData.email)}`;
        } else {
          window.location.href = `/auth/verify-phone?phone=${encodeURIComponent(
            parsePhoneNumber(countryCode, formData.phoneNumber)
          )}`;
        }
      }
    } catch (error: any) {
      if (error?.statusCode) {
        const statusMessage = getMessage(error, t);
        showStatusToast(statusMessage, toast);
      } else {
        toast.error(t("status.error.unexpected"));
      }
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const response = await authApi.getGoogleAuthUrl();
      window.location.href = response.data?.authUrl;
    } catch (error) {
      setIsGoogleLoading(false);
      toast.error(t("auth.google_auth_error"));
    }
  };

  return {
    method,
    setMethod,
    formData,
    handleChange,
    handlePhoneChange,
    countryCode,
    setCountryCode,
    isSubmitting,
    isGoogleLoading,
    isFormValid,
    handleSubmit,
    handleGoogleSignup,
  };
}
