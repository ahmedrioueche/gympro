import type { CoachRequestWithDetails } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Check, Clock, MapPin, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../../../store/modal";
import { useRespondToRequest } from "../hooks/useRespondToRequest";

interface ClientRequestCardProps {
  request: CoachRequestWithDetails;
  isSent?: boolean;
}

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

  const name =
    request.memberDetails?.fullName || request.memberDetails?.username;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      onClick={() =>
        openModal("member_profile", { memberId: request.memberId })
      }
      className="bg-surface cursor-pointer border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
    >
      {/* Glow Effect for pending */}
      {!isSent && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl -mr-12 -mt-12" />
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-background">
          {request.memberDetails?.profileImageUrl ? (
            <img
              src={request.memberDetails.profileImageUrl}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(name || "")
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-text-primary truncate group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-xs text-text-secondary bg-background px-2 py-1 rounded-lg border border-border">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(request.createdAt), {
                addSuffix: true,
              })}
            </span>
            {isSent && (
              <span
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                  request.status === "pending"
                    ? "bg-warning/10 text-warning border-warning/20"
                    : request.status === "accepted"
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-error/10 text-error border-error/20"
                }`}
              >
                {request.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Member Details Mini-Info */}
      {request.memberDetails?.location && (
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-4 px-1">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="truncate">{request.memberDetails.location}</span>
        </div>
      )}

      {/* Message Bubble */}
      {request.message && (
        <div className="mb-6 relative">
          <div className="p-4 bg-background border border-border rounded-2xl rounded-tl-none italic text-text-primary text-sm leading-relaxed shadow-inner">
            <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2 not-italic">
              <MessageSquare className="w-3 h-3 text-primary" />
              {isSent
                ? t("coach.clients.pendingRequests.messageLabelSent")
                : t("coach.clients.pendingRequests.messageLabel")}
            </div>
            "{request.message}"
          </div>
        </div>
      )}

      {/* Response Form */}
      {showResponse ? (
        <div
          className="p-4 bg-background border border-border rounded-2xl space-y-4 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
              {t("coach.clients.pendingRequests.respondLabel")}
            </label>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder={t(
                "coach.clients.modals.respond.messagePlaceholder",
                {
                  memberName: name,
                },
              )}
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all text-sm"
              rows={3}
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className={`flex-1 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 text-white shadow-lg ${
                actionType === "accept"
                  ? "bg-primary hover:bg-primary-dark shadow-primary/20"
                  : "bg-danger hover:bg-danger-dark shadow-danger/20"
              }`}
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : actionType === "accept" ? (
                t("coach.clients.modals.respond.acceptButton")
              ) : (
                t("coach.clients.modals.respond.declineButton")
              )}
            </button>
            <button
              onClick={() => {
                setShowResponse(false);
                setResponseMessage("");
                setActionType(null);
              }}
              disabled={isPending}
              className="px-4 py-2.5 bg-surface border border-border text-text-secondary rounded-xl hover:bg-surface-hover transition-all text-sm font-bold"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      ) : (
        /* Card Actions */
        !isSent && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRespond("accept");
              }}
              disabled={isPending}
              className="flex-1 px-4 py-3 bg-success text-white rounded-xl hover:bg-success-dark transition-all duration-300 font-bold text-sm shadow-lg shadow-success/10 flex items-center justify-center gap-2"
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
              className="px-4 py-3 bg-error text-white rounded-xl hover:bg-error-dark transition-all duration-300 font-bold text-sm shadow-lg shadow-error/10 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      )}
    </div>
  );
}
