import type { UserRole } from "@ahmedrioueche/gympro-client";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../constants/navigation";
import { useUserStore } from "../../../../store/user";
import { handleContactSupport } from "../../../../utils/contact";
import { redirectToHomePageAfterTimeout } from "../../../../utils/helper";

function PaymentFailurePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const searchParams = useSearch({ strict: false });
  const checkoutId = searchParams.checkout_id as string | undefined;
  const paddleTransactionId = searchParams._ptxn as string | undefined;
  const errorMessage = searchParams.error as string | undefined;

  useEffect(() => {
    // If no payment identifiers, redirect to home
    if (!checkoutId && !paddleTransactionId) {
      user.role === "owner" || user.role === "manager"
        ? navigate({ to: APP_PAGES.manager.subscription.link })
        : redirectToHomePageAfterTimeout(user.role as UserRole, 0, navigate);
      return;
    }
  }, [checkoutId, paddleTransactionId, navigate, user.role]);

  const handleBackToDashboard = () => {
    user.role === "owner" || user.role === "manager"
      ? navigate({ to: APP_PAGES.manager.subscription.link })
      : redirectToHomePageAfterTimeout(user.role as UserRole, 0, navigate);
  };

  // Determine payment provider
  const paymentProvider = checkoutId
    ? "Chargily"
    : paddleTransactionId
    ? "Paddle"
    : "Unknown";
  const transactionId = checkoutId || paddleTransactionId;

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Failure Card */}
        <div className="bg-surface border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* Header with X icon */}
          <div className="bg-gradient-to-r from-danger/10 to-danger/5 p-8 md:p-12 text-center border-b border-border">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-danger/10 flex items-center justify-center">
                <svg
                  className="w-12 h-12 md:w-14 md:h-14 text-danger"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              {t("payment.failure.title")}
            </h1>
            <p className="text-lg text-text-secondary">
              {t("payment.failure.subtitle")}
            </p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Error details */}
            {(errorMessage || transactionId) && (
              <div className="bg-danger/5 border border-danger/20 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-danger"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary mb-2">
                      {t("payment.failure.error_details")}
                    </h3>
                    {errorMessage && (
                      <p className="text-sm text-text-secondary mb-2">
                        {errorMessage}
                      </p>
                    )}
                    {transactionId && (
                      <div className="space-y-1">
                        <p className="text-xs text-text-secondary font-mono bg-background/50 px-3 py-2 rounded">
                          {checkoutId
                            ? `${t(
                                "payment.failure.checkout_id"
                              )}: ${transactionId}`
                            : `${t(
                                "payment.failure.transaction_id"
                              )}: ${transactionId}`}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {t("payment.failure.provider")}: {paymentProvider}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Common reasons */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                {t("payment.failure.common_reasons")}
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-danger mt-2 flex-shrink-0" />
                  <p className="text-text-secondary">
                    {t("payment.failure.reason_insufficient_funds")}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-danger mt-2 flex-shrink-0" />
                  <p className="text-text-secondary">
                    {t("payment.failure.reason_incorrect_details")}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-danger mt-2 flex-shrink-0" />
                  <p className="text-text-secondary">
                    {t("payment.failure.reason_expired_card")}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-danger mt-2 flex-shrink-0" />
                  <p className="text-text-secondary">
                    {t("payment.failure.reason_bank_declined")}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-danger mt-2 flex-shrink-0" />
                  <p className="text-text-secondary">
                    {t("payment.failure.reason_network_issue")}
                  </p>
                </div>
              </div>
            </div>

            {/* What to do next */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                {t("payment.failure.what_to_do")}
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{t("payment.failure.suggestion_verify_details")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{t("payment.failure.suggestion_check_balance")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{t("payment.failure.suggestion_try_different")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{t("payment.failure.suggestion_contact_bank")}</span>
                </li>
              </ul>
            </div>

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
                {t("payment.failure.back_to_dashboard")}
              </button>
            </div>
          </div>

          {/* Footer - Contact Support */}
          <div className="bg-background/30 border-t border-border px-8 md:px-12 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <p className="text-sm text-text-secondary">
                  {t("payment.failure.need_help")}
                </p>
              </div>
              <button
                onClick={() => handleContactSupport(t)}
                className="px-4 py-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {t("payment.failure.contact_support")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailurePage;
