import {
  authApi,
  ErrorCode,
  type ApiResponse,
} from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../store/modal";
import { useModalLayer } from "./useModalLayer";
import { useUserStore } from "../store/user";
import type { TranslationType } from "../types/common";
import { getMessage } from "../utils/statusMessage";

export interface DeleteAccountModalState {
  step: "confirmation" | "otp";
  confirmationText: string;
  otpCode: string;
  isLoading: boolean;
  error: string | null;
}

function isThrownApiResponse(err: unknown): err is ApiResponse<unknown> {
  return (
    typeof err === "object" &&
    err !== null &&
    "success" in err &&
    (err as ApiResponse<unknown>).success === false
  );
}

function isRateLimited(
  data: ApiResponse<unknown>,
  rawMessage?: string,
): boolean {
  return (
    data.errorCode === ErrorCode.TOO_MANY_REQUESTS ||
    !!rawMessage?.toLowerCase().includes("too many requests") ||
    /wait \d+ minute/i.test(rawMessage ?? "")
  );
}

function resolveRateLimitMessage(
  rawMessage: string | undefined,
  t: TranslationType,
): string {
  const waitMatch = rawMessage?.match(/wait (\d+) minute/i);
  const minutes = waitMatch ? Number(waitMatch[1]) : undefined;
  if (minutes && minutes > 1) {
    return t("delete_account.otp_rate_limited_minutes_plural", {
      count: minutes,
      defaultValue: `Please wait ${minutes} minutes before requesting another verification code.`,
    });
  }
  if (minutes === 1) {
    return t("delete_account.otp_rate_limited_minutes", {
      count: 1,
      defaultValue:
        "Please wait 1 minute before requesting another verification code.",
    });
  }
  return t(
    "delete_account.otp_rate_limited",
    "Please wait 1 minute before requesting another verification code.",
  );
}

function resolveApiResponseError(
  data: ApiResponse<unknown>,
  t: TranslationType,
  fallback: string,
): string {
  if (isRateLimited(data, data.message)) {
    return resolveRateLimitMessage(data.message, t);
  }
  return getMessage(data, t).message || fallback;
}

function resolveThrownError(
  err: unknown,
  t: TranslationType,
  fallback: string,
): string {
  if (isThrownApiResponse(err)) {
    return resolveApiResponseError(err, t, fallback);
  }
  return fallback;
}

export const useDeleteAccount = () => {
  const { t } = useTranslation();
  const { closeModal } = useModalStore();
  const { user, clearUser } = useUserStore();
  const [state, setState] = useState<DeleteAccountModalState>({
    step: "confirmation",
    confirmationText: "",
    otpCode: "",
    isLoading: false,
    error: null,
  });

  const { isOpen, zIndex, closeModal: closeLayerModal } = useModalLayer("delete_account");

  useEffect(() => {
    if (!isOpen) {
      setState({
        step: "confirmation",
        confirmationText: "",
        otpCode: "",
        isLoading: false,
        error: null,
      });
    }
  }, [isOpen]);

  const handleConfirmationSubmit = async () => {
    if (state.confirmationText !== "DELETE MY ACCOUNT") {
      setState((prev) => ({
        ...prev,
        error: t(
          "delete_account.confirmation_mismatch",
          "Please type 'DELETE MY ACCOUNT' to confirm",
        ),
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.requestDeleteAccountOtp();

      if (!response.success) {
        const message = resolveApiResponseError(
          response,
          t,
          t("delete_account.otp_send_failed", "Failed to send OTP to email"),
        );
        setState((prev) => ({ ...prev, isLoading: false, error: message }));
        toast.error(message);
        return;
      }

      setState((prev) => ({
        ...prev,
        step: "otp",
        isLoading: false,
        error: null,
      }));

      toast.success(
        t("delete_account.otp_sent", "OTP code sent to your email"),
      );
    } catch (err: unknown) {
      const message = resolveThrownError(
        err,
        t,
        t("delete_account.otp_send_failed", "Failed to send OTP to email"),
      );
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      toast.error(message);
    }
  };

  const handleOtpSubmit = async () => {
    if (!state.otpCode.trim()) {
      setState((prev) => ({
        ...prev,
        error: t("delete_account.otp_required", "Please enter the OTP code"),
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.confirmDeleteAccount(state.otpCode);

      if (!response.success) {
        const message = resolveApiResponseError(
          response,
          t,
          t(
            "delete_account.delete_failed",
            "Failed to delete account. Please try again.",
          ),
        );
        setState((prev) => ({ ...prev, isLoading: false, error: message }));
        toast.error(message);
        return;
      }

      clearUser();
      closeModal();
      toast.success(
        t(
          "delete_account.success",
          "Your account has been deleted successfully",
        ),
      );

      window.location.href = "/landing";
    } catch (err: unknown) {
      const message = resolveThrownError(
        err,
        t,
        t(
          "delete_account.delete_failed",
          "Failed to delete account. Please try again.",
        ),
      );
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      toast.error(message);
    }
  };

  const setConfirmationText = (confirmationText: string) => {
    setState((prev) => ({
      ...prev,
      confirmationText,
      error: null,
    }));
  };

  const setOtpCode = (otpCode: string) => {
    setState((prev) => ({
      ...prev,
      otpCode,
      error: null,
    }));
  };

  const primaryButtonLabel =
    state.step === "confirmation"
      ? t("delete_account.confirm_btn", "Continue")
      : t("delete_account.delete_btn", "Delete Account");

  const handlePrimaryClick =
    state.step === "confirmation" ? handleConfirmationSubmit : handleOtpSubmit;

  return {
    isOpen,
    state,
    user,
    closeModal,
    setConfirmationText,
    setOtpCode,
    handleConfirmationSubmit,
    handleOtpSubmit,
    primaryButtonLabel,
    handlePrimaryClick,
    zIndex,
  };
};
