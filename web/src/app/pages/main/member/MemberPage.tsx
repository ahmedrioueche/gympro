import { Loader2, RefreshCw, Shield } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccessToken } from "../../../../hooks/queries/useAttendance";
import { useGymStore } from "../../../../store/gym";

function MemberPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const [timeLeft, setTimeLeft] = useState(30);

  const {
    data: tokenData,
    isLoading,
    error,
    dataUpdatedAt,
  } = useAccessToken(currentGym?._id);

  // Calculate time remaining
  useEffect(() => {
    if (!tokenData?.data?.expiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(
        0,
        Math.floor((tokenData.data.expiresAt - now) / 1000)
      );
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenData?.data?.expiresAt, dataUpdatedAt]);

  if (!currentGym) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 mx-auto text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-300">
            {t("memberAccess.selectGym")}
          </h2>
          <p className="text-gray-500">{t("memberAccess.noMemberships")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {t("memberAccess.title")}
        </h1>
        <p className="text-gray-400">{t("memberAccess.subtitle")}</p>
      </div>

      {/* QR Code Card */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
        <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 space-y-6">
          {/* Gym Info */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold text-gray-200">
              {currentGym.name}
            </h2>
            <p className="text-sm text-gray-500">{currentGym.address || ""}</p>
          </div>

          {/* QR Code Display */}
          <div className="flex justify-center">
            {isLoading ? (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-800/50 rounded-xl">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              </div>
            ) : error ? (
              <div className="w-64 h-64 flex items-center justify-center bg-red-500/10 rounded-xl border border-red-500/20">
                <div className="text-center space-y-2 p-4">
                  <Shield className="w-12 h-12 mx-auto text-red-400" />
                  <p className="text-sm text-red-400">
                    {t("memberAccess.error")}
                  </p>
                </div>
              </div>
            ) : tokenData?.data?.token ? (
              <div className="p-6 bg-white rounded-xl shadow-2xl">
                <QRCodeSVG
                  value={tokenData.data.token}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
            ) : null}
          </div>

          {/* Timer and Status */}
          {tokenData?.data?.token && !error && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-sm">
                <RefreshCw
                  className={`w-4 h-4 ${
                    timeLeft <= 5
                      ? "animate-spin text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-mono font-semibold ${
                    timeLeft <= 5
                      ? "text-yellow-400"
                      : timeLeft <= 10
                      ? "text-orange-400"
                      : "text-green-400"
                  }`}
                >
                  {t("memberAccess.validFor", { seconds: timeLeft })}
                </span>
              </div>

              <div className="text-center text-xs text-gray-500">
                {t("memberAccess.autoRefresh")}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="pt-4 border-t border-gray-800">
            <p className="text-center text-sm text-gray-400">
              {t("memberAccess.instructions")}
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-300">
              Secure Access Code
            </p>
            <p className="text-xs text-gray-400">
              This QR code is unique to you and refreshes every 30 seconds for
              maximum security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberPage;
