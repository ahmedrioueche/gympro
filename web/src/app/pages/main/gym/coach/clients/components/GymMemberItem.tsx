import type { ProspectiveMember } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../../../../store/modal";
import { MemberCard } from "../../../../../../components/cards/MemberCard";
import { useSendCoachRequest } from "../../../../coach/clients/hooks/useSendCoachRequest";
import type { MemberDisplay } from "../../../manager/members/components/types";

function GymMemberItem({ member }: { member: ProspectiveMember }) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");
  const { mutate: sendRequest, isPending } = useSendCoachRequest();

  const handleSendRequest = () => {
    sendRequest(
      {
        memberId: member.userId,
        data: { message: message || undefined },
        memberName: member.fullName || member.username,
      },
      {
        onSuccess: () => {
          setShowMessageForm(false);
          setMessage("");
        },
      },
    );
  };

  const memberDisplay: MemberDisplay = {
    _id: member.userId,
    name: member.fullName || member.username,
    email: member.email || "",
    phone: member.phone || "",
    avatar: member.profileImageUrl,
    status: member.hasCoach ? "has_coach" : "active",
    joinDate: member.joinedAt || "",
  };

  const actionContent = (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      {showMessageForm ? (
        <div className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t(
              "coach.clients.modals.sendRequest.messagePlaceholder",
              "Add a message...",
            )}
            className="w-full px-4 py-2 bg-surface-dark border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none"
            rows={3}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSendRequest();
              }}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 font-medium text-sm"
            >
              {isPending
                ? t("common.processing", "Sending...")
                : t("coach.clients.modals.sendRequest.send", "Send Request")}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMessageForm(false);
                setMessage("");
              }}
              disabled={isPending}
              className="px-4 py-2 bg-surface-dark text-text-secondary rounded-lg hover:bg-surface-darker transition-colors disabled:opacity-50 text-sm"
            >
              {t("common.cancel", "Cancel")}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() =>
              openModal("member_profile", { memberId: member.userId })
            }
            className="flex-1 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 font-medium text-sm"
          >
            {t("members.card.viewProfile", "View Profile")}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMessageForm(true);
            }}
            disabled={member.hasCoach}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            {member.hasCoach
              ? t("coach.clients.prospectiveMembers.alreadySent", "Sent")
              : t("coach.clients.prospectiveMembers.sendRequest", "Request")}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <MemberCard
      member={memberDisplay}
      customActions={actionContent}
      onViewProfile={() =>
        openModal("member_profile", { memberId: member.userId })
      }
    />
  );
}
export default GymMemberItem;
