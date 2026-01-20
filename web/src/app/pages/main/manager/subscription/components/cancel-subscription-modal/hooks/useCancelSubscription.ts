import {
  appSubscriptionsApi,
  type ApiResponse,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { planKeys } from "../../../../../../../../hooks/queries/useSubscription";
import { useDebounce } from "../../../../../../../../hooks/useDebounce";
import { useToast } from "../../../../../../../../hooks/useToast";
import {
  getMessage,
  showStatusToast,
} from "../../../../../../../../utils/statusMessage";

export type CancelStep = "contact" | "reason";
export type ValidationState = "idle" | "validating" | "valid" | "invalid";

export function useCancelSubscription(onClose: () => void) {
  const { t } = useTranslation();
  const [step, setStep] = useState<CancelStep>("contact");
  const [reason, setReason] = useState("");
  const [validationState, setValidationState] =
    useState<ValidationState>("idle");
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  // Debounce the reason input (wait 800ms after user stops typing)
  const debouncedReason = useDebounce(reason, 800);

  const handleClose = () => {
    setStep("contact");
    setReason("");
    setValidationState("idle");
    onClose();
  };

  // Validation mutation
  const validateMutation = useMutation({
    mutationFn: async (reason: string) => {
      const response = await appSubscriptionsApi.validateCancellationReason(
        reason
      );
      return response;
    },
    onSuccess: (response: ApiResponse<"true" | "false">) => {
      if (response.data === "true") {
        setValidationState("valid");
      } else {
        setValidationState("invalid");
      }
    },
    onError: () => {
      setValidationState("invalid");
    },
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: async (reason: string) => {
      return await appSubscriptionsApi.cancelSubscription(reason);
    },
    onSuccess: (response: ApiResponse) => {
      queryClient.invalidateQueries({ queryKey: planKeys.mySubscription() });
      const msg = getMessage(response, t);
      showStatusToast(msg, { success, error });
      handleClose();
    },
    onError: (err: ApiResponse) => {
      const msg = getMessage(err, t);
      showStatusToast(msg, { success, error });
      queryClient.invalidateQueries({ queryKey: planKeys.mySubscription() });
      handleClose();
    },
  });

  // Validate reason when debounced value changes
  useEffect(() => {
    if (step === "reason" && debouncedReason.trim().length >= 10) {
      setValidationState("validating");
      validateMutation.mutate(debouncedReason);
    } else if (
      debouncedReason.trim().length > 0 &&
      debouncedReason.trim().length < 10
    ) {
      setValidationState("invalid");
    } else {
      setValidationState("idle");
    }
  }, [debouncedReason, step]);

  const handleContinueToCancellation = () => {
    setStep("reason");
  };

  const handleBackToContact = () => {
    setStep("contact");
    setReason("");
    setValidationState("idle");
  };

  const handleCancel = () => {
    if (validationState === "valid") {
      cancelMutation.mutate(reason);
    }
  };

  const canSubmit = validationState === "valid" && !cancelMutation.isPending;

  return {
    step,
    reason,
    setReason,
    validationState,
    handleClose,
    handleContinueToCancellation,
    handleBackToContact,
    handleCancel,
    canSubmit,
    isSubmitting: cancelMutation.isPending,
    isError: cancelMutation.isError,
  };
}
