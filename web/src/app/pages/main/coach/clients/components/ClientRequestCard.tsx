import type { CoachRequestWithDetails } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Check, MapPin, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRespondToRequest } from "../hooks/useRespondToRequest";

interface ClientRequestCardProps {
  request: CoachRequestWithDetails;
}

export function ClientRequestCard({ request }: ClientRequestCardProps) {
  const { t } = useTranslation();
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [actionType, setActionType] = useState<"accept" | "decline" | null>(
    null
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
      }
    );
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:border-border-hover transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold">
            {request.memberDetails?.fullName?.[0] ||
              request.memberDetails?.username[0]}
          </div>

          {/* Request Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary">
              {request.memberDetails?.fullName ||
                request.memberDetails?.username}
            </h3>
            {request.memberDetails?.location && (
              <p className="text-sm text-text-secondary flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {request.memberDetails.location}
              </p>
            )}
            <p className="text-xs text-text-secondary mt-2">
              {formatDistanceToNow(new Date(request.createdAt))} ago
            </p>
          </div>
        </div>

        {/* Actions */}
        {!showResponse && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRespond("accept")}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success-dark transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {t("coach.clients.pendingRequests.accept")}
            </button>
            <button
              onClick={() => handleRespond("decline")}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-surface-dark text-text-secondary rounded-lg hover:bg-surface-darker transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              {t("coach.clients.pendingRequests.decline")}
            </button>
          </div>
        )}
      </div>

      {/* Member Message */}
      {request.message && (
        <div className="mt-4 p-4 bg-surface-dark rounded-lg">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
            <MessageSquare className="w-4 h-4" />
            {t("coach.clients.pendingRequests.messageLabel")}
          </div>
          <p className="text-text-primary">{request.message}</p>
        </div>
      )}

      {/* Response Form */}
      {showResponse && (
        <div className="mt-4 p-4 bg-surface-darker rounded-lg space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              {t("coach.clients.pendingRequests.respondLabel")}
            </label>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder={t(
                "coach.clients.modals.respond.messagePlaceholder",
                {
                  memberName:
                    request.memberDetails?.fullName ||
                    request.memberDetails?.username,
                }
              )}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                actionType === "accept"
                  ? "bg-success text-white hover:bg-success-dark"
                  : "bg-error text-white hover:bg-error-dark"
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
              className="px-4 py-2 bg-surface-dark text-text-secondary rounded-lg hover:bg-surface-darker transition-colors disabled:opacity-50"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
