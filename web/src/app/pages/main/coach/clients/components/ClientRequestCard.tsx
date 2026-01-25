import type { CoachRequestWithDetails } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Check, MapPin, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../../../store/modal";
import { useRespondToRequest } from "../hooks/useRespondToRequest";

interface ClientRequestCardProps {
  request: CoachRequestWithDetails;
  isSent?: boolean;
}

const getAvatarColor = () => {
  const colors = [
    "bg-gradient-to-br from-primary to-primary-dark",
    "bg-gradient-to-br from-blue-500 to-blue-700",
    "bg-gradient-to-br from-purple-500 to-purple-700",
    "bg-gradient-to-br from-pink-500 to-pink-700",
    "bg-gradient-to-br from-green-500 to-green-700",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function ClientRequestCard({
  request,
  isSent = false,
}: ClientRequestCardProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [actionType, setActionType] = useState<"accept" | "decline" | null>(
    null,
  );

  const { mutate: respondToRequest, isPending } = useRespondToRequest();

  const handleRespond = (action: "accept" | "decline") => {
    setActionType(action);
    setShowResponse(true);
  };

  const handleSubmit = () => {
    if (!actionType) return;

    respondToRequest(
      {
        requestId: request._id,
        data: {
          action: actionType,
          response: responseMessage || undefined,
        },
      },
      {
        onSuccess: () => {
          setShowResponse(false);
          setResponseMessage("");
          setActionType(null);
        },
      },
    );
  };

  const memberName =
    request.memberDetails?.fullName || request.memberDetails?.username;

  return (
    <div
      onClick={() =>
        openModal("member_profile", { memberId: request.memberId })
      }
      className="bg-surface cursor-pointer border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 group"
    >
      {/* Avatar and Name */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-16 h-16 rounded-full ${getAvatarColor()} flex items-center justify-center text-white text-xl font-bold shadow-lg`}
        >
          {request.memberDetails?.profileImageUrl ? (
            <img
              src={request.memberDetails.profileImageUrl}
              alt={memberName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(memberName)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-text-primary truncate group-hover:text-primary transition-colors">
            {memberName}
          </h3>
          {request.memberDetails?.location && (
            <p className="text-sm text-text-secondary flex items-center gap-1 mt-1 truncate">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {request.memberDetails.location}
            </p>
          )}
        </div>
      </div>

      {/* Status and Time */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {isSent && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-surface-dark border-border text-text-secondary">
            {t(
              `coach.clients.requests.status.${request.status}`,
              request.status,
            )}
          </span>
        )}
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-background text-text-secondary">
          ⏱️ {formatDistanceToNow(new Date(request.createdAt))} ago
        </span>
      </div>

      {/* Member Message */}
      {request.message && (
        <div className="mb-4 p-4 bg-background border border-border rounded-xl">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">
              {isSent
                ? t(
                    "coach.clients.pendingRequests.messageLabel.sent",
                    "Message from coach",
                  )
                : t("coach.clients.pendingRequests.messageLabel")}
            </span>
          </div>
          <p className="text-text-primary text-sm leading-relaxed">
            {request.message}
          </p>
        </div>
      )}

      {/* Response Form */}
      {showResponse && (
        <div
          className="mb-4 p-4 bg-background border border-border rounded-xl space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t("coach.clients.pendingRequests.respondLabel")}
            </label>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder={t(
                "coach.clients.modals.respond.messagePlaceholder",
                {
                  memberName,
                },
              )}
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                actionType === "accept"
                  ? "bg-success text-white hover:bg-success-dark hover:shadow-lg hover:shadow-success/30"
                  : "bg-error text-white hover:bg-error-dark hover:shadow-lg hover:shadow-error/30"
              }`}
            >
              {isPending
                ? t("common.processing")
                : actionType === "accept"
                  ? t("coach.clients.modals.respond.acceptButton")
                  : t("coach.clients.modals.respond.declineButton")}
            </button>
            <button
              onClick={() => {
                setShowResponse(false);
                setResponseMessage("");
                setActionType(null);
              }}
              disabled={isPending}
              className="px-4 py-2.5 bg-background border border-border text-text-secondary rounded-lg hover:border-text-secondary transition-all duration-300 disabled:opacity-50"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {!isSent && !showResponse && (
        <div className="flex gap-2 pt-4 border-t border-border">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRespond("accept");
            }}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 bg-success/10 text-success rounded-lg hover:bg-success hover:text-white transition-all duration-300 font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {t("coach.clients.pendingRequests.accept")}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRespond("decline");
            }}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 bg-background border border-border text-text-secondary rounded-lg hover:border-error hover:text-error hover:bg-error/5 transition-all duration-300 font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            {t("coach.clients.pendingRequests.decline")}
          </button>
        </div>
      )}
    </div>
  );
}
