import type { ProspectiveMember } from "@ahmedrioueche/gympro-client";
import { ChevronRight, MapPin, Send, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TextArea from "../../../../../../components/ui/TextArea";
import { useModalStore } from "../../../../../../store/modal";
import { useSendCoachRequest } from "../hooks/useSendCoachRequest";

interface ProspectiveMemberCardProps {
  member: ProspectiveMember;
}

export function ProspectiveMemberCard({ member }: ProspectiveMemberCardProps) {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const name = member.fullName || member.username;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 group relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

      {/* Member Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-background">
          {member.profileImageUrl ? (
            <img
              src={member.profileImageUrl}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(name)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-text-primary truncate group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-text-secondary truncate">
            @{member.username}
          </p>
        </div>
      </div>

      {/* Member Info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2.5 text-sm text-text-secondary">
          <div className="p-1.5 bg-background rounded-lg border border-border">
            <MapPin className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="truncate">
            {member.location?.city
              ? [
                  member.location.city,
                  member.location.state,
                  member.location.country,
                ]
                  .filter(Boolean)
                  .join(", ")
              : t("common.locationUnknown", "Location unknown")}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-sm text-text-secondary">
          <div className="p-1.5 bg-background rounded-lg border border-border">
            <User className="w-3.5 h-3.5 text-secondary" />
          </div>
          <span>
            {member.hasCoach
              ? t("coach.clients.prospectiveMembers.hasCoach")
              : t(
                  "coach.clients.prospectiveMembers.lookingForCoach",
                  "Looking for a coach",
                )}
          </span>
        </div>
      </div>

      {/* Message Form */}
      {showMessageForm ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("coach.clients.modals.respond.messagePlaceholder", {
              memberName: name,
            })}
            className="text-sm"
            rows={3}
            autoFocus
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSendRequest}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 font-bold text-sm shadow-lg shadow-primary/20"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
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
              className="px-4 py-2.5 bg-background border border-border text-text-secondary rounded-xl hover:bg-surface transition-all disabled:opacity-50 text-sm font-medium"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 pt-2">
          <button
            onClick={() =>
              openModal("member_profile", { memberId: member.userId })
            }
            className="flex-1 px-4 py-2.5 bg-background border border-border text-text-secondary rounded-xl hover:border-primary hover:text-primary transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2"
          >
            {t("members.card.viewProfile")}
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowMessageForm(true)}
            disabled={member.hasCoach}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm shadow-md shadow-primary/10"
          >
            <Send className="w-4 h-4" />
            {member.hasCoach
              ? t("coach.clients.prospectiveMembers.alreadySent")
              : t("coach.clients.prospectiveMembers.sendRequest")}
          </button>
        </div>
      )}
    </div>
  );
}
