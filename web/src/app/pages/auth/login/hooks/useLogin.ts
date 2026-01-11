import {
  authApi,
  DEFAULT_COUNTRY_CODE,
  UserRole,
} from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { usePhoneNumber } from "../../../../../components/ui/PhoneNumberInput";
import { useUserStore } from "../../../../../store/user";
import { parsePhoneNumber } from "../../../../../utils/phone.util";
import { getRoleHomePage } from "../../../../../utils/roles";
import {
  getMessage,
  showStatusToast,
} from "../../../../../utils/statusMessage";

export type LoginMethod = "email" | "phone";

interface UseLoginReturn {
  // Form state
  method: LoginMethod;
  setMethod: (method: LoginMethod) => void;
  formData: { email: string; phoneNumber: string; password: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  phone: ReturnType<typeof usePhoneNumber>;

  // Loading states
  isSubmitting: boolean;
  isGoogleLoading: boolean;

  // Validation
  isFormValid: boolean;

  // Actions
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
}

export function useLogin(): UseLoginReturn {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const phone = usePhoneNumber(DEFAULT_COUNTRY_CODE);

  const [method, setMethod] = useState<LoginMethod>("email");
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check for Google OAuth error and prefill from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error === "google_auth_failed") {
      toast.error(t("auth.google_auth_error"));
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
      const parsed = parsePhoneNumber(DEFAULT_COUNTRY_CODE, phoneParam);
      if (parsed) {
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

    if (name === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isFormValid = (() => {
    const { email, password } = formData;

    if (method === "email") {
      if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return false;
    } else {
      const phoneNum = phone.phoneNumber.trim();
      if (!phoneNum || phoneNum.length < 7 || phoneNum.length > 15) {
        return false;
      }
    }

    if (!password || password.length < 6) return false;
    return true;
  })();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      const identifier =
        method === "email"
          ? formData.email
          : parsePhoneNumber(phone.countryCode, phone.phoneNumber);

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
        toast.error(error?.message || t("status.error.unexpected"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
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
    rememberMe,
    setRememberMe,
    phone,
    isSubmitting,
    isGoogleLoading,
    isFormValid,
    handleLogin,
    handleGoogleLogin,
  };
}
