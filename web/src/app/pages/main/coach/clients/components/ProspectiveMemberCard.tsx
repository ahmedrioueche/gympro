import type { ProspectiveMember } from "@ahmedrioueche/gympro-client";
import { MapPin, Send, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSendCoachRequest } from "../hooks/useSendCoachRequest";

interface ProspectiveMemberCardProps {
  member: ProspectiveMember;
}

export function ProspectiveMemberCard({ member }: ProspectiveMemberCardProps) {
  const { t } = useTranslation();
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const { mutate: sendRequest, isPending } = useSendCoachRequest();

  const handleSendRequest = () => {
    sendRequest(
      {
        memberId: member.userId,
        data: { message: message || undefined },
      },
      {
        onSuccess: () => {
          setShowMessageForm(false);
          setMessage("");
        },
      }
    );
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:border-border-hover transition-colors">
      {/* Member Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-lg">
          {member.fullName?.[0] || member.username[0]}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary">
            {member.fullName || member.username}
          </h3>
          <p className="text-sm text-text-secondary">@{member.username}</p>
        </div>
      </div>

      {/* Member Info */}
      <div className="space-y-2 mb-4">
        {member.location?.city && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="w-4 h-4" />
            <span>
              {[
                member.location.city,
                member.location.state,
                member.location.country,
              ]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <User className="w-4 h-4" />
          <span>
            {member.hasCoach
              ? t("coach.clients.prospectiveMembers.hasCoach")
              : "Looking for a coach"}
          </span>
        </div>
      </div>

      {/* Message Form */}
      {showMessageForm && (
        <div className="mb-4 space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t(
              "coach.clients.modals.sendRequest.messagePlaceholder"
            )}
            className="w-full px-4 py-2 bg-surface-dark border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none"
            rows={3}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSendRequest}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 font-medium"
            >
              <Send className="w-4 h-4" />
              {isPending
                ? t("common.processing")
                : t("coach.clients.modals.sendRequest.send")}
            </button>
            <button
              onClick={() => {
                setShowMessageForm(false);
                setMessage("");
              }}
              disabled={isPending}
              className="px-4 py-2 bg-surface-dark text-text-secondary rounded-lg hover:bg-surface-darker transition-colors disabled:opacity-50"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Action Button */}
      {!showMessageForm && (
        <button
          onClick={() => setShowMessageForm(true)}
          disabled={member.hasCoach}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Send className="w-4 h-4" />
          {member.hasCoach
            ? t("coach.clients.prospectiveMembers.alreadySent")
            : t("coach.clients.prospectiveMembers.sendRequest")}
        </button>
      )}
    </div>
  );
}
