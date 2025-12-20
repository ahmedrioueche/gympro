import type { UserRole } from "@ahmedrioueche/gympro-client";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useChargilyCheckoutStatus } from "../../../../hooks/queries/useChargilyCheckout";
import { usePaddleTransactionStatus } from "../../../../hooks/queries/usePaddleCheckout";
import { useUserStore } from "../../../../store/user";
import { redirectToHomePageAfterTimeout } from "../../../../utils/helper";

function PaymentSuccessPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });
  const checkoutId = searchParams.checkout_id as string | undefined;
  const paddleTransactionId = searchParams._ptxn as string | undefined;
  const { user } = useUserStore();
  const { mutate: checkChargilyStatus, isPending: isChargilyPending } =
    useChargilyCheckoutStatus();
  const { mutate: checkPaddleStatus, isPending: isPaddlePending } =
    usePaddleTransactionStatus();

  useEffect(() => {
    // Handle Chargily checkout
    if (checkoutId) {
      checkChargilyStatus(checkoutId);
      return;
    }

    // Handle Paddle transaction
    if (paddleTransactionId) {
      checkPaddleStatus(paddleTransactionId);
      return;
    }

    // No payment params, redirect to home
    redirectToHomePageAfterTimeout(user.role as UserRole, 0, navigate);
  }, [
    checkoutId,
    paddleTransactionId,
    checkChargilyStatus,
    checkPaddleStatus,
    navigate,
    user.role,
  ]);

  const isPending = isChargilyPending || isPaddlePending;

  const handleBackToDashboard = () => {
    redirectToHomePageAfterTimeout(user.role as UserRole, 0, navigate);
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-surface border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* Header with animated checkmark */}
          <div className="bg-gradient-to-r from-success/10 to-success/5 p-8 md:p-12 text-center border-b border-border">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-success/10 flex items-center justify-center animate-bounce">
                <svg
                  className="w-12 h-12 md:w-14 md:h-14 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              {t("payment.success.title")}
            </h1>
            <p className="text-lg text-text-secondary">
              {t("payment.success.subtitle")}
            </p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Status indicator */}
            {isPending ? (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">
                      {t("payment.success.verifying_title")}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {t("payment.success.verifying_text")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-success/5 border border-success/20 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary mb-1">
                      {t("payment.success.confirmed_title")}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {t("payment.success.confirmed_text")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBackToDashboard}
                className="flex-1 px-6 py-3 bg-surface hover:bg-surface-hover border border-border text-text-primary font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {t("payment.success.back_to_dashboard")}
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="bg-background/30 border-t border-border px-8 md:px-12 py-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-text-secondary">
                {t("payment.success.email_note")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
